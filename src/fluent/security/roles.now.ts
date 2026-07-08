import { Role } from '@servicenow/sdk/core'

// Administrator: configures purchased licenses, manages categories. Application admin.
export const licAdmin = Role({
    name: 'x_1983_licutil.admin',
    description: 'License Utilization administrator — configure purchased licenses and manage categories.',
    scopedAdmin: true,
})

// Viewer: read-only access to the dashboard and license data.
export const licViewer = Role({
    name: 'x_1983_licutil.viewer',
    description: 'License Utilization viewer — read dashboards and license data.',
})
