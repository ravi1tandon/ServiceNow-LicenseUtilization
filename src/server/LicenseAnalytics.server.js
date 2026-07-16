/* eslint-disable no-unsupported-node-builtins */
// `global` here is the ServiceNow global application scope (not Node.js). A scoped
// client-callable script include must extend global.AbstractAjaxProcessor.
var LicenseAnalytics = Class.create();
LicenseAnalytics.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    CAT: 'x_1983_licutil_category',
    PUR: 'x_1983_licutil_purchase',
    CON: 'x_1983_licutil_consumption',
    ROLLUP: 'x_1983_licutil_org_rollup',
    LIST_LIMIT: 100,
    DEDUP_CAP: 20000, // max distinct consumers materialized per category (safety bound). Counts
    // are NEVER capped (countConsumers uses getRowCount); this only bounds member LIST/CSV export.
    // For device SKUs larger than this, use the card's "Open full list" native export.
    ORG_CAP: 10000, // max users walked in a reporting subtree (safety bound)

    // Role gate for every client-callable entry point (defense-in-depth on top of the
    // execute ACL). Only license viewers/admins (or platform admins) may invoke.
    _authorized: function () {
        return gs.hasRole('x_1983_licutil.viewer') || gs.hasRole('x_1983_licutil.admin') || gs.hasRole('admin');
    },

    // GlideAjax entry point (fast path). Serves KPI / By-SKU / trend tiles from the stored
    // consumption snapshots — no live counting — so the page loads instantly. "Refresh live"
    // (refreshNow) recomputes and persists; a daily job keeps the snapshot fresh.
    getDashboardData: function () {
        if (!this._authorized()) {
            return JSON.stringify({ error: 'Not authorized to view license data.' });
        }
        return JSON.stringify(this.buildFromSnapshots());
    },

    // GlideAjax: recompute live (tier-deduped), persist as this period's snapshot, return the
    // refreshed snapshot-backed payload. Admin-only because it writes. Backs "Refresh live".
    refreshNow: function () {
        if (!(gs.hasRole('x_1983_licutil.admin') || gs.hasRole('admin'))) {
            return JSON.stringify({ error: 'Live refresh is available to administrators. Showing the latest saved snapshot.' });
        }
        this.writeSnapshot();
        return JSON.stringify(this.buildFromSnapshots());
    },

    // GlideAjax: live tier-deduped member lists per category for the Source Records tab. Heavy,
    // so the client loads it on demand only when that tab is first opened.
    getRecordsData: function () {
        if (!this._authorized()) {
            return JSON.stringify({ categories: [] });
        }
        var computed = this.computeCategories();
        var out = [];
        for (var i = 0; i < computed.order.length; i++) {
            var c = computed.map[computed.order[i]];
            out.push({
                id: c.id,
                name: c.name,
                capability: c.capability,
                source_table: c.source_table,
                source_query: c.source_query,
                consumer_count: c.consumer_count,
                consumers: c.consumers,
                consumer_more: c.consumer_more,
                tier_group: c.tier_group,
            });
        }
        return JSON.stringify({ categories: out, generated: new GlideDateTime().getDisplayValue() });
    },

    // GlideAjax: email the current user a summary of the dashboard. Fires a scoped event that
    // the "License Utilization Summary" notification turns into an email. Returns {ok,message}.
    emailSummary: function () {
        if (!this._authorized()) {
            return JSON.stringify({ ok: false, message: 'Not authorized.' });
        }
        var userId = gs.getUserID();
        var ug = new GlideRecord('sys_user');
        if (!ug.get(userId)) {
            return JSON.stringify({ ok: false, message: 'Could not resolve your user record.' });
        }
        var email = ug.getValue('email');
        if (!email) {
            return JSON.stringify({ ok: false, message: 'No email address is set on your user record.' });
        }
        gs.eventQueue('x_1983_licutil.summary.email', ug, userId, email);
        return JSON.stringify({
            ok: true,
            message: 'Summary email queued to ' + email + '. It should arrive shortly.',
        });
    },

    // Count the real records that consume a license. With refField, counts DISTINCT values of
    // that field (e.g. distinct users on sys_user_has_role) by grouping — this matches the
    // drill-down list exactly. Without refField, counts matching rows.
    countConsumers: function (table, query, refField) {
        if (!table) {
            return 0;
        }
        try {
            if (refField) {
                var ga = new GlideAggregate(table);
                if (query) {
                    ga.addEncodedQuery(query);
                }
                ga.addAggregate('COUNT'); // ensure the aggregate materializes group rows
                ga.groupBy(refField);
                ga.query();
                var n = 0;
                while (ga.next()) {
                    if (ga.getValue(refField)) {
                        n++;
                    } // one group per distinct non-empty value
                }
                return n;
            }
            var gr = new GlideRecord(table);
            if (query) {
                gr.addEncodedQuery(query);
            }
            gr.query();
            return gr.getRowCount();
        } catch (e) {
            gs.error('[LicenseUtilization] countConsumers failed for ' + table + ' / ' + query + ': ' + e);
        }
        return 0;
    },

    // Convert a raw record count into consumed units, applying the ITOM subscription-unit
    // ratio when configured (consumed = ceil(records / su_ratio)); otherwise 1:1.
    toConsumed: function (rawCount, countMode, suRatio) {
        var ratio = parseInt(suRatio || '1', 10);
        if (countMode === 'subscription_units' && ratio > 1) {
            return Math.ceil(rawCount / ratio);
        }
        return rawCount;
    },

    // List the actual consumer records (capped) for drill-down validation.
    listConsumers: function (table, query, refField, refTable, limit) {
        var out = [];
        if (!table) {
            return out;
        }
        try {
            var seen = {};
            var gr = new GlideRecord(table);
            if (query) {
                gr.addEncodedQuery(query);
            }
            if (refField) {
                gr.orderBy(refField);
            }
            gr.setLimit(limit > 0 ? limit : this.LIST_LIMIT);
            gr.query();
            while (gr.next()) {
                var id, label, tbl;
                if (refField) {
                    id = gr.getValue(refField);
                    label = gr.getDisplayValue(refField);
                    tbl = refTable || '';
                } else {
                    id = gr.getUniqueValue();
                    label = gr.getDisplayValue();
                    tbl = table;
                }
                if (!id || seen[id]) {
                    continue;
                }
                seen[id] = 1;
                out.push({ sys_id: id, label: label || id, table: tbl });
            }
        } catch (e) {
            gs.error('[LicenseUtilization] listConsumers failed for ' + table + ' / ' + query + ': ' + e);
        }
        return out;
    },

    // Live figures for one category: { raw, consumed }. raw = actual records (drill-down count);
    // consumed = licensed units after the subscription-unit ratio. Source-based, else manual.
    consumedFor: function (catGr) {
        var st = catGr.getValue('source_table');
        if (st) {
            var raw = this.countConsumers(st, catGr.getValue('source_query'), catGr.getValue('consumer_ref_field'));
            var consumed = this.toConsumed(raw, catGr.getValue('count_mode'), catGr.getValue('su_ratio'));
            return { raw: raw, consumed: consumed };
        }
        var manual = parseInt(catGr.getValue('current_consumed') || '0', 10);
        return { raw: manual, consumed: manual };
    },

    // Materialize the DISTINCT consumer set (capped) for a source, for cross-tier dedup.
    // With refField, one entry per distinct field value (e.g. distinct users, covering direct +
    // group + inherited grants that sys_user_has_role already merges); else one per source row.
    distinctConsumers: function (table, query, refField, cap) {
        var list = [];
        var capped = false;
        if (!table) {
            return { list: list, capped: capped };
        }
        var limit = cap > 0 ? cap : this.DEDUP_CAP;
        try {
            if (refField) {
                var ga = new GlideAggregate(table);
                if (query) {
                    ga.addEncodedQuery(query);
                }
                ga.addAggregate('COUNT'); // ensure the aggregate materializes group rows
                ga.groupBy(refField);
                ga.query();
                while (ga.next()) {
                    var idv = ga.getValue(refField);
                    if (!idv) {
                        continue;
                    }
                    if (list.length >= limit) {
                        capped = true;
                        break;
                    }
                    list.push({ sys_id: idv, label: ga.getDisplayValue(refField) || idv });
                }
            } else {
                var seen = {};
                var g = new GlideRecord(table);
                if (query) {
                    g.addEncodedQuery(query);
                }
                g.query();
                while (g.next()) {
                    var uid = g.getUniqueValue();
                    if (seen[uid]) {
                        continue;
                    }
                    seen[uid] = 1;
                    if (list.length >= limit) {
                        capped = true;
                        break;
                    }
                    list.push({ sys_id: uid, label: g.getDisplayValue() || uid });
                }
            }
        } catch (e) {
            gs.error('[LicenseUtilization] distinctConsumers failed for ' + table + ' / ' + query + ': ' + e);
        }
        return { list: list, capped: capped };
    },

    // Central engine: compute per-category consumed figures with tier-aware de-duplication.
    // Categories sharing a non-empty tier_group are processed highest-precedence first; a consumer
    // counted by a higher tier is removed from lower tiers (ServiceNow "highest subscription wins").
    // Returns { map: {id:cat}, order: [id...] }. Used by both the dashboard and the snapshot job.
    computeCategories: function () {
        var map = {};
        var order = [];
        var tiers = {};
        var gr = new GlideRecordSecure(this.CAT);
        gr.addQuery('active', true);
        gr.orderBy('capability');
        gr.orderBy('name');
        gr.query();
        while (gr.next()) {
            var id = gr.getUniqueValue();
            var c = {
                id: id,
                name: gr.getValue('name') || '',
                sku: gr.getValue('sku_code') || '',
                capability: gr.getDisplayValue('capability') || '',
                source_table: gr.getValue('source_table') || '',
                source_query: gr.getValue('source_query') || '',
                consumer_ref_field: gr.getValue('consumer_ref_field') || '',
                consumer_table: gr.getValue('consumer_table') || '',
                count_mode: gr.getValue('count_mode') || 'records',
                su_ratio: parseInt(gr.getValue('su_ratio') || '1', 10),
                tier_group: gr.getValue('tier_group') || '',
                precedence: parseInt(gr.getValue('precedence') || '0', 10),
                _manual: parseInt(gr.getValue('current_consumed') || '0', 10),
            };
            map[id] = c;
            order.push(id);
            if (c.tier_group) {
                (tiers[c.tier_group] = tiers[c.tier_group] || []).push(c);
            }
        }

        // Tier-group categories: fetch full distinct sets and claim consumers top-down.
        for (var tg in tiers) {
            var arr = tiers[tg].sort(function (a, b) {
                return b.precedence - a.precedence;
            });
            var claimed = {};
            for (var ti = 0; ti < arr.length; ti++) {
                var tc = arr[ti];
                var res = tc.source_table
                    ? this.distinctConsumers(tc.source_table, tc.source_query, tc.consumer_ref_field, this.DEDUP_CAP)
                    : { list: [], capped: false };
                var net = [];
                for (var ri = 0; ri < res.list.length; ri++) {
                    var entry = res.list[ri];
                    if (!claimed[entry.sys_id]) {
                        claimed[entry.sys_id] = 1;
                        net.push(entry);
                    }
                }
                tc._net = net;
                tc._capped = res.capped;
                tc._tiered = true;
            }
        }

        // Finalize figures for every category.
        for (var oi = 0; oi < order.length; oi++) {
            var o = map[order[oi]];
            var listOut = [];
            var li;
            if (o._tiered) {
                var rawNet = o._net.length;
                for (li = 0; li < o._net.length && li < this.LIST_LIMIT; li++) {
                    listOut.push({
                        sys_id: o._net[li].sys_id,
                        label: o._net[li].label,
                        table: o.consumer_table || o.source_table,
                    });
                }
                o.raw_count = rawNet;
                o.consumed = this.toConsumed(rawNet, o.count_mode, o.su_ratio);
                o.consumer_count = rawNet;
                o.consumers = listOut;
                o.consumer_more = o._capped || rawNet > listOut.length;
                o.tier_note =
                    'Counted once at highest tier in group "' +
                    o.tier_group +
                    '" (precedence ' +
                    o.precedence +
                    '); users already counted in a higher tier are excluded here.';
            } else if (o.source_table) {
                var raw = this.countConsumers(o.source_table, o.source_query, o.consumer_ref_field);
                o.raw_count = raw;
                o.consumed = this.toConsumed(raw, o.count_mode, o.su_ratio);
                o.consumer_count = raw;
                o.consumers = this.listConsumers(
                    o.source_table,
                    o.source_query,
                    o.consumer_ref_field,
                    o.consumer_table,
                    this.LIST_LIMIT,
                );
                o.consumer_more = raw > o.consumers.length;
                o.tier_note = '';
            } else {
                o.raw_count = o._manual;
                o.consumed = o._manual;
                o.consumer_count = o._manual;
                o.consumers = [];
                o.consumer_more = false;
                o.tier_note = '';
            }
            delete o._net;
            delete o._capped;
            delete o._tiered;
            delete o._manual;
            delete o.consumer_ref_field;
        }
        return { map: map, order: order };
    },

    // ── Org / Department rollup ────────────────────────────────────────────────
    // Full, tier-deduped consumer USER-id sets per user-based category (consumer = a person).
    // Device/entitlement categories are excluded (they don't map to a manager/department).
    userConsumerSets: function () {
        var cats = [];
        var tiers = {};
        var gr = new GlideRecordSecure(this.CAT);
        gr.addQuery('active', true);
        gr.orderBy('capability');
        gr.orderBy('name');
        gr.query();
        while (gr.next()) {
            var st = gr.getValue('source_table');
            var rf = gr.getValue('consumer_ref_field');
            var rt = gr.getValue('consumer_table');
            if (!st || (rt !== 'sys_user' && rf !== 'user')) {
                continue;
            }
            var c = {
                id: gr.getUniqueValue(),
                name: gr.getValue('name') || '',
                capability: gr.getDisplayValue('capability') || '',
                st: st,
                sq: gr.getValue('source_query') || '',
                rf: rf,
                tier_group: gr.getValue('tier_group') || '',
                precedence: parseInt(gr.getValue('precedence') || '0', 10),
            };
            cats.push(c);
            if (c.tier_group) {
                (tiers[c.tier_group] = tiers[c.tier_group] || []).push(c);
            }
        }
        for (var tg in tiers) {
            var arr = tiers[tg].sort(function (a, b) {
                return b.precedence - a.precedence;
            });
            var claimed = {};
            for (var i = 0; i < arr.length; i++) {
                var tc = arr[i];
                var res = this.distinctConsumers(tc.st, tc.sq, tc.rf, this.DEDUP_CAP);
                var ids = {};
                for (var k = 0; k < res.list.length; k++) {
                    var s = res.list[k].sys_id;
                    if (!claimed[s]) {
                        claimed[s] = 1;
                        ids[s] = res.list[k].label;
                    }
                }
                tc.ids = ids;
                tc.done = true;
            }
        }
        for (var n = 0; n < cats.length; n++) {
            var o = cats[n];
            if (!o.done) {
                var r = this.distinctConsumers(o.st, o.sq, o.rf, this.DEDUP_CAP);
                var ids2 = {};
                for (var k2 = 0; k2 < r.list.length; k2++) {
                    ids2[r.list[k2].sys_id] = r.list[k2].label;
                }
                o.ids = ids2;
            }
            o.count = Object.keys(o.ids).length;
        }
        return cats;
    },

    // All active user sys_ids reporting directly or indirectly to managerId (BFS on sys_user.manager).
    orgSubtreeUserIds: function (managerId, includeHead) {
        var result = {};
        var frontier = [managerId];
        var guard = 0;
        if (includeHead) {
            result[managerId] = 1;
        }
        while (frontier.length && guard < this.ORG_CAP) {
            var batch = frontier.splice(0, 200);
            var gr = new GlideRecord('sys_user');
            gr.addQuery('manager', 'IN', batch.join(','));
            gr.addQuery('active', true);
            gr.query();
            while (gr.next()) {
                if (guard >= this.ORG_CAP) {
                    break;
                }
                var uid = gr.getUniqueValue();
                if (result[uid]) {
                    continue;
                }
                result[uid] = 1;
                frontier.push(uid);
                guard++;
            }
        }
        return result;
    },

    // Active user sys_ids in a department.
    deptUserIds: function (deptId) {
        var set = {};
        var g = new GlideRecord('sys_user');
        g.addQuery('department', deptId);
        g.addQuery('active', true);
        g.setLimit(this.ORG_CAP);
        g.query();
        while (g.next()) {
            set[g.getUniqueValue()] = 1;
        }
        return set;
    },

    // Intersect a user set with each user-based category's deduped consumers.
    orgRollupForUsers: function (userSet, label) {
        var sets = this.userConsumerSets();
        var cats = [];
        for (var i = 0; i < sets.length; i++) {
            var s = sets[i];
            var users = [];
            var cnt = 0;
            for (var sid in s.ids) {
                if (userSet[sid]) {
                    cnt++;
                    if (users.length < this.LIST_LIMIT) {
                        users.push({ sys_id: sid, label: s.ids[sid] });
                    }
                }
            }
            cats.push({
                id: s.id,
                name: s.name,
                capability: s.capability,
                licensed_users: cnt,
                users: users,
                users_more: cnt > users.length,
            });
        }
        var size = 0;
        for (var u in userSet) {
            size++;
        }
        return { subject: label, population: size, generated: new GlideDateTime().getDisplayValue(), categories: cats };
    },

    // GlideAjax: manager + department picklists for the "By Org" tab.
    getOrgOptions: function () {
        if (!this._authorized()) {
            return JSON.stringify({ managers: [], departments: [] });
        }
        var managers = [];
        // Configurable: an encoded query on sys_user selecting who appears as a selectable
        // manager / VP / department head. Empty = default (anyone who manages an active user).
        var mq = gs.getProperty('x_1983_licutil.org.manager_query', '');
        if (mq) {
            var mu = new GlideRecord('sys_user');
            mu.addEncodedQuery(mq);
            mu.orderBy('name');
            mu.setLimit(this.DEDUP_CAP);
            mu.query();
            while (mu.next()) {
                managers.push({
                    sys_id: mu.getUniqueValue(),
                    name: mu.getDisplayValue('name') || mu.getValue('user_name'),
                });
            }
        } else {
            var ids = [];
            var seen = {};
            var ga = new GlideAggregate('sys_user');
            ga.addQuery('active', true);
            ga.addNotNullQuery('manager');
            ga.addAggregate('COUNT'); // ensure the aggregate materializes group rows
            ga.groupBy('manager');
            ga.query();
            while (ga.next()) {
                var m = ga.getValue('manager');
                if (m && !seen[m]) {
                    seen[m] = 1;
                    ids.push(m);
                }
            }
            if (ids.length) {
                var uu = new GlideRecord('sys_user');
                uu.addQuery('sys_id', 'IN', ids.join(','));
                uu.orderBy('name');
                uu.query();
                while (uu.next()) {
                    managers.push({
                        sys_id: uu.getUniqueValue(),
                        name: uu.getDisplayValue('name') || uu.getValue('user_name'),
                    });
                }
            }
        }
        var departments = [];
        var dg = new GlideRecord('cmn_department');
        dg.orderBy('name');
        dg.query();
        while (dg.next()) {
            departments.push({ sys_id: dg.getUniqueValue(), name: dg.getDisplayValue('name') });
        }
        return JSON.stringify({ managers: managers, departments: departments });
    },

    // GlideAjax: rollup for the selected manager subtree or department.
    getOrgData: function () {
        if (!this._authorized()) {
            return JSON.stringify({ error: 'Not authorized.' });
        }
        var scope = this.getParameter('sysparm_org_type') || 'manager';
        var id = this.getParameter('sysparm_org_id');
        if (!id) {
            return JSON.stringify({ error: 'Nothing selected.' });
        }
        if (scope === 'department') {
            var dg = new GlideRecord('cmn_department');
            if (!dg.get(id)) {
                return JSON.stringify({ error: 'Department not found.' });
            }
            return JSON.stringify(
                this.orgRollupForUsers(this.deptUserIds(id), dg.getDisplayValue('name') + ' (department)'),
            );
        }
        var mg = new GlideRecord('sys_user');
        if (!mg.get(id)) {
            return JSON.stringify({ error: 'Manager not found.' });
        }
        return JSON.stringify(
            this.orgRollupForUsers(this.orgSubtreeUserIds(id, false), mg.getDisplayValue('name') + ' (reports)'),
        );
    },

    // GlideAjax: FULL (uncapped) tier-deduped member list for the selected org/department, for
    // CSV export. Unlike getOrgData (which caps each category's list for display), this returns
    // every matching user so the CSV is complete.
    getOrgCsv: function () {
        if (!this._authorized()) {
            return JSON.stringify({ rows: [] });
        }
        var scope = this.getParameter('sysparm_org_type') || 'manager';
        var id = this.getParameter('sysparm_org_id');
        if (!id) {
            return JSON.stringify({ rows: [] });
        }
        var userSet, label;
        if (scope === 'department') {
            var dg = new GlideRecord('cmn_department');
            if (!dg.get(id)) {
                return JSON.stringify({ rows: [] });
            }
            userSet = this.deptUserIds(id);
            label = dg.getDisplayValue('name') + ' (department)';
        } else {
            var mg = new GlideRecord('sys_user');
            if (!mg.get(id)) {
                return JSON.stringify({ rows: [] });
            }
            userSet = this.orgSubtreeUserIds(id, false);
            label = mg.getDisplayValue('name') + ' (reports)';
        }
        var sets = this.userConsumerSets(); // full deduped id->label per user-based category
        var rows = [];
        for (var i = 0; i < sets.length; i++) {
            var s = sets[i];
            for (var sid in s.ids) {
                if (userSet[sid]) {
                    rows.push([s.name, s.ids[sid], sid]);
                }
            }
        }
        return JSON.stringify({ subject: label, generated: new GlideDateTime().getDisplayValue(), rows: rows });
    },

    // GlideAjax: the FULL tier-deduped member list for one category (for the drill-down
    // "download / see all"). For a user-based tiered SKU this returns the net set — users
    // already counted in a higher tier are excluded — so it matches the tile count exactly.
    // Non-user categories return their raw source list (no cross-tier dedup applies).
    getCategoryConsumers: function () {
        if (!this._authorized()) {
            return JSON.stringify({ error: 'You are not authorized to view license data.' });
        }
        var catId = this.getParameter('sysparm_cat_id');
        if (!catId) {
            return JSON.stringify({ error: 'No category specified.' });
        }
        var sets = this.userConsumerSets();
        for (var i = 0; i < sets.length; i++) {
            if (sets[i].id === catId) {
                var users = [];
                var ids = sets[i].ids;
                for (var sid in ids) {
                    users.push({ sys_id: sid, label: ids[sid] });
                }
                return JSON.stringify({ id: catId, name: sets[i].name, count: users.length, deduped: true, users: users });
            }
        }
        var gr = new GlideRecordSecure(this.CAT);
        if (gr.get(catId)) {
            var list = this.listConsumers(
                gr.getValue('source_table'),
                gr.getValue('source_query'),
                gr.getValue('consumer_ref_field'),
                gr.getValue('consumer_table'),
                this.DEDUP_CAP,
            );
            return JSON.stringify({ id: catId, name: gr.getValue('name'), count: list.length, deduped: false, users: list });
        }
        return JSON.stringify({ error: 'Category not found.' });
    },

    // Reusable server-side builder (also callable from server scripts / tests).
    // Snapshot-backed payload (fast, no live counting). consumed/utilization per category come
    // from the latest stored snapshot; trend/series from snapshot history. Member lists are
    // omitted (deferred) — the Source Records tab loads them on demand via getRecordsData.
    buildFromSnapshots: function () {
        var cats = {};
        var order = [];
        var gr = new GlideRecordSecure(this.CAT);
        gr.addQuery('active', true);
        gr.orderBy('capability');
        gr.orderBy('name');
        gr.query();
        while (gr.next()) {
            var id = gr.getUniqueValue();
            cats[id] = {
                id: id,
                name: gr.getValue('name') || '',
                sku: gr.getValue('sku_code') || '',
                capability: gr.getDisplayValue('capability') || '',
                purchased: 0,
                consumed: 0,
                raw_count: 0,
                count_mode: gr.getValue('count_mode') || 'records',
                su_ratio: parseInt(gr.getValue('su_ratio') || '1', 10),
                tier_group: gr.getValue('tier_group') || '',
                utilization: 0,
                source_table: gr.getValue('source_table') || '',
                source_query: gr.getValue('source_query') || '',
                consumers: [],
                consumer_count: 0,
                consumer_more: false,
                deferred: true,
                byMonth: {},
                series: [],
            };
            order.push(id);
        }

        var pg = new GlideRecordSecure(this.PUR);
        pg.query();
        while (pg.next()) {
            var pcat = pg.getValue('category');
            if (cats[pcat]) {
                cats[pcat].purchased += parseInt(pg.getValue('licenses_purchased') || '0', 10);
            }
        }

        var monthsSet = {};
        var cg = new GlideRecordSecure(this.CON);
        cg.orderBy('category');
        cg.orderBy('period_month');
        cg.query();
        while (cg.next()) {
            var ccat = cg.getValue('category');
            if (!cats[ccat]) {
                continue;
            }
            var m = cg.getValue('period_month') || '';
            monthsSet[m] = true;
            cats[ccat].byMonth[m] = {
                month: m,
                purchased: parseInt(cg.getValue('purchased') || '0', 10),
                consumed: parseInt(cg.getValue('consumed') || '0', 10),
                utilization: parseFloat(cg.getValue('utilization_pct') || '0'),
            };
        }

        var months = Object.keys(monthsSet).sort();
        var categories = [];
        var totalPurchased = 0;
        var totalConsumed = 0;
        for (var i = 0; i < order.length; i++) {
            var c = cats[order[i]];
            for (var j = 0; j < months.length; j++) {
                c.series.push(
                    c.byMonth[months[j]] || { month: months[j], purchased: 0, consumed: 0, utilization: 0 },
                );
            }
            if (c.series.length) {
                var last = c.series[c.series.length - 1];
                c.consumed = last.consumed;
                c.raw_count = last.consumed;
                c.consumer_count = last.consumed;
            }
            c.utilization = c.purchased > 0 ? this._round((c.consumed / c.purchased) * 100) : 0;
            delete c.byMonth;
            categories.push(c);
            totalPurchased += c.purchased;
            totalConsumed += c.consumed;
        }

        var overall = [];
        for (var k = 0; k < months.length; k++) {
            var mp = 0;
            var mc = 0;
            for (var q = 0; q < categories.length; q++) {
                var ptn = categories[q].series[k];
                mp += ptn.purchased;
                mc += ptn.consumed;
            }
            overall.push({
                month: months[k],
                purchased: mp,
                consumed: mc,
                utilization: mp > 0 ? this._round((mc / mp) * 100) : 0,
            });
        }

        var mom = { consumed_delta_pct: 0, utilization_delta: 0, has_prior: false };
        if (overall.length >= 2) {
            var cur = overall[overall.length - 1];
            var prev = overall[overall.length - 2];
            mom.has_prior = true;
            mom.consumed_delta_pct =
                prev.consumed > 0 ? this._round(((cur.consumed - prev.consumed) / prev.consumed) * 100) : 0;
            mom.utilization_delta = this._round(cur.utilization - prev.utilization);
        }

        var lastSnap = '';
        var ls = new GlideRecordSecure(this.CON);
        ls.orderByDesc('snapshot_date');
        ls.setLimit(1);
        ls.query();
        if (ls.next()) {
            lastSnap = ls.getDisplayValue('snapshot_date');
        }

        return {
            generated: new GlideDateTime().getDisplayValue(),
            snapshot_based: true,
            last_snapshot: lastSnap,
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
        };
    },

    // Compute live (tier-deduped) counts and upsert this period's snapshot rows. Shared by the
    // daily scheduled job and the admin "Refresh live" button.
    writeSnapshot: function () {
        var computed = this.computeCategories();
        var now = new GlideDateTime();
        var period = now.getValue().substring(0, 7);
        var today = now.getDate().getValue();
        var processed = 0;
        for (var i = 0; i < computed.order.length; i++) {
            var catId = computed.order[i];
            var consumed = computed.map[catId].consumed;
            var purchased = 0;
            var pg = new GlideRecord(this.PUR);
            pg.addQuery('category', catId);
            pg.query();
            while (pg.next()) {
                purchased += parseInt(pg.getValue('licenses_purchased') || '0', 10);
            }
            var util = purchased > 0 ? Math.round((consumed / purchased) * 10000) / 100 : 0;
            var snap = new GlideRecord(this.CON);
            snap.addQuery('category', catId);
            snap.addQuery('period_month', period);
            snap.query();
            if (snap.next()) {
                snap.setValue('purchased', purchased);
                snap.setValue('consumed', consumed);
                snap.setValue('utilization_pct', util);
                snap.setValue('snapshot_date', today);
                snap.update();
            } else {
                snap.initialize();
                snap.setValue('category', catId);
                snap.setValue('period_month', period);
                snap.setValue('purchased', purchased);
                snap.setValue('consumed', consumed);
                snap.setValue('utilization_pct', util);
                snap.setValue('snapshot_date', today);
                snap.insert();
            }
            processed++;
        }
        gs.info('[LicenseUtilization] Snapshot written for ' + period + ': ' + processed + ' category(ies).');
        return processed;
    },

    // Live payload (tier-deduped, computed on the fly). Retained for parity/testing; the UI now
    // uses buildFromSnapshots for speed.
    buildPayload: function () {
        var computed = this.computeCategories();
        var cats = computed.map;
        var order = computed.order;
        for (var oi = 0; oi < order.length; oi++) {
            var cinit = cats[order[oi]];
            cinit.purchased = 0;
            cinit.utilization = 0;
            cinit.byMonth = {};
            cinit.series = [];
        }

        // Purchased totals per category.
        var pg = new GlideRecordSecure(this.PUR);
        pg.query();
        while (pg.next()) {
            var pcat = pg.getValue('category');
            if (cats[pcat]) {
                cats[pcat].purchased += parseInt(pg.getValue('licenses_purchased') || '0', 10);
            }
        }

        // Monthly consumption snapshots + raw rows.
        var monthsSet = {};
        var cg = new GlideRecordSecure(this.CON);
        cg.orderBy('category');
        cg.orderBy('period_month');
        cg.query();
        while (cg.next()) {
            var ccat = cg.getValue('category');
            if (!cats[ccat]) {
                continue;
            }
            var m = cg.getValue('period_month') || '';
            monthsSet[m] = true;
            cats[ccat].byMonth[m] = {
                month: m,
                purchased: parseInt(cg.getValue('purchased') || '0', 10),
                consumed: parseInt(cg.getValue('consumed') || '0', 10),
                utilization: parseFloat(cg.getValue('utilization_pct') || '0'),
            };
        }

        var months = Object.keys(monthsSet).sort();

        var categories = [];
        var totalPurchased = 0;
        var totalConsumed = 0;
        for (var i = 0; i < order.length; i++) {
            var c = cats[order[i]];
            c.utilization = c.purchased > 0 ? this._round((c.consumed / c.purchased) * 100) : 0;
            for (var j = 0; j < months.length; j++) {
                var mm = months[j];
                c.series.push(c.byMonth[mm] || { month: mm, purchased: 0, consumed: 0, utilization: 0 });
            }
            delete c.byMonth;
            categories.push(c);
            totalPurchased += c.purchased;
            totalConsumed += c.consumed;
        }

        var overall = [];
        for (var k = 0; k < months.length; k++) {
            var mp = 0;
            var mc = 0;
            for (var q = 0; q < categories.length; q++) {
                var ptn = categories[q].series[k];
                mp += ptn.purchased;
                mc += ptn.consumed;
            }
            overall.push({
                month: months[k],
                purchased: mp,
                consumed: mc,
                utilization: mp > 0 ? this._round((mc / mp) * 100) : 0,
            });
        }

        var mom = { consumed_delta_pct: 0, utilization_delta: 0, has_prior: false };
        if (overall.length >= 2) {
            var cur = overall[overall.length - 1];
            var prev = overall[overall.length - 2];
            mom.has_prior = true;
            mom.consumed_delta_pct =
                prev.consumed > 0 ? this._round(((cur.consumed - prev.consumed) / prev.consumed) * 100) : 0;
            mom.utilization_delta = this._round(cur.utilization - prev.utilization);
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
        };
    },

    _round: function (n) {
        return Math.round(n * 100) / 100;
    },

    type: 'LicenseAnalytics',
});
