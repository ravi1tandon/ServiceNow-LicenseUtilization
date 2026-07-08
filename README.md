# License Utilization & Consumption Dashboard

A scoped ServiceNow application (`x_1983_licutil`) that tracks month-over-month (MoM)
license **consumption** and **utilization**, with an admin-only configuration area for
recording purchased licenses per category. Built with the ServiceNow SDK (Fluent).

Portable: installs on any instance as a scoped app ("My Company Apps").

## Features

1. **Interactive dashboard** (`x_1983_licutil_dashboard.do`) — KPI tiles, a consumption-vs-purchased
   bar chart, an overall utilization trend line, per-SKU cards, and a MoM utilization multi-line chart.
   All charts are self-contained SVG (no external libraries / CDNs → CSP-safe and portable).
2. **Admin-only configuration** — the *License Purchases* and *License Categories* modules
   (navigator: **License Utilization → Configuration**) are restricted to `x_1983_licutil.admin`
   and enforced by table ACLs. Admins enter the number of licenses purchased per category.
3. **Dynamic widgets** — the dashboard queries the app's own tables at render time via
   `GlideAjax`, so **every configured SKU automatically gets its own card and trend line**.
   Add a new category → a new widget appears on refresh. No dashboard edits required.
4. **MoM history** — a monthly Scheduled Script snapshots purchased/consumed/utilization per
   category into `x_1983_licutil_consumption`, building the time series the trends draw from.
5. **Source Records** — a dashboard tab listing the exact consumption records behind the
   numbers, each linking to the real record, so users can validate the data.

## Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — install, auth, build/deploy, verify, update, uninstall.
- **[USER_GUIDE.md](USER_GUIDE.md)** — administrator and end-user manuals.
- **[SECURITY.md](SECURITY.md)** — security review report.

## Data model

| Table | Purpose |
|---|---|
| `x_1983_licutil_category` | License category / SKU (name, SKU code, capability, current consumed) |
| `x_1983_licutil_purchase` | Admin config: licenses purchased per category |
| `x_1983_licutil_consumption` | Monthly snapshot (category, month, purchased, consumed, utilization %) |

## Security

Roles: `x_1983_licutil.admin` (configure), `x_1983_licutil.viewer` (read). Explicit ACLs on all
tables and the data API. See **[SECURITY.md](SECURITY.md)** for the full review.

## Build & deploy

```bash
npm install
npm run build          # compile + validate Fluent sources
npm run deploy         # install to the authenticated instance (now-sdk auth)
```

Demo data (installMethod `demo`) loads 3 Platform Analytics SKUs and 4 months of history so the
dashboard is populated immediately. Disable with `now-sdk install --demoData false`.

## Requirements

- Node.js 20+ and the `@servicenow/sdk` toolchain
- An authenticated instance (`now-sdk auth --add <url> --type basic`)
- The account installing must be able to create scoped apps, tables, ACLs, roles, UI pages, and scheduled jobs.

## Post-install

Assign `x_1983_licutil.viewer` (or `.admin`) to users. Admins open **License Utilization →
Configuration → License Purchases** to record purchased counts, then open the **Dashboard**.
