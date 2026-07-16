/* eslint-disable no-restricted-globals */
// Client script for the License Utilization UI Page. Runs in the browser; fetches
// aggregated data via GlideAjax and renders interactive SVG charts + per-SKU cards.
var LIC = { data: null, tab: 'overview' };
var LIC_PALETTE = ['#4b4bd6', '#0a7d33', '#e0a21a', '#c0341d', '#8a2be2', '#0aa2a2', '#d6337a', '#5a6b7b'];

function licEsc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function licById(id) {
    return document.getElementById(id);
}
function licNum(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function licRefresh() {
    var status = licById('lic-status');
    if (status) {
        status.style.display = '';
        status.innerHTML = 'Loading dashboard data…';
    }
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'getDashboardData');
    ga.getXMLAnswer(function (answer) {
        try {
            LIC.data = JSON.parse(answer || '{}');
        } catch (e) {
            LIC.data = { error: 'Could not parse data: ' + e };
        }
        licRender();
    });
}

function licTab(name) {
    LIC.tab = name;
    var tabs = document.getElementsByClassName('lic-tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].getAttribute('data-tab') === name ? 'lic-tab active' : 'lic-tab';
    }
    var panels = ['overview', 'skus', 'trend', 'records', 'org'];
    for (var j = 0; j < panels.length; j++) {
        var p = licById('lic-panel-' + panels[j]);
        if (p) {
            p.style.display = panels[j] === name ? '' : 'none';
        }
    }
    if (name === 'records' && !LIC.recordsLoaded) {
        licLoadRecords();
    }
}

// Live, tier-deduped member lists for the Source Records tab (heavy; on demand only).
function licLoadRecords() {
    LIC.recordsLoaded = true;
    var panel = licById('lic-panel-records');
    if (panel) {
        panel.innerHTML = '<div class="lic-muted">Loading members live from source…</div>';
    }
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'getRecordsData');
    ga.getXMLAnswer(function (answer) {
        var data;
        try {
            data = JSON.parse(answer || '{}');
        } catch (e) {
            data = { categories: [] };
        }
        licRenderRecords(data);
    });
}

// Admin action: recompute live from source, persist the snapshot, and re-render.
function licRefreshLive() {
    licToast('Recomputing live from source — this can take a moment…');
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'refreshNow');
    ga.getXMLAnswer(function (answer) {
        var data;
        try {
            data = JSON.parse(answer || '{}');
        } catch (e) {
            data = { error: 'Unexpected response.' };
        }
        if (data.error) {
            licToast(data.error, true);
            return;
        }
        LIC.data = data;
        licRender();
        licToast('Refreshed live and saved.');
    });
}

function licRender() {
    var d = LIC.data || {};
    var status = licById('lic-status');
    var gen = licById('lic-generated');
    if (d.error) {
        if (status) {
            status.style.display = '';
            status.innerHTML = licEsc(d.error);
        }
        return;
    }
    if (!d.categories || d.categories.length === 0) {
        if (status) {
            status.style.display = '';
            status.innerHTML = 'No active license categories yet. Add categories and purchase records, then refresh.';
        }
        if (gen) {
            gen.innerHTML = 'No data';
        }
        return;
    }
    if (status) {
        status.style.display = 'none';
    }
    if (gen) {
        var snapNote = d.snapshot_based
            ? ' · from saved snapshot' + (d.last_snapshot ? ' (' + licEsc(d.last_snapshot) + ')' : '')
            : '';
        gen.innerHTML =
            'Generated ' +
            licEsc(d.generated) +
            ' · ' +
            d.categories.length +
            ' SKU(s) · ' +
            d.months.length +
            ' month(s)' +
            snapNote;
    }
    licRenderOverview(d);
    licRenderSkus(d);
    licRenderTrend(d);
    // Source Records members are loaded live on demand (see licTab -> licLoadRecords) so the
    // main dashboard stays fast; invalidate any previously loaded set on each render.
    LIC.recordsLoaded = false;
    licTab(LIC.tab);
}

