---
title: 'Audit Log'
description: 'Review and export access-control changes and permission denials.'
---

Read the audit log under **Settings → Audit Log**. It records who changed access in Arcane and which requests were denied.

Changes are written in the same database transaction as the change itself, so a change that rolls back leaves no entry.

## What is recorded

| Area                  | Actions                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Roles                 | `role.create`, `role.update`, `role.delete`                                                       |
| Bindings              | `binding.create`, `binding.delete`                                                                |
| Groups                | `group.create`, `group.update`, `group.delete`, `group.member.add`, `group.member.remove`         |
| OIDC                  | `oidc_mapping.create`, `oidc_mapping.update`, `oidc_mapping.delete`, `group.oidc_sync.admin_kept` |
| API keys              | `apikey.create`, `apikey.update`, `apikey.delete`                                                 |
| Users                 | `user.create`, `user.update`, `user.delete`, `user.disable`, `user.enable`, `user.password_reset` |
| Federated credentials | `federated.create`, `federated.update`, `federated.delete`                                        |
| Settings              | `settings.update` for `defaultUserRoleId`, `auditRetentionDays`, and `auditDenialsEnabled`        |
| Denials               | `authz.denied`                                                                                    |

`group.oidc_sync.admin_kept` means an OIDC login would have removed the last admin's group membership and Arcane kept it. See [What happens at login](/docs/access/sso#what-happens-at-login).

Each entry has:

- time and outcome (`success`, `denied`, or `error`)
- actor type (`user`, `apikey`, `agent`, `system`, or `oidc`), user ID, username, and API key ID
- target type, ID, and name
- environment and permission, when relevant
- request method, path, remote address, and user agent
- before and after values and extra metadata, such as the permissions a scoped binding dropped

## Permission denials

Arcane records an `authz.denied` entry when a request gets `403` because the caller lacks one of:

- a permission
- an environment
- the Admin role
- the [resource scope](/docs/access/resource-scopes) for an action

Rules:

- `404` responses for out-of-scope resources aren't recorded.
- Denials are written in the background.
- Repeats of the same actor, permission, environment, method, and path within one minute are recorded once.
- If the queue fills up, Arcane drops denial entries and logs a warning.
- Access changes are always recorded.

Turn denial recording off with **Record permission denials** (`auditDenialsEnabled`, default `true`) under **Settings → Authentication → Access control**.

## Retention

Set **Audit retention days** (`auditRetentionDays`) under **Settings → Authentication → Access control** to choose how many days entries are kept.

- The default is `365`. Set `0` to keep entries forever.
- The `audit-retention` job deletes older entries every day at 03:30 in the server's [timezone](/docs/reference/environment-variables#timezone-and-scheduled-jobs).

| Setting                       | Environment variable           |
| ----------------------------- | ------------------------------ |
| **Audit retention days**      | `ARCANE_AUDIT_RETENTION_DAYS`  |
| **Record permission denials** | `ARCANE_AUDIT_DENIALS_ENABLED` |

Setting either variable locks the setting in the UI. See [Settings overrides](/docs/reference/environment-variables#settings-overrides).

## Read and export

| Action                  | Permission     | API                                               |
| ----------------------- | -------------- | ------------------------------------------------- |
| List and view entries   | `audit:read`   | `GET /api/audit/logs`, `GET /api/audit/logs/{id}` |
| Export as CSV or NDJSON | `audit:export` | `GET /api/audit/logs/export?format=csv\|ndjson`   |

In **Settings → Audit Log**:

- Each row shows the **Action** with the checked permission below it, the **Outcome**, **Actor**, **Target**, **Environment**, and **Time**.
- Expand a row for the request, remote address, user agent, API key, and the **Before**, **After**, and **Details** values.
- Filter by outcome with the **All outcomes** menu.
- **Export CSV** and **Export NDJSON** download every entry that matches the current filter.

### Filters

| API query       | CLI flag        |
| --------------- | --------------- |
| `actorUserId`   | `--actor`       |
| `action`        | `--action`      |
| `outcome`       | `--outcome`     |
| `targetType`    | `--target-type` |
| `environmentId` | `--environment` |
| `from`          | `--since`       |
| `to`            | `--until`       |

- List and export accept the same filters.
- API `from` and `to` take RFC 3339 times.
- CLI `--since` and `--until` take an RFC 3339 time or a duration back from now, such as `24h`.
- The export streams every matching entry, oldest first.

```bash
arcane-cli admin audit list --action authz.denied --since 24h
```

```bash
arcane-cli admin audit export --format ndjson --since 720h -o audit.ndjson
```
