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

    // Count the real records that consume a license (distinct consumer_ref_field, or rows).
    countConsumers: function (table, query, refField) {
        if (!table) { return 0 }
        try {
            var ga = new GlideAggregate(table)
            if (query) { ga.addEncodedQuery(query) }
            if (refField) { ga.addAggregate('COUNT DISTINCT', refField) } else { ga.addAggregate('COUNT') }
            ga.query()
            if (ga.next()) {
                return parseInt(ga.getAggregate(refField ? 'COUNT DISTINCT' : 'COUNT', refField || null), 10) || 0
            }
        } catch (e) {
            gs.error('[LicenseUtilization] countConsumers failed for ' + table + ' / ' + query + ': ' + e)
        }
        return 0
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

    // Live consumed count for one category GlideRecord (source-based, else manual fallback).
    consumedFor: function (catGr) {
        var st = catGr.getValue('source_table')
        if (st) {
            return this.countConsumers(st, catGr.getValue('source_query'), catGr.getValue('consumer_ref_field'))
        }
        return parseInt(catGr.getValue('current_consumed') || '0', 10)
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
            var consumed = this.consumedFor(gr)
            cats[id] = {
                id: id,
                name: gr.getValue('name') || '',
                sku: gr.getValue('sku_code') || '',
                capability: gr.getDisplayValue('capability') || '',
                purchased: 0,
                consumed: consumed,
                utilization: 0,
                source_table: st || '',
                source_query: sq || '',
                consumer_count: consumed,
                consumers: consumers,
                consumer_more: st ? (consumed > consumers.length) : false,
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
