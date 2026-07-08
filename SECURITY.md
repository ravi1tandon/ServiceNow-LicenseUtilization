# Security Review — License Utilization Dashboard

**Application:** License Utilization Dashboard
**Scope:** `x_1983_licutil`
**Reviewed:** 2026-07-07
**Reviewer:** Automated build + manual code review (Claude Code / ServiceNow SDK)
**Instance verified against:** `dev270433.service-now.com`
**Result:** ✅ No high or medium severity issues. Low-severity residual items and hardening recommendations listed below.

---

## 1. Scope of review

All source artifacts in this repository were reviewed for execution correctness and security:

| Artifact | File | Type |
|---|---|---|
| 3 tables | `src/fluent/tables/*.now.ts` | `sys_db_object` |
| 2 roles | `src/fluent/security/roles.now.ts` | `sys_user_role` |
| 13 ACLs | `src/fluent/security/acls.now.ts` | `sys_security_acl` |
| Data provider | `src/server/LicenseAnalytics.server.js` | `sys_script_include` (client-callable) |
| Dashboard UI | `src/server/dashboard.html` | `sys_ui_page` (inline JS) |
| Monthly snapshot | `src/server/snapshot.js` | `sysauto_script` |
| Utilization rule | `src/fluent/automation/business-rules.now.ts` | `sys_script` |
| Navigation | `src/fluent/navigation/menu.now.ts` | `sys_app_application` + `sys_app_module` |
| Demo data | `src/fluent/data/seed.now.ts` | `installMethod: 'demo'` records |

**Methodology:** `now-sdk build` static validation (passes clean), manual review of every server/client script, and live verification of deployed ACL/role wiring and business-rule execution on the instance.

---

## 2. Access control model

### Roles
- `x_1983_licutil.admin` — application administrator (scoped admin). Configures purchases, manages categories.
- `x_1983_licutil.viewer` — read-only access to dashboard and license data.

### Table ACLs (explicit; `createAccessControls: false` prevents stray auto-ACLs)

| Table | read | create / write / delete |
|---|---|---|
| `x_1983_licutil_category` | viewer + admin | admin |
| `x_1983_licutil_purchase` (admin config) | viewer + admin | admin |
| `x_1983_licutil_consumption` | viewer + admin | admin |

All ACLs use `decisionType: 'allow'` with `adminOverrides: true` (base-system admins always pass — standard practice).

### Data API ACL
- `x_1983_licutil.LicenseAnalytics` — `type: client_callable_script_include`, `operation: execute`, roles **viewer + admin**, `securityAttribute: user_is_authenticated`.

### Live verification (on instance)
- 13 ACLs deployed, 17 ACL→role links.
- Admin role attached to **all 13** ACLs; viewer role attached to exactly the **4** read/execute rules (3 table reads + data API). Matches design — no privilege leakage.
- Requirement #2 (**admin-only configuration**) is enforced at two layers: the `License Purchases` / `License Categories` navigator modules are gated to `x_1983_licutil.admin`, **and** create/write/delete ACLs on those tables require `admin`. A viewer cannot reach or mutate configuration even via a direct URL.

---

## 3. Findings by category

### 3.1 Injection (SQL / GlideRecord query) — ✅ None
- `LicenseAnalytics.getDashboardData()` takes **no parameters** — there is no user-controlled input in any `addQuery()`. All queries filter on fixed field names and server-derived values only.
- The consumer-source engine (`countConsumers` / `listConsumers`) builds queries from `source_table` + `source_query` stored on **category records**, which are **admin-only** (create/write ACL = admin). End users cannot influence these values, so there is no injection path from untrusted input. Admins already have broad query rights, so this grants no new privilege.
- `snapshot.js` uses only server-side values (category sys_ids, current period). `parseInt(..., 10)` used throughout — no string concatenation into queries.
- No `GlideRecord.addEncodedQuery()` built from user input anywhere.

### 3.2 Cross-site scripting (XSS) — ✅ Mitigated
- The dashboard renders table-sourced text (category name, SKU code, capability, month labels, error text) into `innerHTML`. **Every** dynamic string is passed through `licEsc()`, which escapes `& < > "` before insertion. A malicious category name such as `<img onerror=…>` is neutralized.
- Numeric values are rendered from parsed numbers, not raw strings.
- The GlideAjax payload is `JSON.parse`d (not `eval`) and re-escaped at render time.

### 3.3 Authentication / authorization — ✅ Enforced
- The data API requires `user_is_authenticated` **and** the viewer/admin role. An unauthenticated or unauthorized caller receives no data.
- Consumer counts/lists are read via `GlideRecord`/`GlideAggregate` in a client-callable script include, i.e. **as the signed-in user with source-table ACLs enforced**. This is a *feature* (no privilege escalation — users never see source records they couldn't otherwise read) but means a viewer lacking read access to a source table (e.g. `cmdb_ci`) may see a lower count than an admin. Documented in USER_GUIDE.md; grant read access or run via a service account if uniform counts are required.
- The UI Page itself requires an authenticated session (not a public page). An authenticated user lacking the viewer role who reaches the `.do` sees only an empty shell — the GlideAjax call returns nothing. Defense-in-depth (see residual item 4.1).

### 3.4 Secrets / credentials — ✅ None in source
- No hardcoded credentials, tokens, or sys_ids-of-secrets in any file.
- SDK credentials are stored outside the repo in `.now-sdk/` and are covered by `.gitignore`.

### 3.5 Server script safety — ✅ Safe
- Business rule `Compute Utilization %` (before insert/update) performs pure arithmetic on numeric fields, guards divide-by-zero (`purchased > 0`), and sets a single field. Verified on instance: 95/92.5/84% computed correctly.
- Scheduled job `License Utilization - Monthly Snapshot` runs as system on the 1st of each month, upserts one row per (category, month) so re-runs do not duplicate, and logs a summary. No unbounded loops or deletes.

### 3.6 Web-service / data exposure — ✅ Not over-exposed
- Tables were created without `allowWebServiceAccess`, so the REST Table API is not enabled for anonymous/integration access by default.

---

## 4. Residual items & hardening recommendations (Low)

1. **No explicit `ui_page` ACL.** Page-level access relies on session authentication + role-gated navigation + the data-API ACL (the data is the sensitive asset, and it is locked down). If stricter page-level gating is required, add a `sys_security_acl` of type `ui_page` for `x_1983_licutil_dashboard` restricted to viewer/admin, or attach User Criteria. **Risk: low** — no data leaks without the data-API role.
2. **Cross-scope table read is `public`.** Other application scopes can *read* these tables (writes are not granted cross-scope). If license data must be invisible to other scopes, set `accessibleFrom: 'package_private'` on the tables. **Risk: low** — read-only, same-instance.
3. **`current_consumed` data source.** The app snapshots a `current_consumed` value that an integration or admin populates; it does not itself harvest live usage. Ensure whatever feeds this field is itself authorized. **Risk: informational.**
4. **`adminOverrides: true`** means base-system `admin` always passes. This is intentional and standard; disable per-ACL only if you must hide data from platform admins.

---

## 5. How to re-run this review

```bash
npm run build                 # static validation (must pass with 0 errors)
# Verify ACL/role wiring on the instance:
npx @servicenow/sdk query sys_security_acl_role \
  -q "sys_security_acl.nameSTARTSWITHx_1983_licutil" -o json
```

No high/medium issues were found. The application is safe to install on any instance as a scoped application.
