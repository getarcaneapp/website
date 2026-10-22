---
title: 'Groups'
description: 'Grant roles to sets of users, manually or from OIDC group claims.'
---

Bind a role to a group once and every member gets it. A group is a named set of users.

- [Role bindings](/docs/access/roles#role-bindings) on a group apply to every member, so you grant access once per team instead of once per user.
- Groups hold no permissions themselves.

## Membership sources

Each membership has a source:

| Source   | Added by                                                                                | Removed by                                                 |
| -------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `manual` | A user with `groups:members`                                                            | A user with `groups:members`                               |
| `oidc`   | An [OIDC group mapping](/docs/access/sso#map-provider-groups-to-arcane-groups) at login | The next login where the claim no longer maps to the group |

- A user can be in the same group through both sources.
- OIDC sync only adds and removes `oidc` memberships and never touches manual ones.

## Manage groups

Manage groups under **Settings → Groups**.

| Where             | What's there                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Group list        | Each group's **Members** and **Role bindings** counts. **Create Group** takes a name and an optional description.                                               |
| **Members**       | Each member's username, display name, **Source** (**Manual** or **OIDC**), and **Member since**. **Add members** picks from users who aren't in the group yet. |
| **Role bindings** | The group's bindings. **Add binding** opens the same form as on a user. See [Role bindings](/docs/access/roles#role-bindings).                                  |
| Page header       | **Edit** and **Delete** for the group.                                                                                                                          |

A user's groups are also listed in their **Edit User** sheet under **Settings → Users**.

### CLI and API

```bash
arcane-cli admin groups create --name platform-team --description "Platform on-call"
```

```bash
arcane-cli admin groups members add <group-id> <user-id> <user-id>
```

```bash
arcane-cli admin bindings create --group <group-id> --role role_editor --environment <env-id>
```

- Other commands: `admin groups list|get|update|delete` and `admin groups members list|remove`.
- The API lives under `/api/groups`.

### Permissions

| Action                       | Permission       |
| ---------------------------- | ---------------- |
| List groups                  | `groups:list`    |
| View a group and its members | `groups:read`    |
| Create a group               | `groups:create`  |
| Rename or edit a description | `groups:update`  |
| Delete a group               | `groups:delete`  |
| Add or remove members        | `groups:members` |

Adding or removing members and deleting a group also require that you could create every binding the group has. See [Delegation](/docs/access/roles#delegation).

## Rules

- Deleting a group deletes its memberships, its bindings, and its OIDC mappings.
- Arcane refuses to delete a group or remove a member if that would leave no admin.
- Group names are unique.
- Migrating from 2.x creates one group per OIDC claim value, named after the claim value.
