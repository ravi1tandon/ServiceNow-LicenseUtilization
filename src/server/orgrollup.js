// Auto-publish license rollups by reporting line (each manager's whole subtree) and by department.
// Upserts one row per (subject, category, month) into x_1983_licutil_org_rollup. Counts are the
// tier-deduped licensed-user counts from LicenseAnalytics (a user counted once, at highest tier).
(function runOrgRollup() {
    var ROLLUP = 'x_1983_licutil_org_rollup';
    var analytics = new x_1983_licutil.LicenseAnalytics();
    var now = new GlideDateTime();
    var period = now.getValue().substring(0, 7);
    var today = now.getDate().getValue();

    // User-based category consumer sets (tier-deduped), computed once.
    var sets = analytics.userConsumerSets();

    function upsert(type, managerId, deptId, label, catId, licensed, population) {
        var gr = new GlideRecord(ROLLUP);
        gr.addQuery('subject_type', type);
        gr.addQuery('category', catId);
        gr.addQuery('period_month', period);
        gr.addQuery(type === 'manager' ? 'manager' : 'department', type === 'manager' ? managerId : deptId);
        gr.query();
        if (!gr.next()) {
            gr.initialize();
        }
        gr.setValue('subject_type', type);
        gr.setValue('subject_label', label);
        if (managerId) {
            gr.setValue('manager', managerId);
        }
        if (deptId) {
            gr.setValue('department', deptId);
        }
        gr.setValue('category', catId);
        gr.setValue('licensed_users', licensed);
        gr.setValue('population', population);
        gr.setValue('period_month', period);
        gr.setValue('snapshot_date', today);
        gr.update(); // update() inserts when the record was initialized (no sys_id yet)
    }

    function rollupUserSet(type, managerId, deptId, label, userSet) {
        var pop = 0;
        for (var u in userSet) {
            pop++;
        }
        if (pop === 0) {
            return 0;
        }
        var wrote = 0;
        for (var i = 0; i < sets.length; i++) {
            var s = sets[i];
            var cnt = 0;
            for (var sid in s.ids) {
                if (userSet[sid]) {
                    cnt++;
                }
            }
            if (cnt > 0) {
                upsert(type, managerId, deptId, label, s.id, cnt, pop);
                wrote++;
            }
        }
        return wrote;
    }

    var managers = 0,
        depts = 0,
        rows = 0;

    // Managers (anyone who manages at least one active user).
    var ga = new GlideAggregate('sys_user');
    ga.addQuery('active', true);
    ga.addNotNullQuery('manager');
    ga.groupBy('manager');
    ga.query();
    var mgrIds = [];
    while (ga.next()) {
        var m = ga.getValue('manager');
        if (m) {
            mgrIds.push(m);
        }
    }
    for (var mi = 0; mi < mgrIds.length; mi++) {
        var mg = new GlideRecord('sys_user');
        if (!mg.get(mgrIds[mi])) {
            continue;
        }
        var subtree = analytics.orgSubtreeUserIds(mgrIds[mi], false);
        rows += rollupUserSet('manager', mgrIds[mi], null, mg.getDisplayValue('name') + ' (reports)', subtree);
        managers++;
    }

    // Departments.
    var dg = new GlideRecord('cmn_department');
    dg.query();
    while (dg.next()) {
        var deptId = dg.getUniqueValue();
        rows += rollupUserSet(
            'department',
            null,
            deptId,
            dg.getDisplayValue('name') + ' (department)',
            analytics.deptUserIds(deptId),
        );
        depts++;
    }

    gs.info(
        '[LicenseUtilization] Org rollup complete for ' +
            period +
            ': ' +
            managers +
            ' manager(s), ' +
            depts +
            ' department(s), ' +
            rows +
            ' row(s).',
    );
})();
