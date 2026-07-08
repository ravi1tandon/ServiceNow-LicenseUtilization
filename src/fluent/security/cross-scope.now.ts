import { CrossScopePrivilege } from '@servicenow/sdk/core'

// The dashboard reads real "consumer" records from tables owned by other scopes.
// ServiceNow blocks cross-scope reads (Restricted Caller Access) unless the app
// declares them. Each privilege is READ-ONLY and table-specific (least privilege).
// If you point a category at a different source table, add a matching read privilege.

// sys_user — resolve/display consumer users.
CrossScopePrivilege({
    $id: Now.ID['xsp_sys_user'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_user',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// sys_user_has_role — role-based consumers (ITIL, Platform Analytics, Business Stakeholder).
CrossScopePrivilege({
    $id: Now.ID['xsp_user_has_role'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_user_has_role',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// cmdb_ci_computer / cmdb_ci_server — device-based consumers (Discovery).
CrossScopePrivilege({
    $id: Now.ID['xsp_cmdb_computer'],
    operation: 'read',
    status: 'allowed',
    targetName: 'cmdb_ci_computer',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
CrossScopePrivilege({
    $id: Now.ID['xsp_cmdb_server'],
    operation: 'read',
    status: 'allowed',
    targetName: 'cmdb_ci_server',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// alm_entitlement — Software Asset Management entitlements (SAM).
CrossScopePrivilege({
    $id: Now.ID['xsp_alm_entitlement'],
    operation: 'read',
    status: 'allowed',
    targetName: 'alm_entitlement',
    targetScope: 'global',
    targetType: 'sys_db_object',
})

// sn_entitlement_genai_assist_analytics — NowAssist token usage (scope: sn_entitlement,
// app "Licensing Engine"). This scope may additionally enforce its own Restricted Caller
// Access approval; the analytics script tolerates a denial (that category shows 0 + a note)
// so one locked-down source never breaks the dashboard.
CrossScopePrivilege({
    $id: Now.ID['xsp_genai_assist'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sn_entitlement_genai_assist_analytics',
    targetScope: 'sn_entitlement',
    targetType: 'sys_db_object',
})
