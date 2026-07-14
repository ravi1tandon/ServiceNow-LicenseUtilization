import { ScheduledScript } from '@servicenow/sdk/core'

// Auto-publishes license rollups per reporting line (every manager's subtree) and per department
// into x_1983_licutil_org_rollup, on the 1st of each month. Department heads/VPs can then view or
// export their org's license usage without running anything.
export const orgRollupJob = ScheduledScript({
    $id: Now.ID['job_org_rollup'],
    name: 'License Org & Department Rollup',
    active: true,
    frequency: 'monthly',
    dayOfMonth: 1,
    executionTime: { hours: 2, minutes: 0, seconds: 0 },
    timeZone: 'UTC',
    script: Now.include('../../server/orgrollup.js'),
})
