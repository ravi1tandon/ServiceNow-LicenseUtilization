import { ScheduledScript } from '@servicenow/sdk/core'

// Runs daily and upserts this period's consumption snapshot per active category, so the
// snapshot-backed dashboard stays fresh without recomputing on every page load.
export const monthlySnapshot = ScheduledScript({
    $id: Now.ID['job_monthly_snapshot'],
    name: 'License Utilization - Daily Snapshot',
    active: true,
    frequency: 'daily',
    executionTime: { hours: 1, minutes: 0, seconds: 0 },
    timeZone: 'UTC',
    script: Now.include('../../server/snapshot.js'),
})
