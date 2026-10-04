---
title: 'Roles & Permissions'
description: 'Set what users and API keys can do in each environment.'
---

Roles control what each user and API key can do in Arcane. You give a user a role either globally or in one environment, and Arcane checks the role's permissions on every action.

## Assign roles to a user

1. Open the user under **Settings → Users**. The **Role assignments** section lists every role they hold and its scope.
2. Add a row to grant a role on an environment or Global. Remove a row to revoke it.
3. Save.

A user with no assignments can sign in but lands on a "no access" screen. Give them at least one assignment, usually `Viewer` on each environment they should see.

> [!IMPORTANT]
> At least one user must always hold **Admin** globally. Arcane rejects any change that would remove the last global Admin assignment with `At least one user must retain a global Admin role assignment`. Add another Global Admin first.

If nobody can sign in as an admin, see [Account Recovery](/docs/access/account-recovery).

The username `arcane` only matters during initial setup or recovery when no global admin exists. Renaming a user to `arcane` doesn't grant access.

## Create a custom role

1. Go to **Settings → Roles → Create role**.
2. Name it and optionally describe it.
3. Check the permissions to grant. Each resource group has a "select all" checkbox.
4. Save.

Built-in roles are read-only. Use **Clone as custom role** to start from one. Deleting a custom role removes every assignment of it, except where that would remove the last global Admin.

## OIDC group mappings

Arcane can assign roles from your identity provider. On every login it reads the user's group claim and re-syncs their OIDC-sourced assignments.

1. Make sure the scopes include the group claim, for example `openid email profile groups`.
2. Under **Settings → Authentication**, set the **OIDC Groups Claim** if it isn't `groups` (Keycloak: `realm_access.roles`, Azure AD: `memberOf`).
3. On the same page, in the **OIDC Role Mappings** table, select **Add mapping** and fill in:
   - **Claim value**: the exact string from the user's groups claim, such as `docker-admins`
   - **Role**: the role to grant
   - **Environment scope**: Global or a specific environment
4. Save.

Users in several mapped groups get the union of their matching assignments. Remove a user from a group in the provider and they lose those assignments on their next login. Manual assignments stay, and the user editor shows OIDC-managed assignments as read-only with a link to **Settings → Authentication**. If an OIDC user loses access on login, check their group membership in the provider and look for a mapping whose claim value no longer matches.

To manage mappings as code, set `OIDC_ROLE_MAPPINGS` to a JSON array:

```json
[
	{ "claimValue": "arcane-admins", "roleId": "role_admin" },
	{ "claimValue": "arcane-devops", "roleId": "role_editor", "environmentId": "env-prod" }
]
```

Leave out `environmentId` for a global assignment. Arcane reconciles these mappings on every startup and shows them read-only in the UI. Change them by editing the variable, or set it to `[]` to remove them. `OIDC_ROLE_MAPPINGS_FILE` works for Docker secrets.

See [OIDC Single Sign-On](/docs/access/sso) to connect the provider itself.

## Scope API keys

Every API key carries its own permissions, separate from the user who owns it. This lets you issue a narrow key for CI/CD without widening anyone's role.

1. Go to **Settings → API Keys → Create API key**.
2. Set a name, description, and optional expiration.
3. Under **Permissions**, check what the key should hold. Environment scope works the same as for role assignments.
4. Save and copy the value. It's shown once.

You can't grant a key more permissions than you have. Changing the owner's roles doesn't change a key's permissions, so if a key gets `permission denied`, issue a new one with the scope it needs.

## How roles work

- **Permissions** allow specific actions, such as `containers:start`.
- **Roles** group permissions. Use a built-in role or create your own.
- **Assignments** give a user a role globally or in one environment. Users can have several.
- **OIDC mappings** turn SSO group claims into assignments on every login.

Org-level permissions, such as settings, users, and registries, need a Global assignment. Env-scoped permissions, such as containers, projects, and images, apply per environment.

