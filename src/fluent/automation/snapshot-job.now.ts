import { ScheduledScript } from '@servicenow/sdk/core'

// Runs on the 1st of each month and writes a consumption snapshot per active category.
export const monthlySnapshot = ScheduledScript({
    $id: Now.ID['job_monthly_snapshot'],
    name: 'License Utilization - Monthly Snapshot',
    active: true,
    frequency: 'monthly',
    dayOfMonth: 1,
    executionTime: { hours: 1, minutes: 0, seconds: 0 },
    timeZone: 'UTC',
    script: Now.include('../../server/snapshot.js'),
})
