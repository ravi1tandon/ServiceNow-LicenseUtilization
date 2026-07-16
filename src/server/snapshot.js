// License-consumption snapshot job. Delegates to LicenseAnalytics.writeSnapshot(), which
// computes tier-deduped consumed counts (same engine as the dashboard) and upserts this
// period's consumption rows. Runs daily so the snapshot-backed dashboard stays fresh.
(function runSnapshot() {
    new x_1983_licutil.LicenseAnalytics().writeSnapshot();
})();
