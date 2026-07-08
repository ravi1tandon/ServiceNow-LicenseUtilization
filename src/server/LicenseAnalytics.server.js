/* eslint-disable no-unsupported-node-builtins */
// `global` here is the ServiceNow global application scope (not Node.js). A scoped
// client-callable script include must extend global.AbstractAjaxProcessor.
var LicenseAnalytics = Class.create()
LicenseAnalytics.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    CAT: 'x_1983_licutil_category',
    PUR: 'x_1983_licutil_purchase',
    CON: 'x_1983_licutil_consumption',
    LIST_LIMIT: 100,

    // GlideAjax entry point. Returns the full dashboard payload as a JSON string.
    getDashboardData: function () {
        return JSON.stringify(this.buildPayload())
    },

    // GlideAjax: email the current user a summary of the dashboard. Fires a scoped event that
    // the "License Utilization Summary" notification turns into an email. Returns {ok,message}.
    emailSummary: function () {
        var userId = gs.getUserID()
        var ug = new GlideRecord('sys_user')
        if (!ug.get(userId)) { return JSON.stringify({ ok: false, message: 'Could not resolve your user record.' }) }
        var email = ug.getValue('email')
        if (!email) { return JSON.stringify({ ok: false, message: 'No email address is set on your user record.' }) }
        gs.eventQueue('x_1983_licutil.summary.email', ug, userId, email)
        return JSON.stringify({ ok: true, message: 'Summary email queued to ' + email + '. It should arrive shortly.' })
    },

    // Count the real records that consume a license. With refField, counts DISTINCT values of
    // that field (e.g. distinct users on sys_user_has_role) by grouping — this matches the
    // drill-down list exactly. Without refField, counts matching rows.
    countConsumers: function (table, query, refField) {
        if (!table) { return 0 }
        try {
            if (refField) {
                var ga = new GlideAggregate(table)
                if (query) { ga.addEncodedQuery(query) }
                ga.groupBy(refField)
                ga.query()
                var n = 0
                while (ga.next()) {
                    if (ga.getValue(refField)) { n++ } // one group per distinct non-empty value
                }
                return n
            }
            var gr = new GlideRecord(table)
            if (query) { gr.addEncodedQuery(query) }
            gr.query()
            return gr.getRowCount()
        } catch (e) {
            gs.error('[LicenseUtilization] countConsumers failed for ' + table + ' / ' + query + ': ' + e)
        }
        return 0
    },

    // Convert a raw record count into consumed units, applying the ITOM subscription-unit
    // ratio when configured (consumed = ceil(records / su_ratio)); otherwise 1:1.
    toConsumed: function (rawCount, countMode, suRatio) {
        var ratio = parseInt(suRatio || '1', 10)
        if (countMode === 'subscription_units' && ratio > 1) {
            return Math.ceil(rawCount / ratio)
        }
        return rawCount
    },

    // List the actual consumer records (capped) for drill-down validation.
    listConsumers: function (table, query, refField, refTable, limit) {
        var out = []
        if (!table) { return out }
        try {
            var seen = {}
            var gr = new GlideRecord(table)
            if (query) { gr.addEncodedQuery(query) }
            if (refField) { gr.orderBy(refField) }
            gr.setLimit(limit > 0 ? limit : this.LIST_LIMIT)
            gr.query()
            while (gr.next()) {
                var id, label, tbl
                if (refField) { id = gr.getValue(refField); label = gr.getDisplayValue(refField); tbl = refTable || '' }
                else { id = gr.getUniqueValue(); label = gr.getDisplayValue(); tbl = table }
                if (!id || seen[id]) { continue }
                seen[id] = 1
                out.push({ sys_id: id, label: label || id, table: tbl })
            }
        } catch (e) {
            gs.error('[LicenseUtilization] listConsumers failed for ' + table + ' / ' + query + ': ' + e)
        }
        return out
    },

    // Live figures for one category: { raw, consumed }. raw = actual records (drill-down count);
    // consumed = licensed units after the subscription-unit ratio. Source-based, else manual.
    consumedFor: function (catGr) {
        var st = catGr.getValue('source_table')
        if (st) {
            var raw = this.countConsumers(st, catGr.getValue('source_query'), catGr.getValue('consumer_ref_field'))
            var consumed = this.toConsumed(raw, catGr.getValue('count_mode'), catGr.getValue('su_ratio'))
            return { raw: raw, consumed: consumed }
        }
        var manual = parseInt(catGr.getValue('current_consumed') || '0', 10)
        return { raw: manual, consumed: manual }
    },

    // Reusable server-side builder (also callable from server scripts / tests).
    buildPayload: function () {
        var cats = {}
        var order = []
        var gr = new GlideRecord(this.CAT)
        gr.addActiveQuery()
        gr.orderBy('capability')
        gr.orderBy('name')
        gr.query()
        while (gr.next()) {
            var id = gr.getUniqueValue()
            var st = gr.getValue('source_table')
            var sq = gr.getValue('source_query')
            var rf = gr.getValue('consumer_ref_field')
            var rt = gr.getValue('consumer_table')
            var consumers = st ? this.listConsumers(st, sq, rf, rt, this.LIST_LIMIT) : []
            var fig = this.consumedFor(gr)
            var mode = gr.getValue('count_mode') || 'records'
            var ratio = parseInt(gr.getValue('su_ratio') || '1', 10)
            cats[id] = {
                id: id,
                name: gr.getValue('name') || '',
                sku: gr.getValue('sku_code') || '',
                capability: gr.getDisplayValue('capability') || '',
                purchased: 0,
                consumed: fig.consumed,
                raw_count: fig.raw,
                count_mode: mode,
                su_ratio: ratio,
                utilization: 0,
                source_table: st || '',
                source_query: sq || '',
                consumer_count: fig.raw,
                consumers: consumers,
                consumer_more: st ? (fig.raw > consumers.length) : false,
                byMonth: {},
                series: [],
            }
            order.push(id)
        }

        // Purchased totals per category.
        var pg = new GlideRecord(this.PUR)
        pg.query()
        while (pg.next()) {
            var pcat = pg.getValue('category')
            if (cats[pcat]) { cats[pcat].purchased += parseInt(pg.getValue('licenses_purchased') || '0', 10) }
        }

        // Monthly consumption snapshots + raw rows.
        var monthsSet = {}
        var cg = new GlideRecord(this.CON)
        cg.orderBy('category')
        cg.orderBy('period_month')
        cg.query()
        while (cg.next()) {
            var ccat = cg.getValue('category')
            if (!cats[ccat]) { continue }
            var m = cg.getValue('period_month') || ''
            monthsSet[m] = true
            cats[ccat].byMonth[m] = {
                month: m,
                purchased: parseInt(cg.getValue('purchased') || '0', 10),
                consumed: parseInt(cg.getValue('consumed') || '0', 10),
                utilization: parseFloat(cg.getValue('utilization_pct') || '0'),
            }
        }

        var months = Object.keys(monthsSet).sort()

        var categories = []
        var totalPurchased = 0
        var totalConsumed = 0
        for (var i = 0; i < order.length; i++) {
            var c = cats[order[i]]
            c.utilization = c.purchased > 0 ? this._round((c.consumed / c.purchased) * 100) : 0
            for (var j = 0; j < months.length; j++) {
                var mm = months[j]
                c.series.push(c.byMonth[mm] || { month: mm, purchased: 0, consumed: 0, utilization: 0 })
            }
            delete c.byMonth
            categories.push(c)
            totalPurchased += c.purchased
            totalConsumed += c.consumed
        }

        var overall = []
        for (var k = 0; k < months.length; k++) {
            var mp = 0
            var mc = 0
            for (var q = 0; q < categories.length; q++) {
                var ptn = categories[q].series[k]
                mp += ptn.purchased
                mc += ptn.consumed
            }
            overall.push({ month: months[k], purchased: mp, consumed: mc, utilization: mp > 0 ? this._round((mc / mp) * 100) : 0 })
        }

        var mom = { consumed_delta_pct: 0, utilization_delta: 0, has_prior: false }
        if (overall.length >= 2) {
            var cur = overall[overall.length - 1]
            var prev = overall[overall.length - 2]
            mom.has_prior = true
            mom.consumed_delta_pct = prev.consumed > 0 ? this._round(((cur.consumed - prev.consumed) / prev.consumed) * 100) : 0
            mom.utilization_delta = this._round(cur.utilization - prev.utilization)
        }

        return {
            generated: new GlideDateTime().getDisplayValue(),
            totals: {
                purchased: totalPurchased,
                consumed: totalConsumed,
                utilization: totalPurchased > 0 ? this._round((totalConsumed / totalPurchased) * 100) : 0,
                categories: categories.length,
            },
            months: months,
            overall_series: overall,
            mom: mom,
            categories: categories,
        }
    },

    _round: function (n) { return Math.round(n * 100) / 100 },

    type: 'LicenseAnalytics',
})
