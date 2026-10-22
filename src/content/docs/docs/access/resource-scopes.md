---
title: 'Resource Scopes'
description: 'Limit a role binding to specific containers, projects, images, volumes, networks, and Swarm services.'
---

Add a resource scope (selector) to a [role binding](/docs/access/roles#role-bindings) so it only applies to matching resources.

For example, a Deployer binding scoped to the `shop` project lets a user start and stop that project's containers and nothing else in the environment:

```bash
arcane-cli admin bindings create --user <user-id> --role role_deployer --environment <env-id> --project shop
```

## Set a scope in the UI

Turn on **Limit to matching resources** after picking a role. You add bindings in the **Role bindings** section of a user's **Edit User** sheet (**Settings → Users**) or a group's page (**Settings → Groups**).

- The form shows each field that at least one of the role's permissions accepts. If none do, it shows `Resource selectors cannot limit any permission in this role.`
- When an environment is selected, **Compose projects** suggests the projects in that environment.
- Before you save, the **Some permissions are not granted** warning lists the role's permissions that accept no scope at all.
- After you save, the same warning lists every permission the binding dropped, including ones dropped because of the fields you chose. See [Which permissions accept a scope](#which-permissions-accept-a-scope).
- The **Resources** column of the bindings table shows each binding's selector, or **All resources** for an unscoped binding.

## Selector fields

| Field       | UI field                 | CLI flag                         | Matches when                                                 |
| ----------- | ------------------------ | -------------------------------- | ------------------------------------------------------------ |
| `labels`    | **Labels**               | `--label KEY=VALUE` (repeatable) | The resource has every listed label with exactly that value. |
| `projects`  | **Compose projects**     | `--project NAME` (repeatable)    | The resource belongs to any listed Compose project.          |
| `ownerOnly` | **Owned resources only** | `--owner-only`                   | The resource's owner is the user making the request.         |
| `names`     | **Name patterns**        | `--name GLOB` (repeatable)       | Any resource name matches any listed glob.                   |

Matching rules:

- Set at least one field. All fields you set must match.
- When several bindings grant the same permission, a resource only needs to match one of them.
- A binding with no selector grants the permission on every resource and always wins.
- A resource that lacks the attribute a field checks never matches. A container with no Compose project label doesn't match a `projects` selector, and a resource with no owner doesn't match `ownerOnly`.

Name globs use Go `path.Match` syntax:

| Pattern | Matches                          |
| ------- | -------------------------------- |
| `*`     | Any run of characters except `/` |
| `?`     | One character                    |
| `[abc]` | A character class                |

`ghcr.io/acme/*` matches `ghcr.io/acme/api:1.4` but not `ghcr.io/acme/team/api:1.4`.

## What each field reads

| Resource       | Names                        | Labels              | Project                      | Owner                                 |
| -------------- | ---------------------------- | ------------------- | ---------------------------- | ------------------------------------- |
| Containers     | Container names, without `/` | Container labels    | `com.docker.compose.project` | `com.getarcaneapp.arcane.owner` label |
| Volumes        | Volume name                  | Volume labels       | `com.docker.compose.project` | `com.getarcaneapp.arcane.owner` label |
| Networks       | Network name                 | Network labels      | `com.docker.compose.project` | `com.getarcaneapp.arcane.owner` label |
| Images         | Repository tags              | Image labels        | Not supported                | Not supported                         |
| Projects       | Project name                 | Not supported       | Project name                 | The user who created the project      |
| Swarm services | Service name                 | Service spec labels | `com.docker.stack.namespace` | Not supported                         |

## Which permissions accept a scope

| Permissions                                             | Accepted fields                    |
| ------------------------------------------------------- | ---------------------------------- |
| `containers:*`                                          | labels, projects, ownerOnly, names |
| `volumes:*` and `networks:*`, except `prune`            | labels, projects, ownerOnly, names |
| `projects:*`                                            | projects, ownerOnly, names         |
| `images:*`, except `prune`                              | labels, names                      |
| `swarm:services`, `swarm:services:logs`, `swarm:stacks` | labels, projects, names            |
| Everything else                                         | None                               |

A scoped binding grants a permission only when the permission accepts every field the selector uses. It drops the rest of the role's permissions.

- The create response lists dropped permissions in `droppedPermissions`, and `arcane-cli admin bindings create` prints them.
- Org-level permissions, prune actions, `dashboard:read`, `events:read`, `image-updates:*`, `vulnerabilities:*`, `gitops:*`, `podman:*`, and `swarm:read` are always dropped. Grant them with a separate unscoped binding if the user needs them.
- A `labels` selector drops every `projects:*` permission, because projects have no labels.
- An `ownerOnly` selector drops every `images:*` permission.
- The environment still appears in the user's environment list when they hold only scoped permissions there.

## Ownership

Arcane sets the `com.getarcaneapp.arcane.owner` label to the creating user's ID.

- It applies to containers, volumes, and networks created through Arcane.
- Any owner label in the request is replaced.
- Redeploying or editing a container keeps its owner.
- A project records the user who created it. When the project is deployed, every service gets that user as its owner label, replacing any owner label in the Compose file.

These have no owner, so `ownerOnly` never matches them:

- projects that Arcane discovers on disk or that a GitOps sync creates, and their services
- resources created before 3.0 or outside Arcane

## Responses for out-of-scope resources

| Situation                                                               | Result                                                          |
| ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| Listing                                                                 | Out-of-scope items are left out of results, counts, and totals. |
| Acting on a resource outside both the action's scope and the read scope | `404 Not Found`                                                 |
| Acting on a resource you can read but whose action scope doesn't match  | `403 Forbidden`                                                 |
| Creating a resource that wouldn't match your create scope               | `403 Forbidden`                                                 |

- The `404` keeps scoped users from probing for resources they can't see.
- A label-scoped user creating a container must set the scoped labels on it.
- Owner-only creates always match, because Arcane stamps the owner.
- Streamed project actions, such as a deploy with progress output, report a scope error inside the stream instead of as an HTTP status.
- `403` denials are written to the [audit log](/docs/access/audit-log). `404` responses are not.

## Remote environments

Agents apply the same scope rules as the manager. Agents must run 3.0 alongside the manager.

- For requests to an agent, the manager sends the caller's permissions for that environment in the `X-Arcane-Authz` header.
- The manager removes any `X-Arcane-Authz` header a client sends.
- The header is compressed above 4 KiB.
- If a user's scoped grants for one environment still exceed 16 KiB, the manager rejects the request with `431` and `Forwarded permissions are too large for this environment`.
- To fix a `431`, reduce that user's number of scoped bindings in the environment.
