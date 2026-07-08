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
| **Consumed** | How many are actually in use. Held on the category as *Current Consumed*, snapshotted monthly. |
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
   - **SKU Code** — your catalog code, e.g. `PA-STD`.
   - **Capability** — choose the grouping (e.g. *Platform Analytics*).
   - **Current Consumed** — the live count of licenses in use (feed from an integration or update manually).
   - **Active** — leave checked to include it on the dashboard.
3. **Save**. A new category automatically gets its own card and trend line on the dashboard — no dashboard edits needed.

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

Use **Refresh** (top right) to reload the latest data at any time.

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

3. **MoM Trending**
   - Utilization % per SKU over time (multi-line), plus a consumption detail table by month.

4. **Source Records**
   - The exact consumption snapshot records the charts are computed from.
   - Each row has an **Open** link to the underlying record, and **Open full list** opens
     the complete list — so you can **validate every number** against source data.

### Reading utilization

- **< 75%** — healthy headroom.
- **75–89%** (amber) — approaching capacity; plan ahead.
- **≥ 90%** (red) — near or over capacity; consider purchasing more or reclaiming licenses.

### Notes

- Numbers reflect the latest data; click **Refresh** after admins update purchases or consumption.
- If you see "No active license categories yet," an admin has not configured categories/purchases.
- Access is role-controlled — if the dashboard or menu is missing, ask an admin for the
  `x_1983_licutil.viewer` role.
