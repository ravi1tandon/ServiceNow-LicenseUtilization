import { ScriptInclude } from '@servicenow/sdk/core'

// Server-side data provider for the dashboard. Client-callable via GlideAjax and
// reusable from server scripts (scheduled job). Access controlled by acl_analytics_execute.
ScriptInclude({
    $id: Now.ID['si_license_analytics'],
    name: 'LicenseAnalytics',
    apiName: 'x_1983_licutil.LicenseAnalytics',
    active: true,
    clientCallable: true,
    accessibleFrom: 'package_private',
    description: 'Aggregates license category, purchase, and consumption data into dashboard JSON (totals, MoM series, per-SKU trends).',
    script: Now.include('../../server/LicenseAnalytics.server.js'),
})
