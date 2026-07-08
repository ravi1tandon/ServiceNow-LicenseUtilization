// Monthly license-consumption snapshot.
// For each active category, records purchased (sum of purchase records) and consumed
// (live count of the real consumer records defined by the category's source query) for the
// current YYYY-MM. Upserts, so re-running in the same month refreshes the row. Builds MoM history.
;(function runSnapshot() {
    var CAT = 'x_1983_licutil_category'
    var PUR = 'x_1983_licutil_purchase'
    var CON = 'x_1983_licutil_consumption'

    var analytics = new x_1983_licutil.LicenseAnalytics()
    var now = new GlideDateTime()
    var period = now.getValue().substring(0, 7) // 'YYYY-MM' (UTC internal)
    var today = now.getDate().getValue() // 'YYYY-MM-DD'

    function sumPurchased(categoryId) {
        var total = 0
        var g = new GlideRecord(PUR)
        g.addQuery('category', categoryId)
        g.query()
        while (g.next()) { total += parseInt(g.getValue('licenses_purchased') || '0', 10) }
        return total
    }

    var processed = 0
    var cat = new GlideRecord(CAT)
    cat.addActiveQuery()
    cat.query()
    while (cat.next()) {
        var catId = cat.getUniqueValue()
        var purchased = sumPurchased(catId)
        var consumed = analytics.consumedFor(cat).consumed // live consumed units (SU-adjusted)
        var util = purchased > 0 ? Math.round((consumed / purchased) * 10000) / 100 : 0

        var snap = new GlideRecord(CON)
        snap.addQuery('category', catId)
        snap.addQuery('period_month', period)
        snap.query()
        if (snap.next()) {
            snap.setValue('purchased', purchased)
            snap.setValue('consumed', consumed)
            snap.setValue('utilization_pct', util)
            snap.setValue('snapshot_date', today)
            snap.update()
        } else {
            snap.initialize()
            snap.setValue('category', catId)
            snap.setValue('period_month', period)
            snap.setValue('purchased', purchased)
            snap.setValue('consumed', consumed)
            snap.setValue('utilization_pct', util)
            snap.setValue('snapshot_date', today)
            snap.insert()
        }
        processed++
    }
    gs.info('[LicenseUtilization] Monthly snapshot complete for ' + period + ': ' + processed + ' category(ies).')
})()