function licRenderOverview(d) {
    var t = d.totals;
    var deltaHtml = '';
    if (d.mom && d.mom.has_prior) {
        var cd = d.mom.consumed_delta_pct;
        var cls = cd > 0 ? 'k-up' : cd < 0 ? 'k-down' : '';
        var arrow = cd > 0 ? '▲' : cd < 0 ? '▼' : '■';
        deltaHtml = '<div class="k-delta ' + cls + '">' + arrow + ' ' + Math.abs(cd) + '% MoM consumption</div>';
    }
    var html = '<div class="lic-grid">';
    html += licKpi('Licenses Purchased', licNum(t.purchased), '');
    html += licKpi('Licenses Consumed', licNum(t.consumed), deltaHtml);
    html += licKpi('Utilization', t.utilization + '%', licUtilDelta(d));
    html += licKpi('Categories / SKUs', licNum(t.categories), '');
    html += '</div>';
    html += '<div class="lic-card"><h3>Consumption vs. Purchased by Month</h3>' + licGroupedBars(d.overall_series);
    html +=
        '<div class="lic-legend"><span><i class="lic-dot" style="background:#4b4bd6"></i>Consumed</span><span><i class="lic-dot" style="background:#c9c9e8"></i>Purchased</span></div></div>';
    html +=
        '<div class="lic-card"><h3>Overall Utilization Trend</h3>' +
        licLineChart(d.overall_series, 'utilization', '#0a7d33');
    html += '<div class="lic-muted">Utilization % = consumed / purchased.</div></div>';
    licById('lic-panel-overview').innerHTML = html;
}

function licUtilDelta(d) {
    if (!d.mom || !d.mom.has_prior) {
        return '';
    }
    var u = d.mom.utilization_delta;
    var cls = u > 0 ? 'k-up' : u < 0 ? 'k-down' : '';
    var arrow = u > 0 ? '▲' : u < 0 ? '▼' : '■';
    return '<div class="k-delta ' + cls + '">' + arrow + ' ' + Math.abs(u) + ' pts MoM</div>';
}
function licKpi(label, value, delta) {
    return (
        '<div class="lic-kpi"><div class="k-label">' +
        licEsc(label) +
        '</div><div class="k-value">' +
        licEsc(value) +
        '</div>' +
        (delta || '') +
        '</div>'
    );
}

function licRenderSkus(d) {
    var html = '';
    for (var i = 0; i < d.categories.length; i++) {
        var c = d.categories[i];
        var color = LIC_PALETTE[i % LIC_PALETTE.length];
        var barCls = c.utilization >= 90 ? 'crit' : c.utilization >= 75 ? 'warn' : '';
        var pct = Math.min(100, c.utilization);
        html += '<div class="lic-card">';
        html += '<h3>' + licEsc(c.name) + '<span class="lic-badge">' + licEsc(c.capability) + '</span></h3>';
        var suNote = '';
        if (c.count_mode === 'subscription_units') {
            suNote =
                ' · <span title="ServiceNow ITOM subscription-unit model">' +
                licNum(c.raw_count) +
                ' records ÷ ' +
                c.su_ratio +
                ' = ' +
                licNum(c.consumed) +
                ' SU</span>';
        }
        html +=
            '<div class="lic-muted">SKU: ' +
            (c.sku ? licEsc(c.sku) : '—') +
            ' · Purchased ' +
            licNum(c.purchased) +
            ' · Consumed ' +
            licNum(c.consumed) +
            ' · Utilization ' +
            c.utilization +
            '%' +
            suNote +
            '</div>';
        html +=
            '<div class="lic-bar-wrap"><div class="lic-bar-fill ' +
            barCls +
            '" style="width:' +
            pct +
            '%"></div></div>';
        html += '<div style="margin-top:10px">' + licSparkline(c.series, color) + '</div>';
        html += '</div>';
    }
    licById('lic-panel-skus').innerHTML = html;
}

