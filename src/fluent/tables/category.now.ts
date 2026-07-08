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
        // Live consumed count. Populated by an integration or admin; snapshotted monthly.
        current_consumed: IntegerColumn({ label: 'Current Consumed' }),
        active: BooleanColumn({ label: 'Active', default: true }),
    },
})
