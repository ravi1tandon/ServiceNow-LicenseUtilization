import { ApplicationMenu, Record } from '@servicenow/sdk/core'

// Roles (defined in ../security/roles.now.ts) referenced by name.
const ADMIN = 'x_1983_licutil.admin'
const VIEWER = 'x_1983_licutil.viewer'

// Top-level navigator section. Visible to viewers and admins.
export const licMenu = ApplicationMenu({
    $id: Now.ID['menu_licutil'],
    title: 'License Utilization',
    hint: 'License utilization & consumption dashboards and configuration',
    description: 'Monitor MoM license consumption and configure purchased licenses.',
    roles: [VIEWER, ADMIN],
    active: true,
})

// Dashboard launcher (all users with access).
Record({
    $id: Now.ID['mod_dashboard'],
    table: 'sys_app_module',
    data: {
        title: 'Dashboard',
        application: licMenu,
        link_type: 'DIRECT',
        query: 'x_1983_licutil_dashboard.do',
        hint: 'Open the interactive license utilization dashboard',
        roles: [VIEWER, ADMIN],
        active: true,
        order: 100,
    },
})

// Consumption history (read).
Record({
    $id: Now.ID['mod_consumption'],
    table: 'sys_app_module',
    data: {
        title: 'Consumption Snapshots',
        application: licMenu,
        link_type: 'LIST',
        name: 'x_1983_licutil_consumption',
        roles: [VIEWER, ADMIN],
        active: true,
        order: 200,
    },
})

// Published org/department license rollup (viewer + admin).
Record({
    $id: Now.ID['mod_org_rollup'],
    table: 'sys_app_module',
    data: {
        title: 'Org & Department Rollup',
        application: licMenu,
        link_type: 'LIST',
        name: 'x_1983_licutil_org_rollup',
        hint: 'License counts by reporting line and department (auto-published monthly)',
        roles: [VIEWER, ADMIN],
        active: true,
        order: 250,
    },
})

// ── Administration (admin only) ──────────────────────────────────────────────
Record({
    $id: Now.ID['mod_sep_admin'],
    table: 'sys_app_module',
    data: {
        title: 'Configuration',
        application: licMenu,
        link_type: 'SEPARATOR',
        roles: [ADMIN],
        active: true,
        order: 300,
    },
})

// Admin configuration page: number of licenses purchased per category.
Record({
    $id: Now.ID['mod_purchase'],
    table: 'sys_app_module',
    data: {
        title: 'License Purchases',
        application: licMenu,
        link_type: 'LIST',
        name: 'x_1983_licutil_purchase',
        hint: 'Configure the number of licenses purchased per category (admin only)',
        roles: [ADMIN],
        active: true,
        order: 400,
    },
})

Record({
    $id: Now.ID['mod_category'],
    table: 'sys_app_module',
    data: {
        title: 'License Categories',
        application: licMenu,
        link_type: 'LIST',
        name: 'x_1983_licutil_category',
        hint: 'Manage license categories / SKUs (admin only)',
        roles: [ADMIN],
        active: true,
        order: 500,
    },
})

// App settings (system properties for this app, incl. the Org dropdown query).
Record({
    $id: Now.ID['mod_settings'],
    table: 'sys_app_module',
    data: {
        title: 'App Settings',
        application: licMenu,
        link_type: 'LIST',
        name: 'sys_properties',
        filter: 'nameSTARTSWITHx_1983_licutil',
        hint: 'App configuration properties, including the By Org manager/VP dropdown query',
        roles: [ADMIN],
        active: true,
        order: 600,
    },
})
