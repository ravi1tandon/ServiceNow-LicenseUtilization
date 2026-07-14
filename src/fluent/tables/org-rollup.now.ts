import { Table, ReferenceColumn, ChoiceColumn, IntegerColumn, StringColumn, DateColumn } from '@servicenow/sdk/core'

// Published license rollup by reporting line (manager subtree) or department. Populated by the
// "License Org & Department Rollup" scheduled job for auto-publish/history; also exportable to CSV.
export const x_1983_licutil_org_rollup = Table({
    name: 'x_1983_licutil_org_rollup',
    label: 'License Org Rollup',
    display: 'subject_label',
    createAccessControls: false, // ACLs declared in ../security/acls.now.ts
    schema: {
        subject_type: ChoiceColumn({
            label: 'Scope',
            default: 'manager',
            choices: { manager: 'Reports to (manager)', department: 'Department' },
        }),
        subject_label: StringColumn({ label: 'Subject', maxLength: 150 }),
        manager: ReferenceColumn({ label: 'Manager', referenceTable: 'sys_user', cascadeRule: 'delete' }),
        department: ReferenceColumn({ label: 'Department', referenceTable: 'cmn_department', cascadeRule: 'delete' }),
        category: ReferenceColumn({ label: 'Category', referenceTable: 'x_1983_licutil_category', cascadeRule: 'delete' }),
        licensed_users: IntegerColumn({ label: 'Licensed Users' }),
        population: IntegerColumn({ label: 'Population (in scope)' }),
        period_month: StringColumn({ label: 'Month (YYYY-MM)', maxLength: 7 }),
        snapshot_date: DateColumn({ label: 'Snapshot Date' }),
    },
})
