/* eslint-disable no-restricted-globals */
// Client script for the License Utilization UI Page. Runs in the browser; fetches
// aggregated data via GlideAjax and renders interactive SVG charts + per-SKU cards.
var LIC = { data: null, tab: 'overview' }
var LIC_PALETTE = ['#4b4bd6', '#0a7d33', '#e0a21a', '#c0341d', '#8a2be2', '#0aa2a2', '#d6337a', '#5a6b7b']

function licEsc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
function licById(id) { return document.getElementById(id) }
function licNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

function licRefresh() {
    var status = licById('lic-status')
    if (status) { status.style.display = ''; status.innerHTML = 'Loading dashboard data…' }
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics')
    ga.addParam('sysparm_name', 'getDashboardData')
    ga.getXMLAnswer(function (answer) {
        try { LIC.data = JSON.parse(answer || '{}') }
        catch (e) { LIC.data = { error: 'Could not parse data: ' + e } }
        licRender()
    })
}

function licTab(name) {
    LIC.tab = name
    var tabs = document.getElementsByClassName('lic-tab')
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].getAttribute('data-tab') === name ? 'lic-tab active' : 'lic-tab'
    }
    var panels = ['overview', 'skus', 'trend', 'records']
    for (var j = 0; j < panels.length; j++) {
        var p = licById('lic-panel-' + panels[j])
        if (p) { p.style.display = panels[j] === name ? '' : 'none' }
    }
}

function licRender() {
    var d = LIC.data || {}
    var status = licById('lic-status')
    var gen = licById('lic-generated')
    if (d.error) { if (status) { status.style.display = ''; status.innerHTML = licEsc(d.error) } return }
    if (!d.categories || d.categories.length === 0) {
        if (status) { status.style.display = ''; status.innerHTML = 'No active license categories yet. Add categories and purchase records, then refresh.' }
        if (gen) { gen.innerHTML = 'No data' }
        return
    }
    if (status) { status.style.display = 'none' }
    if (gen) { gen.innerHTML = 'Generated ' + licEsc(d.generated) + ' · ' + d.categories.length + ' SKU(s) · ' + d.months.length + ' month(s)' }
    licRenderOverview(d)
    licRenderSkus(d)
    licRenderTrend(d)
    licRenderRecords(d)
    licTab(LIC.tab)
}

function licRenderOverview(d) {
    var t = d.totals
    var deltaHtml = ''
    if (d.mom && d.mom.has_prior) {
        var cd = d.mom.consumed_delta_pct
        var cls = cd > 0 ? 'k-up' : (cd < 0 ? 'k-down' : '')
        var arrow = cd > 0 ? '▲' : (cd < 0 ? '▼' : '■')
        deltaHtml = '<div class="k-delta ' + cls + '">' + arrow + ' ' + Math.abs(cd) + '% MoM consumption</div>'
    }
    var html = '<div class="lic-grid">'
    html += licKpi('Licenses Purchased', licNum(t.purchased), '')
    html += licKpi('Licenses Consumed', licNum(t.consumed), deltaHtml)
    html += licKpi('Utilization', t.utilization + '%', licUtilDelta(d))
    html += licKpi('Categories / SKUs', licNum(t.categories), '')
    html += '</div>'
    html += '<div class="lic-card"><h3>Consumption vs. Purchased by Month</h3>' + licGroupedBars(d.overall_series)
    html += '<div class="lic-legend"><span><i class="lic-dot" style="background:#4b4bd6"></i>Consumed</span><span><i class="lic-dot" style="background:#c9c9e8"></i>Purchased</span></div></div>'
    html += '<div class="lic-card"><h3>Overall Utilization Trend</h3>' + licLineChart(d.overall_series, 'utilization', '#0a7d33')
    html += '<div class="lic-muted">Utilization % = consumed / purchased.</div></div>'
    licById('lic-panel-overview').innerHTML = html
}

function licUtilDelta(d) {
    if (!d.mom || !d.mom.has_prior) { return '' }
    var u = d.mom.utilization_delta
    var cls = u > 0 ? 'k-up' : (u < 0 ? 'k-down' : '')
    var arrow = u > 0 ? '▲' : (u < 0 ? '▼' : '■')
    return '<div class="k-delta ' + cls + '">' + arrow + ' ' + Math.abs(u) + ' pts MoM</div>'
}
function licKpi(label, value, delta) {
    return '<div class="lic-kpi"><div class="k-label">' + licEsc(label) + '</div><div class="k-value">' + licEsc(value) + '</div>' + (delta || '') + '</div>'
}

