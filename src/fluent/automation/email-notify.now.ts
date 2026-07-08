import { EmailNotification, Record } from '@servicenow/sdk/core'

// Custom event fired by LicenseAnalytics.emailSummary() (via gs.eventQueue). Registering it
// makes the event known to the platform and available to the notification below.
Record({
    $id: Now.ID['evt_summary_email'],
    table: 'sysevent_register',
    data: {
        event_name: 'x_1983_licutil.summary.email',
        table: 'sys_user',
        description: 'Fired when a user requests an emailed License Utilization summary from the dashboard.',
    },
})

// The email body is built at send time by an inline mail script that calls the scoped
// analytics script include, so the figures always reflect live data. parm1 = recipient user.
const summaryHtml = [
    '<p>Here is your current <strong>License Utilization &amp; Consumption</strong> summary.</p>',
    '<mail_script>',
    'var a = new x_1983_licutil.LicenseAnalytics();',
    'var d = JSON.parse(a.getDashboardData());',
    'template.print("<p>Generated: " + d.generated + "</p>");',
    'template.print("<p><strong>Total purchased:</strong> " + d.totals.purchased + " &nbsp; <strong>Consumed:</strong> " + d.totals.consumed + " &nbsp; <strong>Utilization:</strong> " + d.totals.utilization + "%</p>");',
    'template.print("<table border=\\"1\\" cellpadding=\\"6\\" cellspacing=\\"0\\" style=\\"border-collapse:collapse\\">");',
    'template.print("<tr><th>SKU</th><th>Capability</th><th>Purchased</th><th>Consumed</th><th>Utilization %</th></tr>");',
    'for (var i = 0; i < d.categories.length; i++) {',
    '  var c = d.categories[i];',
    '  template.print("<tr><td>" + c.name + "</td><td>" + c.capability + "</td><td align=\\"right\\">" + c.purchased + "</td><td align=\\"right\\">" + c.consumed + "</td><td align=\\"right\\">" + c.utilization + "</td></tr>");',
    '}',
    'template.print("</table>");',
    '</mail_script>',
    '<p style="color:#6b6b80;font-size:12px">Open the dashboard for interactive charts and the underlying source records.</p>',
].join('\n')

export const LicenseSummaryNotification = EmailNotification({
    $id: Now.ID['notif_summary_email'],
    table: 'sys_user',
    name: 'License Utilization Summary',
    description: 'On-demand emailed summary of license purchased vs. consumed per SKU.',
    active: true,
    triggerConditions: {
        generationType: 'event',
        eventName: 'x_1983_licutil.summary.email',
    },
    recipientDetails: {
        eventParm1WithRecipient: true,
        sendToCreator: false,
    },
    emailContent: {
        contentType: 'text/html',
        subject: 'License Utilization & Consumption Summary',
        messageHtml: summaryHtml,
    },
})
