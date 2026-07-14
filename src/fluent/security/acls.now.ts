import { Acl } from '@servicenow/sdk/core'

// Roles are defined in ./roles.now.ts and referenced here by name (cross-file object
// imports are not supported in Fluent files).
const licAdmin = 'x_1983_licutil.admin'
const licViewer = 'x_1983_licutil.viewer'

// ── Access model ─────────────────────────────────────────────────────────────
//  read              → viewer + admin
//  create/write/del  → admin only
// adminOverrides:true → platform (base system) admins always pass.
// The dashboard data API (LicenseAnalytics, client_callable_script_include) is the
// real control on data reaching the browser; table ACLs govern list/form access.

// ── x_1983_licutil_category ──────────────────────────────────────────────────
Acl({ $id: Now.ID['acl_category_read'], type: 'record', table: 'x_1983_licutil_category', operation: 'read', decisionType: 'allow', roles: [licViewer, licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_category_create'], type: 'record', table: 'x_1983_licutil_category', operation: 'create', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_category_write'], type: 'record', table: 'x_1983_licutil_category', operation: 'write', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_category_delete'], type: 'record', table: 'x_1983_licutil_category', operation: 'delete', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })

// ── x_1983_licutil_purchase (admin configuration) ────────────────────────────
Acl({ $id: Now.ID['acl_purchase_read'], type: 'record', table: 'x_1983_licutil_purchase', operation: 'read', decisionType: 'allow', roles: [licViewer, licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_purchase_create'], type: 'record', table: 'x_1983_licutil_purchase', operation: 'create', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_purchase_write'], type: 'record', table: 'x_1983_licutil_purchase', operation: 'write', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_purchase_delete'], type: 'record', table: 'x_1983_licutil_purchase', operation: 'delete', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })

// ── x_1983_licutil_consumption (snapshot history) ────────────────────────────
Acl({ $id: Now.ID['acl_consumption_read'], type: 'record', table: 'x_1983_licutil_consumption', operation: 'read', decisionType: 'allow', roles: [licViewer, licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_consumption_create'], type: 'record', table: 'x_1983_licutil_consumption', operation: 'create', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_consumption_write'], type: 'record', table: 'x_1983_licutil_consumption', operation: 'write', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_consumption_delete'], type: 'record', table: 'x_1983_licutil_consumption', operation: 'delete', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })

// ── x_1983_licutil_org_rollup (published org/department rollup) ──────────────
Acl({ $id: Now.ID['acl_rollup_read'], type: 'record', table: 'x_1983_licutil_org_rollup', operation: 'read', decisionType: 'allow', roles: [licViewer, licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_rollup_create'], type: 'record', table: 'x_1983_licutil_org_rollup', operation: 'create', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_rollup_write'], type: 'record', table: 'x_1983_licutil_org_rollup', operation: 'write', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })
Acl({ $id: Now.ID['acl_rollup_delete'], type: 'record', table: 'x_1983_licutil_org_rollup', operation: 'delete', decisionType: 'allow', roles: [licAdmin], adminOverrides: true })

// ── Dashboard data API (GlideAjax) ───────────────────────────────────────────
// Only authenticated viewers/admins may execute the data provider.
Acl({
    $id: Now.ID['acl_analytics_execute'],
    type: 'client_callable_script_include',
    name: 'x_1983_licutil.LicenseAnalytics',
    operation: 'execute',
    decisionType: 'allow',
    roles: [licViewer, licAdmin],
    securityAttribute: 'user_is_authenticated',
    adminOverrides: true,
})
