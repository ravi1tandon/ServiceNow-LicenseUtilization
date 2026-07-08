import { Record } from '@servicenow/sdk/core'

// Demo data (installMethod: 'demo'): loads on demo install so the dashboard shows MoM
// trends immediately. Not loaded on a standard production install.

// ── Categories (Platform Analytics SKUs) ─────────────────────────────────────
const catStd = Record({
    $id: Now.ID['seed_cat_std'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'Platform Analytics - Standard', sku_code: 'PA-STD', capability: 'platform_analytics', description: 'Standard Platform Analytics dashboards & KPIs.', current_consumed: 420, active: true },
})
const catPro = Record({
    $id: Now.ID['seed_cat_pro'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'Platform Analytics - Pro', sku_code: 'PA-PRO', capability: 'platform_analytics', description: 'Pro tier with predictive intelligence.', current_consumed: 185, active: true },
})
const catPrem = Record({
    $id: Now.ID['seed_cat_prem'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'Platform Analytics - Premium', sku_code: 'PA-PREM', capability: 'platform_analytics', description: 'Premium tier with advanced data storytelling.', current_consumed: 95, active: true },
})

// ── Purchases (admin configuration) ──────────────────────────────────────────
Record({ $id: Now.ID['seed_pur_std'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catStd, licenses_purchased: 500, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_pro'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catPro, licenses_purchased: 200, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_prem'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catPrem, licenses_purchased: 100, purchase_date: '2026-01-01', period: 'FY26' } })

// ── Consumption history (4 months, feeds MoM trending). utilization_pct also
//    recomputed by the 'Compute Utilization %' business rule on insert. ─────────
Record({ $id: Now.ID['seed_con_std_03'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catStd, period_month: '2026-03', snapshot_date: '2026-03-01', purchased: 500, consumed: 300, utilization_pct: 60 } })
Record({ $id: Now.ID['seed_con_std_04'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catStd, period_month: '2026-04', snapshot_date: '2026-04-01', purchased: 500, consumed: 350, utilization_pct: 70 } })
Record({ $id: Now.ID['seed_con_std_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catStd, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 500, consumed: 390, utilization_pct: 78 } })
Record({ $id: Now.ID['seed_con_std_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catStd, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 500, consumed: 420, utilization_pct: 84 } })

Record({ $id: Now.ID['seed_con_pro_03'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPro, period_month: '2026-03', snapshot_date: '2026-03-01', purchased: 200, consumed: 120, utilization_pct: 60 } })
Record({ $id: Now.ID['seed_con_pro_04'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPro, period_month: '2026-04', snapshot_date: '2026-04-01', purchased: 200, consumed: 150, utilization_pct: 75 } })
Record({ $id: Now.ID['seed_con_pro_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPro, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 200, consumed: 170, utilization_pct: 85 } })
Record({ $id: Now.ID['seed_con_pro_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPro, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 200, consumed: 185, utilization_pct: 92.5 } })

Record({ $id: Now.ID['seed_con_prem_03'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPrem, period_month: '2026-03', snapshot_date: '2026-03-01', purchased: 100, consumed: 60, utilization_pct: 60 } })
Record({ $id: Now.ID['seed_con_prem_04'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPrem, period_month: '2026-04', snapshot_date: '2026-04-01', purchased: 100, consumed: 72, utilization_pct: 72 } })
Record({ $id: Now.ID['seed_con_prem_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPrem, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 100, consumed: 85, utilization_pct: 85 } })
Record({ $id: Now.ID['seed_con_prem_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPrem, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 100, consumed: 95, utilization_pct: 95 } })