function licRenderSkus(d) {
    var html = ''
    for (var i = 0; i < d.categories.length; i++) {
        var c = d.categories[i]
        var color = LIC_PALETTE[i % LIC_PALETTE.length]
        var barCls = c.utilization >= 90 ? 'crit' : (c.utilization >= 75 ? 'warn' : '')
        var pct = Math.min(100, c.utilization)
        html += '<div class="lic-card">'
        html += '<h3>' + licEsc(c.name) + '<span class="lic-badge">' + licEsc(c.capability) + '</span></h3>'
        html += '<div class="lic-muted">SKU: ' + (c.sku ? licEsc(c.sku) : '—') + ' · Purchased ' + licNum(c.purchased) + ' · Consumed ' + licNum(c.consumed) + ' · Utilization ' + c.utilization + '%</div>'
        html += '<div class="lic-bar-wrap"><div class="lic-bar-fill ' + barCls + '" style="width:' + pct + '%"></div></div>'
        html += '<div style="margin-top:10px">' + licSparkline(c.series, color) + '</div>'
        html += '</div>'
    }
    licById('lic-panel-skus').innerHTML = html
}

function licRenderTrend(d) {
    var html = '<div class="lic-card"><h3>Utilization % by SKU - Month over Month</h3>' + licMultiLine(d.categories, d.months)
    var legend = '<div class="lic-legend">'
    for (var i = 0; i < d.categories.length; i++) {
        legend += '<span><i class="lic-dot" style="background:' + LIC_PALETTE[i % LIC_PALETTE.length] + '"></i>' + licEsc(d.categories[i].name) + '</span>'
    }
    html += legend + '</div></div>'
    html += '<div class="lic-card"><h3>Consumption Detail</h3><table class="lic-tbl"><thead><tr><th>Month</th><th>Purchased</th><th>Consumed</th><th>Utilization</th></tr></thead><tbody>'
    for (var j = 0; j < d.overall_series.length; j++) {
        var s = d.overall_series[j]
        html += '<tr><td>' + licEsc(s.month) + '</td><td>' + licNum(s.purchased) + '</td><td>' + licNum(s.consumed) + '</td><td>' + s.utilization + '%</td></tr>'
    }
    html += '</tbody></table></div>'
    licById('lic-panel-trend').innerHTML = html
}

function licRenderRecords(d) {
    var html = '<div class="lic-muted" style="margin-bottom:8px">The actual records consuming each license, so you can validate every count. “Open” goes to the underlying user/device/record; “Open full list” shows all matches in a ServiceNow list.</div>'
    for (var i = 0; i < d.categories.length; i++) {
        var c = d.categories[i]
        html += '<div class="lic-card">'
        html += '<h3>' + licEsc(c.name) + '<span class="lic-badge">' + licEsc(c.capability) + '</span></h3>'
        if (!c.source_table) {
            html += '<div class="lic-muted">No source configured. Set a <b>Source Table</b> / <b>Source Query</b> on this category to enable drill-down.</div></div>'
            continue
        }
        var listUrl = licEsc(c.source_table) + '_list.do'
        if (c.source_query) { listUrl += '?sysparm_query=' + encodeURIComponent(c.source_query) }
        html += '<div class="lic-muted">' + licNum(c.consumer_count) + ' consumer(s) · source: <code>' + licEsc(c.source_table) + '</code>'
        html += c.source_query ? (' · <code>' + licEsc(c.source_query) + '</code>') : ''
        html += ' · <a href="' + listUrl + '" target="_blank" rel="noopener">Open full list</a></div>'
        var cons = c.consumers || []
        if (cons.length) {
            html += '<table class="lic-tbl"><thead><tr><th>Consumer</th><th></th></tr></thead><tbody>'
            for (var k = 0; k < cons.length; k++) {
                var r = cons[k]
                var t = r.table || c.source_table
                var url = t ? (licEsc(t) + '.do?sys_id=' + encodeURIComponent(r.sys_id)) : ''
                html += '<tr><td>' + licEsc(r.label) + '</td><td>' + (url ? ('<a href="' + url + '" target="_blank" rel="noopener">Open</a>') : '') + '</td></tr>'
            }
            html += '</tbody></table>'
            if (c.consumer_more) { html += '<div class="lic-muted">Showing first ' + cons.length + ' of ' + licNum(c.consumer_count) + '. Use “Open full list” to see all.</div>' }
        } else {
            html += '<div class="lic-muted">No matching records.</div>'
        }
        html += '</div>'
    }
    licById('lic-panel-records').innerHTML = html
}

function licSvgOpen(w, h) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="' + h + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' }

