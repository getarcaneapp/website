---
title: 'Audit Events'
description: 'See who changed access in Arcane and which requests were denied, right in the Event Log.'
---

Access changes and permission denials appear as ordinary events in the **Event Log** (**Events** in the sidebar). There's no separate audit page.

> [!TIP]
> **In short**
>
> - Audit events sit next to every other event. Search or filter by type, such as `role.update` or `authz.denied`.
> - Only users with `audit:read` see them. Everyone else sees the rest of the log.
> - They can't be deleted. They expire on their own retention schedule.
> - Export them with the rest of the log as CSV or NDJSON.

## What is recorded

The event **type** is the action, and the **severity** shows the outcome.

| Area                  | Types                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Roles                 | `role.create`, `role.update`, `role.delete`                                                       |
| Bindings              | `binding.create`, `binding.delete`                                                                |
| OIDC                  | `oidc_mapping.create`, `oidc_mapping.update`, `oidc_mapping.delete`                               |
| API keys              | `apikey.create`, `apikey.update`, `apikey.delete`                                                 |
| Users                 | `user.create`, `user.update`, `user.delete`, `user.disable`, `user.enable`, `user.password_reset` |
| Federated credentials | `federated.create`, `federated.update`, `federated.delete`                                        |
| Settings              | `settings.update` for `defaultUserRoleId`, `auditRetentionDays`, and `auditDenialsEnabled`        |
| Denials               | `authz.denied`                                                                                    |

| Outcome   | Severity  |
| --------- | --------- |
| `success` | `info`    |
| `denied`  | `warning` |
| `error`   | `error`   |

Each event also has the user, target resource, environment, and metadata:

- `outcome` and `actorType` (`user`, `apikey`, `agent`, `system`, or `oidc`)
- `permission` and `apiKeyId`, when relevant
- `request`: method, path, remote address, and user agent
- `before` and `after` values

## Permission denials

Arcane records `authz.denied` when a request gets `403` because the caller lacks a permission, an environment, or the Admin role for an action.

- `404` responses for out-of-scope resources aren't recorded.
- Repeats of the same actor, permission, environment, method, and path within one minute are recorded once.
- Denials are written in the background. If the queue fills, Arcane drops them and logs a warning. Access changes are always recorded.

Turn denial recording off with **Record permission denials** (`auditDenialsEnabled`, default `true`) under **System → Authentication → Access control**.

## Retention

Audit events skip normal event cleanup and can't be deleted by hand. Set **Audit retention days** (`auditRetentionDays`, default `365`; `0` keeps them forever) under **System → Authentication → Access control**. The `audit-retention` job deletes older audit events every day at 03:30 in the server's [timezone](/docs/reference/environment-variables#timezone-and-scheduled-jobs).

| Setting                       | Environment variable           |
| ----------------------------- | ------------------------------ |
| **Audit retention days**      | `ARCANE_AUDIT_RETENTION_DAYS`  |
| **Record permission denials** | `ARCANE_AUDIT_DENIALS_ENABLED` |

Setting either variable locks the setting in the UI. See [Settings overrides](/docs/reference/environment-variables#settings-overrides).

## Read and export

| Action                 | Permission                  | API                                          |
| ---------------------- | --------------------------- | -------------------------------------------- |
| List events            | `events:read`               | `GET /api/events`                            |
| Export as CSV / NDJSON | `events:read`               | `GET /api/events/export?format=csv\|ndjson`  |
| Include audit events   | `audit:read`, held globally | Same endpoints. Without it they're left out. |

- **Export CSV** and **Export NDJSON** on the Events page download every event matching the current search and filters, oldest first.
- The API accepts `search`, `severity`, `type`, and `environmentId`. `type` takes comma-separated types or categories.

```bash
arcane-cli admin events list --type authz.denied
```

```bash
arcane-cli admin events export --type role,binding --format ndjson -o access.ndjson
```
