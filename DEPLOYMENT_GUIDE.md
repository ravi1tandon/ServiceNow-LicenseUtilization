# Deployment Guide — License Utilization & Consumption Dashboard

Scoped application: **`x_1983_licutil`**. This guide covers installing the app on any
ServiceNow instance from source using the ServiceNow SDK (Fluent).

---

## 1. Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js 20+** (LTS) | Includes `npm`. Verify with `node -v`. |
| **ServiceNow SDK** | Installed automatically via `npm install` (declared in `package.json`). |
| **Target instance** | A ServiceNow instance (PDI, dev, or sub-prod). Avoid production for first install. |
| **Install account** | `admin`, or a developer with rights to create scoped apps, tables, ACLs, roles, UI pages, and scheduled jobs. |

> **Company code / scope:** the scope prefix `x_1983_` is derived from the target's
> `glide.appcreator.company.code`. If deploying to a *different* company's instance whose
> code differs, the scope may need regenerating — contact the app owner.

---

## 2. One-time setup

```bash
# From the project root (contains package.json)
npm install
```

Authenticate against the target instance (interactive — password is entered into the SDK's
own hidden prompt and stored in the gitignored `.now-sdk/`):

```bash
npx @servicenow/sdk auth --add https://<instance>.service-now.com --type basic --alias <alias>
npx @servicenow/sdk auth --use <alias>
npx @servicenow/sdk auth --list          # confirm the default alias
```

For enterprise instances use `--type oauth` (browser-based; no password stored).

---

## 3. Build & install

```bash
npm run build     # compile + validate Fluent sources (must end with "Build completed successfully")
npm run deploy    # install to the authenticated instance
```

- **Never deploy a failed build** — a failed build leaves stale artifacts; fix build errors first.
- Demo data (6 real-license categories — ITIL, Platform Analytics, Discovery, Business
  Stakeholder, SAM, Now Assist — with purchases and 2 months of history) loads by default so
  the dashboard is immediately populated. To install **without** demo data:
  ```bash
  npx @servicenow/sdk install --demoData false
  ```
- To force a clean reinstall (uninstall + reinstall — **removes on-instance changes not in source**):
  ```bash
  npx @servicenow/sdk install --reinstall
  ```

---

## 4. Post-install verification

The install output prints the app URL (`sys_app.do?sys_id=...`). Verify artifacts:

```bash
# Tables, roles, ACLs, UI page, script include, job, business rule, cross-scope privileges
npx @servicenow/sdk query x_1983_licutil_category -q "active=true" -o json
npx @servicenow/sdk query sys_security_acl -q "nameSTARTSWITHx_1983_licutil" -o json
npx @servicenow/sdk query sys_ui_page -q "endpoint=x_1983_licutil_dashboard.do" -o json
npx @servicenow/sdk query sys_scope_privilege -q "sys_scope.scope=x_1983_licutil" -o json
```

Expected on a demo install: 6 categories, 6 purchases, consumption snapshot rows, 2 roles,
ACLs, 1 UI page, 1 client-callable script include (`LicenseAnalytics`), **2 scheduled jobs**
(Daily Snapshot + Org & Department Rollup), 1 business rule, 6 modules (incl. **App Settings**),
**8 cross-scope read privileges**, the **`x_1983_licutil_org_rollup`** table, the
**`x_1983_licutil.org.manager_query`** property, 1 event registration, 1 email notification.

Open the dashboard: `https://<instance>.service-now.com/x_1983_licutil_dashboard.do`

---

## 5. Assign roles

In the target instance, assign roles to users/groups (User Administration → Users, or via a group):

| Role | Grants |
|---|---|
| `x_1983_licutil.admin` | Configure purchases & categories; full data access; dashboard. |
| `x_1983_licutil.viewer` | Read-only dashboard and license data. |

Base-system `admin` users pass all ACLs automatically (`adminOverrides`).

---

## 6. Updating

Edit sources → `npm run build` → `npm run deploy`. Record identity is stable across
re-deploys via `src/fluent/generated/keys.ts` (commit this file). For CI/CD, use
`--frozenKeys` to prevent silent key regeneration (see the SDK `ci-integration` topic).

---

## 7. Scheduled job & dashboard performance

`License Utilization - Daily Snapshot` (`sysauto_script`) runs **daily at 01:00 UTC**,
writing/refreshing one consumption snapshot per active category via
`LicenseAnalytics.writeSnapshot()` (tier-deduped counts).

