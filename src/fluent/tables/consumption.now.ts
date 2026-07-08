import { Table, ReferenceColumn, IntegerColumn, DecimalColumn, StringColumn, DateColumn } from '@servicenow/sdk/core'

// Monthly consumption snapshot. One row per (category, month) — the source of MoM trending.
export const x_1983_licutil_consumption = Table({
    name: 'x_1983_licutil_consumption',
    label: 'License Consumption',
    display: 'period_month',
    createAccessControls: false,
    schema: {
        category: ReferenceColumn({
            label: 'Category',
            referenceTable: 'x_1983_licutil_category',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        period_month: StringColumn({ label: 'Month (YYYY-MM)', maxLength: 7, mandatory: true }),
        snapshot_date: DateColumn({ label: 'Snapshot Date' }),
        purchased: IntegerColumn({ label: 'Purchased' }),
        consumed: IntegerColumn({ label: 'Consumed' }),
        utilization_pct: DecimalColumn({ label: 'Utilization %' }),
    },
})
