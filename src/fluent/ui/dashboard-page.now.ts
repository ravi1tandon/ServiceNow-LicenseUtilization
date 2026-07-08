import { UiPage } from '@servicenow/sdk/core'

// Interactive License Utilization dashboard. Renders MoM consumption/utilization and a
// dynamic card per configured SKU. Data is fetched via GlideAjax (LicenseAnalytics),
// so new categories/SKUs appear automatically with no dashboard changes.
UiPage({
    $id: Now.ID['ui_dashboard'],
    endpoint: 'x_1983_licutil_dashboard.do',
    category: 'general',
    // direct:false — render within the platform context so GlideAjax and the standard
    // client library are available to the client script.
    direct: false,
    description: 'License Utilization & Consumption dashboard (MoM trending, per-SKU widgets).',
    html: Now.include('../../server/dashboard.html'),
    clientScript: Now.include('../../server/dashboard.client.js'),
})
