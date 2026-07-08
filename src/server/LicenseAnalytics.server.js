var LicenseAnalytics = Class.create()
LicenseAnalytics.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    CAT: 'x_1983_licutil_category',
    PUR: 'x_1983_licutil_purchase',
    CON: 'x_1983_licutil_consumption',

    // GlideAjax entry point. Returns the full dashboard payload as a JSON string.
    getDashboardData: function () {
        return JSON.stringify(this.buildPayload())
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
            cats[id] = {
                id: id,
                name: gr.getValue('name') || '',
                sku: gr.getValue('sku_code') || '',
                capability: gr.getDisplayValue('capability') || '',
                purchased: 0,
                consumed: parseInt(gr.getValue('current_consumed') || '0', 10),
                utilization: 0,
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
            if (cats[pcat]) {
                cats[pcat].purchased += parseInt(pg.getValue('licenses_purchased') || '0', 10)
            }
        }

        // Monthly consumption snapshots.
        var monthsSet = {}
        var cg = new GlideRecord(this.CON)
        cg.orderBy('period_month')
        cg.query()
        while (cg.next()) {
            var ccat = cg.getValue('category')
            if (!cats[ccat]) continue
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

        // Per-category series aligned to the global month axis + current utilization.
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

        // Overall MoM series (summed across categories).
        var overall = []
        for (var k = 0; k < months.length; k++) {
            var mp = 0
            var mc = 0
            for (var q = 0; q < categories.length; q++) {
                var pt = categories[q].series[k]
                mp += pt.purchased
                mc += pt.consumed
            }
            overall.push({
                month: months[k],
                purchased: mp,
                consumed: mc,
                utilization: mp > 0 ? this._round((mc / mp) * 100) : 0,
            })
        }

        // Month-over-month deltas (latest vs. previous month).
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

    _round: function (n) {
        return Math.round(n * 100) / 100
    },

    type: 'LicenseAnalytics',
})