**The dashboard is snapshot-backed for speed.** On load, `getDashboardData` serves the
KPI / By-SKU / trend tiles from the stored snapshots (no live counting), so the page opens
instantly even on large instances. Consequences:

- **After first install (or on any instance), seed one snapshot** so the tiles have data:
  open **Scheduled Jobs → License Utilization – Daily Snapshot → Execute Now** (or click
  **Refresh live** on the dashboard as an admin). Until then the tiles read 0.
- **Refresh live** (dashboard header, **admin-only**) recomputes live from source, persists
  the snapshot, and reloads — for an up-to-the-second view on demand.
- **Source Records** members load **live on demand** when that tab is opened (`getRecordsData`),
  so validation is always current and tier-deduped regardless of snapshot age.
- The header shows "from saved snapshot (date)" so freshness is explicit.

---

## 7a. Cross-scope access & email

- **Cross-scope read privileges** (`src/fluent/security/cross-scope.now.ts`) let the app read
  consumer tables in other scopes (`sys_user`, `sys_user_has_role`, `cmdb_ci_computer`,
  `cmdb_ci_server`, `alm_entitlement`, `sn_entitlement_genai_assist_analytics`). They install
  as **read-only** and status **allowed**. If you configure a category to read a *new* source
  table owned by another scope, add a matching `CrossScopePrivilege({ operation: 'read', ... })`
  and redeploy — otherwise the platform blocks the read (Restricted Caller Access) and that
  category shows 0 (the dashboard keeps working; the failure is caught and logged).
- **Email summary**: the **Email me** button fires the `x_1983_licutil.summary.email` event,
  which the *License Utilization Summary* notification turns into an email built live from the
  analytics script include. Requires outbound email enabled on the instance and an email
  address on the requesting user. Verify: `sysevent_email_action` name *License Utilization Summary*.

## 7b. Org/Department rollup & tier de-duplication

- **Org & Department Rollup** job populates `x_1983_licutil_org_rollup` (per-manager and
  per-department licensed-user counts). Run **Execute Now** once after install to seed it.
- **By Org / Dept** dashboard tab: pick a manager (all direct+indirect reports) or a department;
  counts are tier-deduped; **Download full list (CSV)** exports the deduped members.
- **Manager dropdown is configurable** via property **`x_1983_licutil.org.manager_query`**
  (edit under **License Utilization → App Settings**). Blank = anyone who manages an active user;
  otherwise an encoded query on `sys_user` (e.g. `active=true^title=Vice President`).
- **Tier de-duplication**: categories sharing a `tier_group` count each user once, at the
  highest `precedence` (e.g. ITIL 1000 > Business Stakeholder 10). Requires both categories to
  key on the same identity — set `consumer_ref_field = user`. Leave `tier_group` blank for
  independently counted SKUs (Discovery, SAM).

---

## 8. Uninstall

Uninstall the scoped app from the instance via **System Applications → All Available
Applications → All**, locate *License Utilization Dashboard*, and uninstall. This removes
all app artifacts and data.

---

## Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| `command not found: npx` | Node.js not on PATH. Install Node 20+ and reopen the terminal. |
| Build error: unsupported statement in Fluent file | `.now.ts` files disallow arbitrary TS (type aliases, shorthand props, helper fns). Keep them declarative. |
| Dashboard blank / "Loading…" | Ensure the UI page is `direct: false` (needs the platform client library for GlideAjax). |
| Dashboard shows "No categories" | The data script include failed, or no active categories. Check `syslog` for errors; confirm `global.AbstractAjaxProcessor` is used. |
| Deploy fails: no files in dist | The build failed. Re-run `npm run build` and fix reported errors. |
| Banner: "…was denied. …must declare a Restricted Caller Access privilege." | A category reads a table in another scope with no matching read privilege. Add a `CrossScopePrivilege` for that table/scope (`src/fluent/security/cross-scope.now.ts`) and redeploy. A scope enforcing its own RCA approval may still require an admin to approve the request in that app. |
| A SKU shows 0 consumed but drill-down lists records | Fixed: distinct counts use a grouped aggregate matching the drill-down. If custom, ensure `consumer_ref_field` names a real reference field on the source table. |
| Discovery number looks like raw device count | Discovery uses **Subscription units**. `su_ratio = 1` (official server/VM 1:1) means SU = device count. Set `su_ratio = 3` for PaaS/containers, or per your contract. |
| **Email me** does nothing / no email | Requires outbound email enabled on the instance and an email address on your user record. Check `sys_email` and the *License Utilization Summary* notification. |
