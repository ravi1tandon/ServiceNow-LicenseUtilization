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
- Demo data (3 Platform Analytics SKUs + 4 months of history) loads by default so the
  dashboard is immediately populated. To install **without** demo data:
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
# Tables, roles, ACLs, UI page, script include, job, business rule
npx @servicenow/sdk query x_1983_licutil_category -q "active=true" -o json
npx @servicenow/sdk query sys_security_acl -q "nameSTARTSWITHx_1983_licutil" -o json
npx @servicenow/sdk query sys_ui_page -q "endpoint=x_1983_licutil_dashboard.do" -o json
```

Expected on a demo install: 3 categories, 3 purchases, 12 consumption rows, 2 roles,
13 ACLs, 1 UI page, 1 client-callable script include, 1 scheduled job, 1 business rule, 5 modules.

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

## 7. Scheduled job

`License Utilization - Monthly Snapshot` (`sysauto_script`) runs on the **1st of each month
at 01:00 UTC**, writing one consumption snapshot per active category. To backfill or test
immediately: open the job record (Scheduled Jobs) and click **Execute Now**.

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
