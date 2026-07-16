---
title: 'Role-Based Access'
description: 'Govern what users and API keys can do with fine-grained roles and permissions.'
order: 3
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Every action in Arcane is gated by a permission. Permissions are bundled into roles, and roles are assigned to users — globally, or scoped to a single environment.

Upgrading from a pre-2.0 release? Jump to [Upgrade & migration](#upgrade--migration).

## How it works

- **Permissions** look like `<resource>:<action>` (e.g. `containers:start`). You don't pick these one at a time — you assign roles.
- **Roles** are named permission sets. Six built-in, plus your own.
- **Assignments** bind a user to a role, either **Global** (org-wide) or scoped to one environment. A user can hold several — e.g. _Editor on prod, Viewer on staging_.
- **OIDC mappings** turn SSO group claims into assignments on every login.

Permissions are either org-level (settings, users, registries — need a Global assignment) or env-scoped (containers, projects, images — per environment).

## Built-in roles

These six are immutable. Clone one if you need a starting point for a custom role.

| Role                | For                         | Grants                                                                                                                   |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Admin**           | Instance operators          | Everything, everywhere.                                                                                                  |
| **Editor**          | Day-to-day Docker work      | Read+write on all Docker resources, GitOps, webhooks, jobs, notifications, vulnerabilities. Read-only on settings/users. |
| **No-Shell Editor** | Editor without shell access | Same as Editor, minus `containers:exec`.                                                                                 |
| **Deployer**        | CI/CD and on-call           | Deploy projects, run container lifecycle actions, sync GitOps, pull/tag/commit images. No create/delete, no settings.    |
| **Monitor**         | Read-only with logs         | Read resources, view logs, dashboards, events. No mutations, no exec.                                                    |
| **Viewer**          | Auditors                    | Read-only across Docker resources and most org pages. No logs, no actions.                                               |

> [!IMPORTANT]
> At least one user must always hold **Admin** globally. Arcane refuses any change that would leave the instance with zero global admins.

## Custom roles

For narrower job functions — "Database Operator", "Security Reviewer", etc.

1. **Settings → Roles → Create role**.
2. Name it, optionally describe it.
3. Check the permissions to grant. Each resource group has a "select all" checkbox.
4. Save.

Built-in roles are read-only — use **Clone as custom role** to start from one. Deleting a custom role removes every assignment of it (subject to the last-admin guard).

## Assigning roles

Open a user under **Settings → Users**. The **Role assignments** section lists every role they hold and its scope.

- Add a row to grant a role on an environment (or Global).
- Remove a row to revoke it.
- A user with no assignments can sign in but lands on a "no access" screen.

### OIDC users

If a user matches an OIDC mapping, their assignments are managed there and the user editor shows them read-only with a link to **Settings → OIDC Mappings**. Manual assignments on OIDC users (for unmapped groups) still work and survive logins.

## OIDC group mappings

Drive role assignment from your IdP. On every login Arcane reads the user's group claim and re-syncs their OIDC-sourced assignments.

1. Set the **OIDC Groups Claim** under **Settings → Settings** if it's not `groups` (Keycloak: `realm_access.roles`, Azure AD: `memberOf`, etc.).
2. **Settings → OIDC Mappings → Add mapping**:
   - **Claim value** — exact string from the user's groups claim (e.g. `docker-admins`)
   - **Role** — what to grant
   - **Environment scope** — Global or a specific environment
3. Save.

Users in multiple mapped groups get the **union** of their matching assignments. Demote a user in the IdP and they lose their OIDC assignments on next login — manual assignments stay.

See <Link href="/docs/configuration/sso">SSO setup</Link> for the OIDC connection itself.

## API keys

Every API key carries its own permission set, independent of the owning user. Issue narrow keys for CI/CD without granting the owning user the same scope.

1. **Settings → API Keys → Create API key**.
2. Set name, description, optional expiration.
3. Under **Permissions**, check what the key should hold. Environment scope works the same as role assignments.
4. Save and copy the value — it's shown once.

You cannot grant a key more permissions than you have yourself.

## Permission catalog

`<resource>:<action>`. The role editor groups these by resource so you rarely pick them by hand.

### Org-level (Global scope)

| Resource           | Actions                                                      |
| ------------------ | ------------------------------------------------------------ |
| `users`            | `list`, `read`, `create`, `update`, `delete`                 |
| `roles`            | `list`, `read`, `create`, `update`, `delete`, `assign`       |
| `oidc-mappings`    | `manage`                                                     |
| `apikeys`          | `list`, `read`, `create`, `update`, `delete`                 |
| `settings`         | `read`, `write`                                              |
| `environments`     | `list`, `read`, `create`, `update`, `delete`, `pair`, `sync` |
| `registries`       | `list`, `read`, `create`, `update`, `delete`, `test`         |
| `templates`        | `list`, `read`, `create`, `update`, `delete`                 |
| `git-repositories` | `list`, `read`, `create`, `update`, `delete`, `test`, `sync` |
| `events`           | `read`                                                       |
| `customize`        | `manage`                                                     |

### Env-scoped (per environment)

| Resource           | Actions                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `containers`       | `list`, `read`, `logs`, `create`, `start`, `stop`, `restart`, `redeploy`, `kill`, `pause`, `delete`, `exec`, `autoupdate` |
| `projects`         | `list`, `read`, `logs`, `create`, `update`, `deploy`, `down`, `restart`, `delete`, `archive`                              |
| `images`           | `list`, `read`, `pull`, `push`, `build`, `tag`, `commit`, `prune`, `delete`, `upload`                                     |
| `volumes`          | `list`, `read`, `create`, `delete`, `prune`, `browse`, `upload`, `backup`                                                 |
| `networks`         | `list`, `read`, `create`, `delete`, `prune`                                                                               |
| `swarm`            | `read`, `init`, `join`, `leave`, `spec`, `nodes`, `services`, `services:logs`, `stacks`, `configs`, `secrets`, `unlock`   |
| `gitops`           | `list`, `read`, `create`, `update`, `delete`, `sync`, `lifecycle`                                                         |
| `webhooks`         | `list`, `create`, `update`, `delete`                                                                                      |
| `jobs`             | `manage`                                                                                                                  |
| `notifications`    | `manage`                                                                                                                  |
| `dashboard`        | `read`                                                                                                                    |
| `system`           | `read`, `prune`, `upgrade`                                                                                                |
| `image-updates`    | `read`, `check`                                                                                                           |
| `vulnerabilities`  | `read`, `scan`, `manage`                                                                                                  |
| `build-workspaces` | `manage`                                                                                                                  |

`gitops:lifecycle` is seeded only into the built-in Admin role by default. It allows configuring GitOps pre-deploy hooks, which run repo-trusted code in a container before deployment.

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
3. **Set up OIDC mappings** if you use SSO. Configure the **OIDC Groups Claim** and add mappings under **Settings → OIDC Mappings**.
4. **Audit API keys** — the upgrade snapshot is the most permissive safe default. Tighten CI/CD keys to least privilege.

See <Link href="/docs/setup/migrate-v2">Migrate to 2.0</Link> for the full upgrade walkthrough.

## Troubleshooting

**`permission denied: ...`** — look up the permission in the catalog and check whether the caller's role grants it on the right environment. Audit a user from **Settings → Users**.

**User has no access at all.** No assignments. Open them in **Settings → Users** and add at least one (usually `Viewer` on every environment they should see).

**`at least one user must retain a global Admin role assignment`.** You tried to remove the last Global Admin. Add another one first.

**OIDC user lost access on login.** Their group claim no longer matches a mapping. Check the IdP-side membership and the mapping table.

**API key got permission denied after the owner changed roles.** Keys carry their own permissions, not the owner's. Re-issue the key with the desired scope.
