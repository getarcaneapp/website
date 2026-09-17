---
title: 'Role-Based Access'
description: 'Set what users and API keys can do in each environment.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Upgrading from a pre-2.0 release? Jump to [Upgrade & migration](#upgrade--migration).

## How it works

- **Permissions** allow specific actions, such as `containers:start`.
- **Roles** group permissions. Use a built-in role or create your own.
- **Assignments** give a user a role globally or in one environment. Users can have several.
- **OIDC mappings** turn SSO group claims into assignments on every login.

Org-level permissions, such as settings, users, and registries, need a Global assignment. Env-scoped permissions, such as containers, projects, and images, apply per environment.

## Built-in roles

| Role                | For                         | Grants                                                                                                                   |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Admin**           | Instance operators          | Everything, everywhere.                                                                                                  |
| **Editor**          | Day-to-day Docker work      | Read+write on all Docker resources, GitOps, webhooks, jobs, notifications, vulnerabilities. Read-only on settings/users. |
| **No-Shell Editor** | Editor without shell access | Same as Editor, minus `containers:exec`.                                                                                 |
| **Deployer**        | CI/CD and on-call           | Deploy projects, run container lifecycle actions, sync GitOps, pull/tag/commit images. No create/delete, no settings.    |
| **Monitor**         | Read-only with logs         | Read resources, view logs, dashboards, events. No mutations, no exec.                                                    |
| **Viewer**          | Auditors                    | Read-only across Docker resources and most org pages. No logs, no actions.                                               |

> [!IMPORTANT]
> At least one user must always hold **Admin** globally. Arcane refuses any change that would leave the instance with zero global admins. If you see `at least one user must retain a global Admin role assignment`, add another Global Admin before removing the current one.

If nobody can sign in as an admin, see <Link href="/docs/security/account-recovery">Account Recovery</Link>.

## Assigning roles

Open a user under **Settings → Users**. The **Role assignments** section lists every role they hold and its scope.

- Add a row to grant a role on an environment (or Global).
- Remove a row to revoke it.
- A user with no assignments can sign in but lands on a "no access" screen. Add at least one assignment, usually `Viewer` on each environment they should see.

<span id="troubleshooting"></span>

For `permission denied: ...`, look up the permission in the <Link href="/docs/authentication/rbac#permission-catalog">permission catalog</Link> and check whether the caller's role grants it on the right environment. Audit a user from **Settings → Users**.

The username `arcane` only matters during initial setup or recovery when no global admin exists. Renaming a user to `arcane` doesn't grant access. Assign the role under **Settings → Users**.

### OIDC users

If a user matches an OIDC mapping, their assignments are managed there and the user editor shows them read-only with a link to **Settings → Authentication**. Manual assignments on OIDC users (for unmapped groups) still work and survive logins.

## Custom roles

1. **Settings → Roles → Create role**.
2. Name it, optionally describe it.
3. Check the permissions to grant. Each resource group has a "select all" checkbox.
4. Save.

Built-in roles are read-only — use **Clone as custom role** to start from one. Deleting a custom role removes every assignment of it (subject to the last-admin guard).

## OIDC group mappings

Drive role assignment from your IdP. On every login Arcane reads the user's group claim and re-syncs their OIDC-sourced assignments.

1. Set the **OIDC Groups Claim** under **Settings → Authentication** if it's not `groups` (Keycloak: `realm_access.roles`, Azure AD: `memberOf`, etc.).
2. On the same page, in the **OIDC Role Mappings** table, **Add mapping**:
   - **Claim value** — exact string from the user's groups claim (e.g. `docker-admins`)
   - **Role** — what to grant
   - **Environment scope** — Global or a specific environment
3. Save.

Users in multiple mapped groups get the **union** of their matching assignments. Demote a user in the IdP and they lose their OIDC assignments on next login — manual assignments stay. If an OIDC user loses access on login, check their IdP-side group membership and the mapping table for a claim that no longer matches.

See <Link href="/docs/authentication/sso">SSO setup</Link> for the OIDC connection itself.

## API keys

Every API key carries its own permission set, independent of the owning user. Issue narrow keys for CI/CD without granting the owning user the same scope.

1. **Settings → API Keys → Create API key**.
2. Set name, description, optional expiration.
3. Under **Permissions**, check what the key should hold. Environment scope works the same as role assignments.
4. Save and copy the value — it's shown once.

You cannot grant a key more permissions than you have yourself.

Changing the owner's roles does not update a key's permissions. If a key gets permission denied, re-issue it with the desired scope.

`ADMIN_STATIC_API_KEY` reconciliation is skipped when the `arcane` account is not actually a global admin. The logs say _"User is not a global admin, skipping default admin API key reconciliation."_

## Upgrade & migration

The migration runs automatically on first start of the new server:

- Users with the legacy `admin` role → **Global Admin**.
- Everyone else → **Global Viewer** (read-only, no logs).
- Existing API keys → snapshot of their owner's effective permissions.

> [!CAUTION]
> If the migration would leave zero global admins, Arcane refuses to start. Restore from backup and investigate.

After upgrading:

1. **Check your admins** in **Settings → Users**.
2. **Promote non-admins** off Viewer to Editor / No-Shell Editor / Deployer / Monitor on the environments they use.
3. **Set up OIDC mappings** if you use SSO. Configure the **OIDC Groups Claim** and add mappings under **Settings → Authentication**.
4. **Audit API keys** and remove permissions your automation doesn't need.

See <Link href="/docs/upgrade/migrate-v2">Migrate to 2.0</Link> for the full upgrade walkthrough.

## Permission catalog

### Org-level (Global scope)

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

### Env-scoped (per environment)

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
> `notifications:manage` is a **global** permission. Granting it scoped to a single environment does not open **Settings → Notifications** — the assignment has to be Global.

All `system-backups` routes additionally require the user to be a global admin, regardless of granted permissions.

`gitops:lifecycle` is seeded only into the built-in Admin role by default. It allows configuring GitOps pre-deploy hooks, which run repo-trusted code in a container before deployment.

Existing `volumes:browse` grants migrate to `volumes:read`. For <Link href="/docs/features/volumes#volume-workspace">Volume Workspace</Link> writes, `volumes:upload` allows creating and editing files, `volumes:delete` allows deletion, both allow moves and renames, and `volumes:backup` allows file restores.
