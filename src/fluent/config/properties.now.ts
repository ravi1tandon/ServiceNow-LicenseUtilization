import { Property } from '@servicenow/sdk/core'

// Configurable selector for the "By Org / Dept" manager dropdown. Holds an encoded query
// on sys_user; empty = default behavior (users who manage at least one active user).
// Examples: "active=true^title=Vice President"  ·  "active=true^u_org_head=true"
//           "sys_idIN<id1>,<id2>"  ·  "active=true^roles.name=admin"
Property({
    $id: Now.ID['prop_manager_query'],
    name: 'x_1983_licutil.org.manager_query',
    type: 'string',
    value: '',
    description:
        'Encoded query on sys_user selecting who appears in the By Org / Dept manager (VP / department head) dropdown. Leave blank to default to anyone who manages at least one active user.',
    roles: {
        write: ['x_1983_licutil.admin'],
    },
})
