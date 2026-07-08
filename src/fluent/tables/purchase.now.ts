import { Table, ReferenceColumn, IntegerColumn, DateColumn, StringColumn } from '@servicenow/sdk/core'

// License Purchase (admin configuration). Number of licenses purchased per category.
export const x_1983_licutil_purchase = Table({
    name: 'x_1983_licutil_purchase',
    label: 'License Purchase',
    display: 'category',
    createAccessControls: false,
    schema: {
        category: ReferenceColumn({
            label: 'Category',
            referenceTable: 'x_1983_licutil_category',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        licenses_purchased: IntegerColumn({ label: 'Licenses Purchased', mandatory: true }),
        purchase_date: DateColumn({ label: 'Purchase Date' }),
        period: StringColumn({ label: 'Contract Period', maxLength: 40 }),
        notes: StringColumn({ label: 'Notes', maxLength: 500 }),
    },
})