For a `permission denied: ...` error, look up the permission in the [permission catalog](#permission-catalog) and check that the caller's role grants it on the right environment.

Upgrading from a release before 2.0? Arcane converts existing users and API keys to roles on first start. See [Migrate to 2.0](/docs/get-started/migrate-v2) for what changes and what to check afterwards.

> [!CAUTION]
> If the migration leaves zero global admins, Arcane logs `RBAC global admin guard failed` and keeps running. Restore from backup and investigate.

## Built-in roles

| Role                | For                         | Grants                                                                                                                   |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Admin**           | Instance operators          | Everything, everywhere.                                                                                                  |
| **Editor**          | Day-to-day Docker work      | Read+write on all Docker resources, GitOps, webhooks, jobs, notifications, vulnerabilities. Read-only on settings/users. |
| **No-Shell Editor** | Editor without shell access | Same as Editor, minus `containers:exec`.                                                                                 |
| **Deployer**        | CI/CD and on-call           | Deploy projects, run container lifecycle actions, sync GitOps, pull/tag/commit images. No create/delete, no settings.    |
| **Monitor**         | Read-only with logs         | Read resources, view logs, dashboards, events. No mutations, no exec.                                                    |
| **Viewer**          | Auditors                    | Read-only across Docker resources and most org pages. No logs, no actions.                                               |

## Permission catalog

### Org-level permissions (Global scope)

| Resource           | Actions                                                      |
| ------------------ | ------------------------------------------------------------ |
| `users`            | `list`, `read`, `create`, `update`, `delete`                 |
| `roles`            | `list`, `read`, `create`, `update`, `delete`, `assign`       |
| `apikeys`          | `list`, `read`, `create`, `update`, `delete`                 |
| `federated`        | `list`, `read`, `create`, `update`, `delete`                 |
| `settings`         | `read`, `write`                                              |
| `environments`     | `list`, `read`, `create`, `update`, `delete`, `pair`, `sync` |
| `registries`       | `list`, `read`, `create`, `update`, `delete`, `test`         |
| `templates`        | `list`, `read`, `create`, `update`, `delete`                 |
| `variables`        | `read`, `create`, `update`, `delete`, `sync`                 |
| `git-repositories` | `list`, `read`, `create`, `update`, `delete`, `test`, `sync` |
| `s3-destinations`  | `list`, `read`, `create`, `update`, `delete`, `test`, `sync` |
| `system-backups`   | `read`, `manage`, `restore`, `recovery-key`                  |
| `events`           | `read`, `delete`                                             |
| `notifications`    | `manage`                                                     |
| `customize`        | `manage`                                                     |
| `diagnostics`      | `read`                                                       |

### Env-scoped permissions (per environment)

| Resource           | Actions                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `containers`       | `list`, `read`, `logs`, `create`, `start`, `stop`, `restart`, `redeploy`, `kill`, `pause`, `delete`, `exec`, `autoupdate` |
| `projects`         | `list`, `read`, `logs`, `create`, `update`, `deploy`, `down`, `restart`, `delete`, `archive`                              |
| `images`           | `list`, `read`, `pull`, `push`, `build`, `tag`, `commit`, `prune`, `delete`, `upload`                                     |
| `volumes`          | `list`, `read`, `create`, `delete`, `prune`, `upload`, `backup`                                                           |
| `networks`         | `list`, `read`, `create`, `delete`, `prune`                                                                               |
| `swarm`            | `read`, `init`, `join`, `leave`, `spec`, `nodes`, `services`, `services:logs`, `stacks`, `configs`, `secrets`, `unlock`   |
| `gitops`           | `list`, `read`, `create`, `update`, `delete`, `sync`, `lifecycle`                                                         |
| `webhooks`         | `list`, `create`, `update`, `delete`                                                                                      |
| `jobs`             | `manage`                                                                                                                  |
| `dashboard`        | `read`                                                                                                                    |
| `system`           | `read`, `prune`, `upgrade`                                                                                                |
| `image-updates`    | `read`, `check`                                                                                                           |
| `vulnerabilities`  | `read`, `scan`, `manage`                                                                                                  |
| `build-workspaces` | `manage`                                                                                                                  |

> [!NOTE]
> `notifications:manage` is global. Granting it on a single environment doesn't open **Settings → Notifications**.

- All `system-backups` routes also require a global admin, whatever permissions are granted.
- `gitops:lifecycle` is only in the built-in Admin role by default. It allows configuring GitOps pre-deploy hooks, which run code from the repository in a container before deployment.
- `volumes:browse` grants from older releases become `volumes:read`. For [Volume Workspace](/docs/docker/volumes#volume-workspace) writes, `volumes:upload` allows creating and editing files, `volumes:delete` allows deletion, both allow moves and renames, and `volumes:backup` allows file restores.