function licRenderTrend(d) {
    var html =
        '<div class="lic-card"><h3>Utilization % by SKU - Month over Month</h3>' + licMultiLine(d.categories, d.months);
    var legend = '<div class="lic-legend">';
    for (var i = 0; i < d.categories.length; i++) {
        legend +=
            '<span><i class="lic-dot" style="background:' +
            LIC_PALETTE[i % LIC_PALETTE.length] +
            '"></i>' +
            licEsc(d.categories[i].name) +
            '</span>';
    }
    html += legend + '</div></div>';
    html +=
        '<div class="lic-card"><h3>Consumption Detail</h3><table class="lic-tbl"><thead><tr><th>Month</th><th>Purchased</th><th>Consumed</th><th>Utilization</th></tr></thead><tbody>';
    for (var j = 0; j < d.overall_series.length; j++) {
        var s = d.overall_series[j];
        html +=
            '<tr><td>' +
            licEsc(s.month) +
            '</td><td>' +
            licNum(s.purchased) +
            '</td><td>' +
            licNum(s.consumed) +
            '</td><td>' +
            s.utilization +
            '%</td></tr>';
    }
    html += '</tbody></table></div>';
    licById('lic-panel-trend').innerHTML = html;
}

function licRenderRecords(d) {
    var html =
        '<div class="lic-muted" style="margin-bottom:8px">The actual records consuming each license, so you can validate every count. “Open” goes to the underlying user/device/record; “Open full list” shows all matches in a ServiceNow list.</div>';
    for (var i = 0; i < d.categories.length; i++) {
        var c = d.categories[i];
        html += '<div class="lic-card">';
        html += '<h3>' + licEsc(c.name) + '<span class="lic-badge">' + licEsc(c.capability) + '</span></h3>';
        if (!c.source_table) {
            html +=
                '<div class="lic-muted">No source configured. Set a <b>Source Table</b> / <b>Source Query</b> on this category to enable drill-down.</div></div>';
            continue;
        }
        var listUrl = licEsc(c.source_table) + '_list.do';
        if (c.source_query) {
            listUrl += '?sysparm_query=' + encodeURIComponent(c.source_query);
        }
        html +=
            '<div class="lic-muted">' +
            licNum(c.consumer_count) +
            ' consumer(s) · source: <code>' +
            licEsc(c.source_table) +
            '</code>';
        html += c.source_query ? ' · <code>' + licEsc(c.source_query) + '</code>' : '';
        // The deduped CSV always matches the tile count. For tiered SKUs the raw list link is
        // demoted (and labeled) so users are never handed a non-deduped view as the source of truth.
        html +=
            ' · <a href="#" class="lic-dl-csv" data-cat="' +
            licEsc(c.id) +
            '" data-name="' +
            licEsc(c.name) +
            '">Download full list (CSV)</a>';
        if (!c.tier_group) {
            html += ' · <a href="' + listUrl + '" target="_blank" rel="noopener">Open full list</a>';
        } else {
            html +=
                ' · <a href="' +
                listUrl +
                '" target="_blank" rel="noopener" title="Raw source query — NOT tier-deduped; includes users also counted under a higher tier">raw source ⧉</a>';
        }
        html += '</div>';
        if (c.tier_note) {
            html += '<div class="lic-muted" style="color:#8a2be2">ⓘ ' + licEsc(c.tier_note) + '</div>';
        }
        var cons = c.consumers || [];
        if (cons.length) {
            html += '<table class="lic-tbl"><thead><tr><th>Consumer</th><th></th></tr></thead><tbody>';
            for (var k = 0; k < cons.length; k++) {
                var r = cons[k];
                var t = r.table || c.source_table;
                var url = t ? licEsc(t) + '.do?sys_id=' + encodeURIComponent(r.sys_id) : '';
                html +=
                    '<tr><td>' +
                    licEsc(r.label) +
                    '</td><td>' +
                    (url ? '<a href="' + url + '" target="_blank" rel="noopener">Open</a>' : '') +
                    '</td></tr>';
            }
            html += '</tbody></table>';
            if (c.consumer_more) {
                html +=
                    '<div class="lic-muted">Showing first ' +
                    cons.length +
                    ' of ' +
                    licNum(c.consumer_count) +
                    ' (tier-deduped). Use “Download full list (CSV)” for the complete deduped set.</div>';
            }
        } else {
            html += '<div class="lic-muted">No matching records.</div>';
        }
        html += '</div>';
    }
    licById('lic-panel-records').innerHTML = html;
    var dls = document.getElementsByClassName('lic-dl-csv');
    for (var di = 0; di < dls.length; di++) {
        dls[di].addEventListener('click', function (e) {
            e.preventDefault();
            licDownloadCatConsumers(this.getAttribute('data-cat'), this.getAttribute('data-name'));
        });
    }
}

