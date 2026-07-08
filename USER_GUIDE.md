# User Guide — License Utilization & Consumption Dashboard

This manual has two parts: **[Administrator Guide](#administrator-guide)** (configure the app)
and **[End-User Guide](#end-user-guide)** (read and validate the dashboard).

Navigator entry after install: **License Utilization** (type "License Utilization" in the
Filter navigator / "All" menu).

---

## Concepts

| Term | Meaning |
|---|---|
| **Category / SKU** | A purchasable license line, grouped by *capability* (e.g. Platform Analytics). |
| **Purchased** | How many licenses were bought for a category (admin-entered). |
| **Consumed** | Counted **live from real records** defined by the category's *source query* (e.g. distinct users with the `itil` role, or discovered devices). Falls back to a manual *Current Consumed* value only if no source is set. |
| **Consumer source** | Per category: a **Source Table** + **Source Encoded Query** (+ optional **Consumer Field**) that identifies the actual users/devices/records consuming the license. |
| **Subscription Units (SU)** | ITOM/Discovery-style licensing where consumed units ≠ raw record count. When a category's **Count Mode** = *Subscription units*, `Consumed = ceil(records ÷ su_ratio)`. Per ServiceNow's official model: **servers/VMs 1:1**, **PaaS/containers 3:1**, **unresolved monitored objects 1:1**. Exact per-CI-class ratios live in `license_itom_ci_su_ratio`; set **su_ratio** to match your contract. |
| **Utilization %** | `Consumed ÷ Purchased × 100`. ≥75% shows amber, ≥90% red on SKU cards. |
| **Snapshot** | A monthly row (per category) recording purchased/consumed/utilization — the history behind MoM trends. |
| **MoM** | Month-over-month: the change from the previous month to the latest. |

---

## Administrator Guide

**Role required:** `x_1983_licutil.admin` (or base `admin`).

Navigator: **License Utilization → Configuration** (visible to admins only).

### 1. Create license categories (SKUs)

1. Go to **License Utilization → Configuration → License Categories**.
2. Click **New** and fill in:
   - **Name** (required) — e.g. `Platform Analytics - Standard`.
   - **SKU Code** — your catalog code, e.g. `ITIL`.
   - **Capability** — choose the grouping (e.g. *Platform Analytics*).
   - **Source Table** — the table holding the real consumers, e.g. `sys_user_has_role`, `cmdb_ci_computer`, `alm_entitlement`.
   - **Source Encoded Query** — filters the consumers, e.g. `role.name=itil` or `role.nameSTARTSWITHpa_`. Leave blank to count all rows.
   - **Consumer Field** — set to the reference field identifying the actual consumer when the source is a mapping table (e.g. `user` on `sys_user_has_role`, so *distinct users* are counted). Leave blank when each row is itself the consumer (e.g. devices, entitlements).
   - **Consumer Table** — the table the drill-down "Open" link points to (e.g. `sys_user`). Defaults to the source table.
   - **Count Mode** — `Record count` (default; 1 consumed per distinct record) or `Subscription units (ratio)` for ITOM/Discovery-style licensing.
   - **Source records per subscription unit** (`su_ratio`) — used when Count Mode is *Subscription units*. Consumed = `ceil(records ÷ ratio)`. Per ServiceNow: servers/VMs = **1**, PaaS/containers = **3**. Set to your contracted ratio.
   - **Current Consumed (manual)** — used **only** if Source Table is blank.
   - **Active** — leave checked to include it on the dashboard.
3. **Save**. Consumed is now counted live from those records; a new category automatically gets its own card, trend line, and Source Records section — no dashboard edits needed.

#### Seeded examples (verified on this instance)

| License | Source Table | Source Query | Consumer Field | Count Mode |
|---|---|---|---|---|
| ITIL (Fulfiller) | `sys_user_has_role` | `role.name=itil` | `user` | Record count |
| Platform Analytics | `sys_user_has_role` | `role.nameSTARTSWITHpa_` | `user` | Record count |
| Business Stakeholder | `sys_user_has_role` | `role.name=business_stakeholder` | `user` | Record count |
| Discovery (Devices) | `cmdb_ci_computer` | *(none)* | *(none)* | **Subscription units** (ratio 1 = official server/VM 1:1) |
| SAM Software Entitlements | `alm_entitlement` | *(none)* | *(none)* | Record count |
| Now Assist (Assists) | `sn_entitlement_genai_assist_analytics` | *(none)* | *(none)* | Record count — **INACTIVE by default** (see RCA note) |

> **Enabling Now Assist (Restricted Caller Access):** its source table is owned by ServiceNow's "Licensing Engine" (`sn_entitlement`) app, which enforces **Restricted Caller Access**. An app can't self-approve this, so the category ships **inactive**. To turn it on: **All → System Definition → Restricted Caller Access Privileges** (`sys_restricted_caller_access`), find the request where **Source = License Utilization Dashboard** and **Target table = sn_entitlement_genai_assist_analytics**, set **Status = Allowed**; then open the *Now Assist* category and check **Active**. Until then, leaving it inactive avoids the "access denied" banner.

> **Discovery / ITOM counting:** consumption is in **Subscription Units**, not raw devices. Per ServiceNow's official model, servers/VMs consume **1:1** (so with `su_ratio = 1` the SU count equals the device count), while **PaaS and containers consume 3:1** (`su_ratio = 3`). Point additional ITOM categories at the relevant CI class and set `su_ratio` accordingly; the exact per-class matrix is in `license_itom_ci_su_ratio` on a licensed instance. Sources: [ITOM SU Overview](https://www.servicenow.com/content/dam/servicenow-assets/public/en-us/doc-type/legal/it-operations-management-itom-servicenow-subscription-unit-overview.pdf), [ITOM licensing docs](https://www.servicenow.com/docs/r/it-operations-management/itom-licensing-count.html).

> **Cross-scope access:** the app reads consumer tables owned by other scopes (`sys_user_has_role`, `cmdb_ci_computer`, `alm_entitlement`, `sn_entitlement_genai_assist_analytics`, …). It ships **read-only Cross-Scope Privileges** for these (see `src/fluent/security/cross-scope.now.ts`). If you point a category at a *new* source table in another scope, add a matching read privilege there, or the platform will block the read (Restricted Caller Access).

> **Add your own** (e.g. AI Agents, or ServiceNow subscription tables once populated): create a category and point it at the relevant table/query — for example a subscription allocation table `user_has_subscription` with `subscription.name=<name>` and Consumer Field `user`. No code change needed.

> **Counts respect security:** consumers are counted **as the signed-in user with ACLs applied**. A viewer without read access to a source table (e.g. `cmdb_ci`) may see a lower count than an admin. Grant viewers read access to the relevant source tables if you need identical numbers for everyone.

### 2. Record licenses purchased

1. Go to **License Utilization → Configuration → License Purchases**.
2. Click **New**:
   - **Category** (required) — pick the SKU.
   - **Licenses Purchased** (required) — the quantity bought.
   - **Purchase Date**, **Contract Period** (e.g. `FY26`), **Notes** — optional.
3. **Save**. You may add multiple purchase records per category; the dashboard sums them.

> Only admins can create/edit/delete categories and purchases (enforced by ACLs). Viewers cannot see or reach these pages.

### 3. Consumption snapshots

- The scheduled job **License Utilization - Monthly Snapshot** runs on the **1st of each
  month (01:00 UTC)** and writes one snapshot per active category, building MoM history.
- To capture a snapshot now (e.g. after first setup): **All → Scheduled Jobs**, open
  *License Utilization - Monthly Snapshot*, click **Execute Now**.
- You can also add/edit consumption rows directly under **Consumption Snapshots**; the
  *Utilization %* is recalculated automatically on save.

### 4. Grant access to end users

Assign `x_1983_licutil.viewer` to users or a group so they can open the dashboard.

---

## End-User Guide

**Role required:** `x_1983_licutil.viewer` (admins also have access).

### Open the dashboard

- Navigator: **License Utilization → Dashboard**, or
- Direct URL: `https://<instance>.service-now.com/x_1983_licutil_dashboard.do`

Top-right actions:
- **Export CSV** — downloads the current view (per-SKU summary, the month-over-month series, and every source/consumer record) as a `.csv` for offline analysis or audit.
- **Email me** — sends a summary of purchased vs. consumed per SKU to the email address on your user record. Requires an email address on your profile and outbound email enabled on the instance.
- **Refresh** — reloads the latest live data at any time.

### Tabs

1. **Overview**
   - KPI tiles: **Licenses Purchased**, **Licenses Consumed** (with MoM % change),
     **Utilization %** (with MoM point change), **Categories / SKUs**.
   - **Consumption vs. Purchased by Month** — grouped bars per month.
   - **Overall Utilization Trend** — utilization line across months.
   - Green ▲ / red ▼ indicators show whether the latest month rose or fell vs. the prior month.

2. **By SKU**
   - One card per configured SKU showing purchased, consumed, utilization, a utilization
     bar (amber ≥75%, red ≥90%), and a consumption sparkline. New SKUs appear here automatically.
   - For Subscription-Unit SKUs (e.g. Discovery) the card also shows the calculation,
     e.g. `120 records ÷ 3 = 40 SU`, so the number is transparent.

3. **MoM Trending**
   - Utilization % per SKU over time (multi-line), plus a consumption detail table by month.

4. **Source Records**
   - For each license, the **actual users/devices/records** consuming it — e.g. the specific
     users holding the `itil` role, or the discovered devices.
   - Each row has an **Open** link to the underlying record (user, CI, entitlement…), and
     **Open full list** opens the full filtered list in ServiceNow — so you can **validate
     every count** against source data. Large sets show the first 100 with a count of the total.

### Reading utilization

- **< 75%** — healthy headroom.
- **75–89%** (amber) — approaching capacity; plan ahead.
- **≥ 90%** (red) — near or over capacity; consider purchasing more or reclaiming licenses.

### Notes

- Numbers reflect the latest data; click **Refresh** after admins update purchases or consumption.
- If you see "No active license categories yet," an admin has not configured categories/purchases.
- Access is role-controlled — if the dashboard or menu is missing, ask an admin for the
  `x_1983_licutil.viewer` role.
