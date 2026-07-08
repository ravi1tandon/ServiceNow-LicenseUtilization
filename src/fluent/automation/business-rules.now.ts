import { BusinessRule } from '@servicenow/sdk/core'

// Keep utilization_pct consistent whenever a consumption snapshot is written manually,
// imported, or created by the scheduled job. utilization = consumed / purchased * 100.
BusinessRule({
    $id: Now.ID['br_compute_utilization'],
    name: 'Compute Utilization %',
    table: 'x_1983_licutil_consumption',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    script: `(function executeRule(current, previous) {
    var purchased = parseInt(current.getValue('purchased') || '0', 10);
    var consumed = parseInt(current.getValue('consumed') || '0', 10);
    var util = purchased > 0 ? Math.round((consumed / purchased) * 10000) / 100 : 0;
    current.setValue('utilization_pct', util);
})(current, previous);`,
})