function licCsvDownload(filename, rows) {
    var csv = rows
        .map(function (r) {
            return r
                .map(function (v) {
                    return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
                })
                .join(',');
        })
        .join('\n');
    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Fetch and download the FULL tier-deduped member list for one category.
function licDownloadCatConsumers(catId, catName) {
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'getCategoryConsumers');
    ga.addParam('sysparm_cat_id', catId);
    ga.getXMLAnswer(function (answer) {
        var res;
        try {
            res = JSON.parse(answer || '{}');
        } catch (e) {
            res = { error: 'Could not parse response.' };
        }
        if (res.error) {
            alert(res.error);
            return;
        }
        var rows = [['Category', 'Deduped', 'sys_id', 'Name']];
        (res.users || []).forEach(function (u) {
            rows.push([catName, res.deduped ? 'yes' : 'no', u.sys_id, u.label]);
        });
        licCsvDownload((catName || 'consumers').replace(/[^a-z0-9]+/gi, '_') + '_members.csv', rows);
    });
}

function licSvgOpen(w, h) {
    return (
        '<svg viewBox="0 0 ' +
        w +
        ' ' +
        h +
        '" width="100%" height="' +
        h +
        '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">'
    );
}

function licGroupedBars(series) {
    if (!series || !series.length) {
        return '<div class="lic-muted">No monthly data.</div>';
    }
    var W = 720,
        H = 220,
        pad = 34,
        plotH = H - pad * 2,
        plotW = W - pad * 2,
        max = 1,
        i;
    for (i = 0; i < series.length; i++) {
        max = Math.max(max, series[i].purchased, series[i].consumed);
    }
    var n = series.length,
        slot = plotW / n,
        bw = Math.max(4, slot * 0.28),
        svg = licSvgOpen(W, H);
    svg +=
        '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#ccc"/>';
    for (var j = 0; j < n; j++) {
        var cx = pad + slot * j + slot / 2,
            ph = (series[j].purchased / max) * plotH,
            ch = (series[j].consumed / max) * plotH;
        svg +=
            '<rect x="' +
            (cx - bw - 1) +
            '" y="' +
            (H - pad - ph) +
            '" width="' +
            bw +
            '" height="' +
            ph +
            '" fill="#c9c9e8" rx="2"><title>Purchased ' +
            series[j].purchased +
            '</title></rect>';
        svg +=
            '<rect x="' +
            (cx + 1) +
            '" y="' +
            (H - pad - ch) +
            '" width="' +
            bw +
            '" height="' +
            ch +
            '" fill="#4b4bd6" rx="2"><title>Consumed ' +
            series[j].consumed +
            '</title></rect>';
        svg +=
            '<text x="' +
            cx +
            '" y="' +
            (H - pad + 14) +
            '" font-size="10" fill="#6b6b80" text-anchor="middle">' +
            licEsc(series[j].month) +
            '</text>';
    }
    return svg + '</svg>';
}

function licLineChart(series, key, color) {
    if (!series || !series.length) {
        return '<div class="lic-muted">No monthly data.</div>';
    }
    var W = 720,
        H = 200,
        pad = 34,
        plotH = H - pad * 2,
        plotW = W - pad * 2,
        max = 1,
        i;
    for (i = 0; i < series.length; i++) {
        max = Math.max(max, series[i][key]);
    }
    var n = series.length,
        step = n > 1 ? plotW / (n - 1) : 0,
        pts = [],
        dots = '';
    for (var j = 0; j < n; j++) {
        var x = pad + step * j,
            y = H - pad - (series[j][key] / max) * plotH;
        pts.push(x + ',' + y);
        dots +=
            '<circle cx="' +
            x +
            '" cy="' +
            y +
            '" r="3" fill="' +
            color +
            '"><title>' +
            licEsc(series[j].month) +
            ': ' +
            series[j][key] +
            '%</title></circle>';
        dots +=
            '<text x="' +
            x +
            '" y="' +
            (H - pad + 14) +
            '" font-size="10" fill="#6b6b80" text-anchor="middle">' +
            licEsc(series[j].month) +
            '</text>';
    }
    var svg = licSvgOpen(W, H);
    svg +=
        '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#ccc"/>';
    svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2"/>';
    return svg + dots + '</svg>';
}

