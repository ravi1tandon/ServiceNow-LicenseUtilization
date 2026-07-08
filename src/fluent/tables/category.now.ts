import { Table, StringColumn, ChoiceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

// License Category / SKU. One row per purchasable license SKU, grouped by capability.
// Variable name MUST match the `name` property.
export const x_1983_licutil_category = Table({
    name: 'x_1983_licutil_category',
    label: 'License Category',
    display: 'name',
    createAccessControls: false, // ACLs are declared explicitly in ../security/acls.now.ts
    schema: {
        name: StringColumn({ label: 'Name', maxLength: 100, mandatory: true }),
        sku_code: StringColumn({ label: 'SKU Code', maxLength: 60 }),
        capability: ChoiceColumn({
            label: 'Capability',
            default: 'platform_analytics',
            choices: {
                platform_analytics: 'Platform Analytics',
                itsm: 'ITSM',
                itom: 'ITOM',
                hrsd: 'HRSD',
                csm: 'CSM',
                secops: 'Security Operations',
                other: 'Other',
            },
        }),
        description: StringColumn({ label: 'Description', maxLength: 500 }),
        // ── Consumer source (defines which real records "consume" this license) ──
        // consumed is counted live from source_table + source_query. If consumer_ref_field
        // is set (e.g. 'user' on sys_user_has_role), distinct values of that field are counted
        // and used as the drill-down record; otherwise each source row is a consumer.
        source_table: StringColumn({ label: 'Source Table', maxLength: 80 }),
        source_query: StringColumn({ label: 'Source Encoded Query', maxLength: 1000 }),
        consumer_ref_field: StringColumn({ label: 'Consumer Field', maxLength: 60 }),
        consumer_table: StringColumn({ label: 'Consumer Table (for drill-down link)', maxLength: 80 }),
        // Counting mode. 'records' = 1 consumed per distinct record (users, entitlements).
        // 'subscription_units' = ServiceNow ITOM SU model: consumed = ceil(records / su_ratio),
        // e.g. servers 1:1 (ratio 1), PaaS/containers 3:1 (ratio 3). See license_itom_ci_su_ratio.
        count_mode: ChoiceColumn({
            label: 'Count Mode',
            default: 'records',
            choices: {
                records: 'Record count',
                subscription_units: 'Subscription units (ratio)',
            },
        }),
        su_ratio: IntegerColumn({ label: 'Source records per subscription unit', default: 1 }),
        // Manual fallback used only when source_table is empty.
        current_consumed: IntegerColumn({ label: 'Current Consumed (manual)' }),
        active: BooleanColumn({ label: 'Active', default: true }),
    },
})
