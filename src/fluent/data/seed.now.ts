import { Record } from '@servicenow/sdk/core'

// Demo data (installMethod: 'demo'). Categories map each license to REAL consumer records
// via source_table + source_query (+ consumer_ref_field for distinct users). "Consumed" is
// counted live from those records; the Source Records tab drills into the actual users/devices.
// Purchases are admin config. Two months of consumption seed give MoM history immediately;
// the monthly snapshot job appends the real current month from live counts.

// ── Categories (real license → real consumer source) ─────────────────────────
const catItil = Record({
    $id: Now.ID['seed_cat_itil'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'ITIL (Fulfiller)', sku_code: 'ITIL', capability: 'itsm', description: 'Fulfiller subscription — users with the itil role.', source_table: 'sys_user_has_role', source_query: 'role.name=itil', consumer_ref_field: 'user', consumer_table: 'sys_user', active: true },
})
const catPa = Record({
    $id: Now.ID['seed_cat_pa'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'Platform Analytics', sku_code: 'PA', capability: 'platform_analytics', description: 'Users holding any Platform Analytics (pa_*) role.', source_table: 'sys_user_has_role', source_query: 'role.nameSTARTSWITHpa_', consumer_ref_field: 'user', consumer_table: 'sys_user', active: true },
})
const catDisc = Record({
    $id: Now.ID['seed_cat_disc'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'Discovery (Devices)', sku_code: 'DISCOVERY', capability: 'itom', description: 'ITOM/Discovery — counted in Subscription Units. Per ServiceNow: servers/computers 1:1 (ratio 1); PaaS/containers 3:1 (set ratio 3). Adjust su_ratio to your contract / license_itom_ci_su_ratio.', source_table: 'cmdb_ci_computer', source_query: '', consumer_ref_field: '', consumer_table: 'cmdb_ci_computer', count_mode: 'subscription_units', su_ratio: 1, active: true },
})
const catBiz = Record({
    $id: Now.ID['seed_cat_biz'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'Business Stakeholder', sku_code: 'BIZ-STK', capability: 'other', description: 'Users with the business_stakeholder role.', source_table: 'sys_user_has_role', source_query: 'role.name=business_stakeholder', consumer_ref_field: 'user', consumer_table: 'sys_user', active: true },
})
const catSam = Record({
    $id: Now.ID['seed_cat_sam'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    data: { name: 'SAM Software Entitlements', sku_code: 'SAM-ENT', capability: 'other', description: 'Software Asset Management license entitlements (alm_entitlement).', source_table: 'alm_entitlement', source_query: '', consumer_ref_field: '', consumer_table: 'alm_entitlement', active: true },
})
const catNa = Record({
    $id: Now.ID['seed_cat_nowassist'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_category',
    // INACTIVE by default: sn_entitlement_genai_assist_analytics is protected by Restricted
    // Caller Access, owned by the "Licensing Engine" (sn_entitlement) app. An app cannot
    // self-approve that read, so shipping it active would surface a denial banner. To enable:
    // approve the pending RCA request (All → System Applications → ... Restricted Caller Access,
    // set the x_1983_licutil → sn_entitlement read to Allowed), then set this category Active.
    data: { name: 'Now Assist (Assists)', sku_code: 'NOWASSIST', capability: 'other', description: 'Now Assist GenAI assist usage (token-based). Inactive by default — requires Restricted Caller Access approval for sn_entitlement_genai_assist_analytics before activating.', source_table: 'sn_entitlement_genai_assist_analytics', source_query: '', consumer_ref_field: '', consumer_table: 'sn_entitlement_genai_assist_analytics', active: false },
})

// ── Purchases (admin configuration) ──────────────────────────────────────────
Record({ $id: Now.ID['seed_pur_itil'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catItil, licenses_purchased: 75, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_pa'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catPa, licenses_purchased: 40, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_disc'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catDisc, licenses_purchased: 200, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_biz'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catBiz, licenses_purchased: 50, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_sam'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catSam, licenses_purchased: 120, purchase_date: '2026-01-01', period: 'FY26' } })
Record({ $id: Now.ID['seed_pur_nowassist'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_purchase', data: { category: catNa, licenses_purchased: 100, purchase_date: '2026-01-01', period: 'FY26' } })

// ── Consumption history (2 demo months; snapshot job appends the real current month) ──
Record({ $id: Now.ID['seed_con_itil_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catItil, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 75, consumed: 48, utilization_pct: 64 } })
Record({ $id: Now.ID['seed_con_itil_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catItil, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 75, consumed: 52, utilization_pct: 69.33 } })
Record({ $id: Now.ID['seed_con_pa_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPa, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 40, consumed: 14, utilization_pct: 35 } })
Record({ $id: Now.ID['seed_con_pa_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catPa, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 40, consumed: 18, utilization_pct: 45 } })
Record({ $id: Now.ID['seed_con_disc_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catDisc, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 200, consumed: 130, utilization_pct: 65 } })
Record({ $id: Now.ID['seed_con_disc_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catDisc, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 200, consumed: 140, utilization_pct: 70 } })
Record({ $id: Now.ID['seed_con_biz_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catBiz, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 50, consumed: 20, utilization_pct: 40 } })
Record({ $id: Now.ID['seed_con_biz_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catBiz, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 50, consumed: 22, utilization_pct: 44 } })
Record({ $id: Now.ID['seed_con_sam_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catSam, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 120, consumed: 95, utilization_pct: 79.17 } })
Record({ $id: Now.ID['seed_con_sam_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catSam, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 120, consumed: 100, utilization_pct: 83.33 } })
Record({ $id: Now.ID['seed_con_na_05'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catNa, period_month: '2026-05', snapshot_date: '2026-05-01', purchased: 100, consumed: 40, utilization_pct: 40 } })
Record({ $id: Now.ID['seed_con_na_06'], $meta: { installMethod: 'demo' }, table: 'x_1983_licutil_consumption', data: { category: catNa, period_month: '2026-06', snapshot_date: '2026-06-01', purchased: 100, consumed: 46, utilization_pct: 46 } })