function licMultiLine(categories, months) {
    if (!months || !months.length) {
        return '<div class="lic-muted">No monthly data.</div>';
    }
    var W = 720,
        H = 240,
        pad = 34,
        plotH = H - pad * 2,
        plotW = W - pad * 2;
    var n = months.length,
        step = n > 1 ? plotW / (n - 1) : 0,
        svg = licSvgOpen(W, H),
        g,
        m,
        c,
        j;
    svg +=
        '<line x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '" stroke="#ccc"/>';
    for (g = 0; g <= 100; g += 25) {
        var gy = H - pad - (g / 100) * plotH;
        svg += '<line x1="' + pad + '" y1="' + gy + '" x2="' + (W - pad) + '" y2="' + gy + '" stroke="#f0f0f6"/>';
        svg +=
            '<text x="' +
            (pad - 6) +
            '" y="' +
            (gy + 3) +
            '" font-size="9" fill="#9a9ab0" text-anchor="end">' +
            g +
            '</text>';
    }
    for (m = 0; m < n; m++) {
        svg +=
            '<text x="' +
            (pad + step * m) +
            '" y="' +
            (H - pad + 14) +
            '" font-size="10" fill="#6b6b80" text-anchor="middle">' +
            licEsc(months[m]) +
            '</text>';
    }
    for (c = 0; c < categories.length; c++) {
        var color = LIC_PALETTE[c % LIC_PALETTE.length],
            pts = [];
        for (j = 0; j < n; j++) {
            var u = categories[c].series[j] ? categories[c].series[j].utilization : 0;
            pts.push(pad + step * j + ',' + (H - pad - (Math.min(100, u) / 100) * plotH));
        }
        svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2"/>';
    }
    return svg + '</svg>';
}

function licSparkline(series, color) {
    if (!series || !series.length) {
        return '<span class="lic-muted">No trend.</span>';
    }
    var W = 320,
        H = 46,
        pad = 4,
        plotH = H - pad * 2,
        plotW = W - pad * 2,
        max = 1,
        i;
    for (i = 0; i < series.length; i++) {
        max = Math.max(max, series[i].consumed);
    }
    var n = series.length,
        step = n > 1 ? plotW / (n - 1) : 0,
        pts = [];
    for (var j = 0; j < n; j++) {
        pts.push(pad + step * j + ',' + (H - pad - (series[j].consumed / max) * plotH));
    }
    var svg = licSvgOpen(W, H);
    svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2"/>';
    return svg + '</svg>';
}

function licToast(msg, isErr) {
    var t = licById('lic-toast');
    if (!t) {
        return;
    }
    t.className = isErr ? 'lic-toast err' : 'lic-toast';
    t.innerHTML = licEsc(msg);
    t.style.display = '';
}

// Build a CSV string from the loaded dashboard data: a per-SKU summary block,
// the month-over-month overall series, and the actual consumer records.
function licCsvCell(v) {
    var s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function licCsvRow(arr) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
        out.push(licCsvCell(arr[i]));
    }
    return out.join(',') + '\r\n';
}
function licBuildCsv(d) {
    var csv = 'License Utilization & Consumption export\r\nGenerated,' + licCsvCell(d.generated) + '\r\n\r\n';
    csv += 'SKU SUMMARY\r\n';
    csv += licCsvRow([
        'Category',
        'Capability',
        'SKU',
        'Purchased',
        'Consumed',
        'Utilization %',
        'Source Table',
        'Source Query',
        'Consumers',
    ]);
    for (var i = 0; i < d.categories.length; i++) {
        var c = d.categories[i];
        csv += licCsvRow([
            c.name,
            c.capability,
            c.sku,
            c.purchased,
            c.consumed,
            c.utilization,
            c.source_table,
            c.source_query,
            c.consumer_count,
        ]);
    }
    csv += '\r\nMONTH-OVER-MONTH (ALL SKUs)\r\n';
    csv += licCsvRow(['Month', 'Purchased', 'Consumed', 'Utilization %']);
    for (var j = 0; j < d.overall_series.length; j++) {
        var s = d.overall_series[j];
        csv += licCsvRow([s.month, s.purchased, s.consumed, s.utilization]);
    }
    csv += '\r\nSOURCE RECORDS (actual consumers)\r\n';
    csv += licCsvRow(['Category', 'Consumer', 'Table', 'Sys ID']);
    for (var k = 0; k < d.categories.length; k++) {
        var cat = d.categories[k],
            cons = cat.consumers || [];
        for (var m = 0; m < cons.length; m++) {
            csv += licCsvRow([cat.name, cons[m].label, cons[m].table, cons[m].sys_id]);
        }
    }
    return csv;
}
function licExportCsv() {
    if (!LIC.data || !LIC.data.categories) {
        licToast('No data to export yet.', true);
        return;
    }
    var csv = licBuildCsv(LIC.data);
    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'license-utilization-' + (LIC.data.generated || '').replace(/[^0-9]/g, '').slice(0, 8) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    licToast('CSV exported (' + LIC.data.categories.length + ' SKUs, includes source records).');
}