function licGroupedBars(series) {
    if (!series || !series.length) { return '<div class="lic-muted">No monthly data.</div>' }
    var W = 720, H = 220, pad = 34, plotH = H - pad * 2, plotW = W - pad * 2, max = 1, i
    for (i = 0; i < series.length; i++) { max = Math.max(max, series[i].purchased, series[i].consumed) }
    var n = series.length, slot = plotW / n, bw = Math.max(4, slot * 0.28), svg = licSvgOpen(W, H)
    svg += '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#ccc"/>'
    for (var j = 0; j < n; j++) {
        var cx = pad + slot * j + slot / 2, ph = (series[j].purchased / max) * plotH, ch = (series[j].consumed / max) * plotH
        svg += '<rect x="' + (cx - bw - 1) + '" y="' + (H - pad - ph) + '" width="' + bw + '" height="' + ph + '" fill="#c9c9e8" rx="2"><title>Purchased ' + series[j].purchased + '</title></rect>'
        svg += '<rect x="' + (cx + 1) + '" y="' + (H - pad - ch) + '" width="' + bw + '" height="' + ch + '" fill="#4b4bd6" rx="2"><title>Consumed ' + series[j].consumed + '</title></rect>'
        svg += '<text x="' + cx + '" y="' + (H - pad + 14) + '" font-size="10" fill="#6b6b80" text-anchor="middle">' + licEsc(series[j].month) + '</text>'
    }
    return svg + '</svg>'
}

function licLineChart(series, key, color) {
    if (!series || !series.length) { return '<div class="lic-muted">No monthly data.</div>' }
    var W = 720, H = 200, pad = 34, plotH = H - pad * 2, plotW = W - pad * 2, max = 1, i
    for (i = 0; i < series.length; i++) { max = Math.max(max, series[i][key]) }
    var n = series.length, step = n > 1 ? plotW / (n - 1) : 0, pts = [], dots = ''
    for (var j = 0; j < n; j++) {
        var x = pad + step * j, y = H - pad - (series[j][key] / max) * plotH
        pts.push(x + ',' + y)
        dots += '<circle cx="' + x + '" cy="' + y + '" r="3" fill="' + color + '"><title>' + licEsc(series[j].month) + ': ' + series[j][key] + '%</title></circle>'
        dots += '<text x="' + x + '" y="' + (H - pad + 14) + '" font-size="10" fill="#6b6b80" text-anchor="middle">' + licEsc(series[j].month) + '</text>'
    }
    var svg = licSvgOpen(W, H)
    svg += '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#ccc"/>'
    svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2"/>'
    return svg + dots + '</svg>'
}

function licMultiLine(categories, months) {
    if (!months || !months.length) { return '<div class="lic-muted">No monthly data.</div>' }
    var W = 720, H = 240, pad = 34, plotH = H - pad * 2, plotW = W - pad * 2
    var n = months.length, step = n > 1 ? plotW / (n - 1) : 0, svg = licSvgOpen(W, H), g, m, c, j
    svg += '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#ccc"/>'
    for (g = 0; g <= 100; g += 25) {
        var gy = H - pad - (g / 100) * plotH
        svg += '<line x1="' + pad + '" y1="' + gy + '" x2="' + (W - pad) + '" y2="' + gy + '" stroke="#f0f0f6"/>'
        svg += '<text x="' + (pad - 6) + '" y="' + (gy + 3) + '" font-size="9" fill="#9a9ab0" text-anchor="end">' + g + '</text>'
    }
    for (m = 0; m < n; m++) {
        svg += '<text x="' + (pad + step * m) + '" y="' + (H - pad + 14) + '" font-size="10" fill="#6b6b80" text-anchor="middle">' + licEsc(months[m]) + '</text>'
    }
    for (c = 0; c < categories.length; c++) {
        var color = LIC_PALETTE[c % LIC_PALETTE.length], pts = []
        for (j = 0; j < n; j++) {
            var u = categories[c].series[j] ? categories[c].series[j].utilization : 0
            pts.push((pad + step * j) + ',' + (H - pad - (Math.min(100, u) / 100) * plotH))
        }
        svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2"/>'
    }
    return svg + '</svg>'
}

function licSparkline(series, color) {
    if (!series || !series.length) { return '<span class="lic-muted">No trend.</span>' }
    var W = 320, H = 46, pad = 4, plotH = H - pad * 2, plotW = W - pad * 2, max = 1, i
    for (i = 0; i < series.length; i++) { max = Math.max(max, series[i].consumed) }
    var n = series.length, step = n > 1 ? plotW / (n - 1) : 0, pts = []
    for (var j = 0; j < n; j++) { pts.push((pad + step * j) + ',' + (H - pad - (series[j].consumed / max) * plotH)) }
    var svg = licSvgOpen(W, H)
    svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2"/>'
    return svg + '</svg>'
}

function licBoot() {
    var rb = licById('lic-refresh')
    if (rb) { rb.addEventListener('click', licRefresh) }
    var tb = document.getElementsByClassName('lic-tab')
    for (var i = 0; i < tb.length; i++) {
        tb[i].addEventListener('click', function () { licTab(this.getAttribute('data-tab')) })
    }
    licRefresh()
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', licBoot) } else { licBoot() }