// Ask the server to email the current user a summary of the dashboard.
function licEmailSummary() {
    licToast('Sending email…');
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'emailSummary');
    ga.getXMLAnswer(function (answer) {
        var res;
        try {
            res = JSON.parse(answer || '{}');
        } catch (e) {
            res = { ok: false, message: 'Unexpected response.' };
        }
        licToast(res.message || (res.ok ? 'Email sent.' : 'Could not send email.'), !res.ok);
    });
}

// ── By Org / Department ──────────────────────────────────────────────────────
var LIC_ORG = { opts: null, data: null };

function licInitOrg() {
    var panel = licById('lic-panel-org');
    if (!panel) {
        return;
    }
    panel.innerHTML =
        '<div class="lic-card"><h3>License usage by reporting line or department</h3>' +
        '<div class="lic-muted" style="margin-bottom:8px">Pick a manager (counts everyone reporting to them — directly or indirectly — who holds a license) or a department. Counts are tier-deduped licensed users.</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
        '<select id="lic-org-scope"><option value="manager">Reports to (manager)</option><option value="department">Department</option></select>' +
        '<select id="lic-org-subject"><option value="">Loading…</option></select>' +
        '<button type="button" class="lic-btn" id="lic-org-run">Show</button>' +
        '<button type="button" class="lic-btn lic-btn-ghost" id="lic-org-csv">Export CSV</button>' +
        '</div></div><div id="lic-org-result"></div>';
    licById('lic-org-run').addEventListener('click', licLoadOrg);
    licById('lic-org-csv').addEventListener('click', licExportOrgCsv);
    licById('lic-org-scope').addEventListener('change', licFillOrgSubjects);
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'getOrgOptions');
    ga.getXMLAnswer(function (answer) {
        try {
            LIC_ORG.opts = JSON.parse(answer || '{}');
        } catch (e) {
            LIC_ORG.opts = { managers: [], departments: [] };
        }
        licFillOrgSubjects();
    });
}

function licFillOrgSubjects() {
    var scope = licById('lic-org-scope').value;
    var list = (LIC_ORG.opts && (scope === 'department' ? LIC_ORG.opts.departments : LIC_ORG.opts.managers)) || [];
    var html;
    if (!list.length) {
        html = '<option value="">— none found (' + (scope === 'department' ? 'no departments' : 'no managers') + ') —</option>';
    } else {
        html = '<option value="">— select —</option>';
        for (var i = 0; i < list.length; i++) {
            html += '<option value="' + licEsc(list[i].sys_id) + '">' + licEsc(list[i].name) + '</option>';
        }
    }
    licById('lic-org-subject').innerHTML = html;
}

function licLoadOrg() {
    var scope = licById('lic-org-scope').value;
    var id = licById('lic-org-subject').value;
    var res = licById('lic-org-result');
    if (!id) {
        res.innerHTML = '<div class="lic-muted">Select one first.</div>';
        return;
    }
    res.innerHTML = '<div class="lic-muted">Computing…</div>';
    var ga = new GlideAjax('x_1983_licutil.LicenseAnalytics');
    ga.addParam('sysparm_name', 'getOrgData');
    ga.addParam('sysparm_org_type', scope);
    ga.addParam('sysparm_org_id', id);
    ga.getXMLAnswer(function (answer) {
        var d;
        try {
            d = JSON.parse(answer || '{}');
        } catch (e) {
            d = { error: 'Bad response.' };
        }
        LIC_ORG.data = d;
        licRenderOrgData(d);
    });
}

function licRenderOrgData(d) {
    var res = licById('lic-org-result');
    if (d.error) {
        res.innerHTML = '<div class="lic-muted">' + licEsc(d.error) + '</div>';
        return;
    }
    var html = '<div class="lic-card"><h3>' + licEsc(d.subject) + '</h3>';
    html +=
        '<div class="lic-muted">Licensed users reporting directly or indirectly · generated ' +
        licEsc(d.generated) +
        '</div>';
    html += '<div class="lic-grid" style="margin-top:10px">';
    for (var i = 0; i < d.categories.length; i++) {
        html +=
            '<div class="lic-kpi"><div class="k-label">' +
            licEsc(d.categories[i].name) +
            '</div><div class="k-value">' +
            licNum(d.categories[i].licensed_users) +
            '</div><div class="lic-muted">licensed users</div></div>';
    }
    html += '</div></div>';
    for (var j = 0; j < d.categories.length; j++) {
        var cat = d.categories[j];
        if (!cat.users || !cat.users.length) {
            continue;
        }
        html +=
            '<div class="lic-card"><h3>' +
            licEsc(cat.name) +
            ' — ' +
            licNum(cat.licensed_users) +
            ' user(s)</h3><table class="lic-tbl"><thead><tr><th>User</th><th></th></tr></thead><tbody>';
        for (var k = 0; k < cat.users.length; k++) {
            html +=
                '<tr><td>' +
                licEsc(cat.users[k].label) +
                '</td><td><a href="sys_user.do?sys_id=' +
                licEsc(cat.users[k].sys_id) +
                '" target="_blank" rel="noopener">Open</a></td></tr>';
        }
        html += '</tbody></table>';
        if (cat.users_more) {
            html +=
                '<div class="lic-muted">Showing first ' +
                cat.users.length +
                ' of ' +
                licNum(cat.licensed_users) +
                '.</div>';
        }
        html += '</div>';
    }
    res.innerHTML = html;
}

function licExportOrgCsv() {
    var d = LIC_ORG.data;
    if (!d || !d.categories) {
        licToast('Run a rollup first.', true);
        return;
    }
    var csv =
        'License rollup,' +
        licCsvCell(d.subject) +
        '\r\nUsers in scope,' +
        licCsvCell(d.population) +
        '\r\nGenerated,' +
        licCsvCell(d.generated) +
        '\r\n\r\n';
    csv += 'SUMMARY\r\n' + licCsvRow(['Category', 'Licensed Users']);
    for (var i = 0; i < d.categories.length; i++) {
        csv += licCsvRow([d.categories[i].name, d.categories[i].licensed_users]);
    }
    csv += '\r\nLICENSED USERS BY CATEGORY\r\n' + licCsvRow(['Category', 'User', 'Sys ID']);
    for (var j = 0; j < d.categories.length; j++) {
        var us = d.categories[j].users || [];
        for (var k = 0; k < us.length; k++) {
            csv += licCsvRow([d.categories[j].name, us[k].label, us[k].sys_id]);
        }
    }
    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'license-org-rollup.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    licToast('Org rollup CSV exported.');
}

function licBoot() {
    var rb = licById('lic-refresh');
    if (rb) {
        rb.addEventListener('click', licRefresh);
    }
    var cb = licById('lic-csv');
    if (cb) {
        cb.addEventListener('click', licExportCsv);
    }
    var eb = licById('lic-email');
    if (eb) {
        eb.addEventListener('click', licEmailSummary);
    }
    var rl = licById('lic-refresh-live');
    if (rl) {
        rl.addEventListener('click', licRefreshLive);
    }
    var tb = document.getElementsByClassName('lic-tab');
    for (var i = 0; i < tb.length; i++) {
        tb[i].addEventListener('click', function () {
            licTab(this.getAttribute('data-tab'));
        });
    }
    licInitOrg();
    licRefresh();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', licBoot);
} else {
    licBoot();
}
