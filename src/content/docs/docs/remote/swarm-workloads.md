---
title: 'Swarm Workloads'
description: 'Deploy and manage Docker Swarm stacks, services, and tasks.'
---

Workloads are what runs on a Swarm: stacks, the services inside them, and the tasks (containers) Swarm schedules for each service.

| Page         | Use it for                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------- |
| **Stacks**   | Normal app deployment from a Compose file, with the stack's services managed together. Recommended. |
| **Services** | Direct control over a single Swarm service, including raw spec updates.                             |
| **Tasks**    | Seeing where each task runs and its state, mostly for troubleshooting.                              |

## Stacks

A stack deploys related services together from a Compose file.

### Deploy a stack

1. Open **Swarm → Stacks**.
2. Click **Create Stack**.
3. Enter a stack name.
4. Paste your Compose content.
5. Optional: add `.env` content for variables referenced by the Compose file.
6. Click **Create Stack**.

Useful shortcuts in the stack editor:

- **Use Template** — load a saved Arcane template. See [Templates](/docs/docker/templates).
- **Convert from Docker Run** — paste a `docker run` and let Arcane generate Compose and env content as a starting point. For standalone prep, use the [Compose Generator](/generator).
- **Save as Template** — save the editor content as a reusable template.
- **Override file** — add a `compose.override.yaml` alongside the main Compose file. Arcane merges the two at deploy time, the same way the Docker CLI does.

Deploy options:

- **Prune removed services** — remove services that are no longer in the Compose file. Off by default, so a deploy never deletes a service you didn't explicitly drop.
- **Send registry authentication** — forward your stored registry credentials to the Swarm managers so they can pull private images.
- **Resolve images** — whether the manager looks up each image tag in the registry and pins the service to its digest (the content hash of one exact image build), so every node runs the same image. **Always** (default) resolves on every deploy, **When changed** only for images whose reference changed, and **Never** skips the lookup.

> [!NOTE]
> Arcane prefixes declared resource names with the stack name. Config and secret names also depend on their content, so changes create new objects without modifying Docker's immutable originals.

### Update or remove a stack

Open the stack from **Swarm → Stacks**, click **Edit**, change the Compose or `.env`, and redeploy. To remove, use the stack detail page or row action and confirm.

### View a stack's saved source

**View Source** shows the Compose and `.env` files Arcane saved during deployment. The default source directory is:

```bash
/app/data/swarm/sources
```

Files are organized by environment ID and stack name. For example, environment `env_123` and stack `whoami`:

```text
/app/data/swarm/sources/env_123/whoami/compose.yaml
/app/data/swarm/sources/env_123/whoami/.env
```

The `.env` is optional. Arcane lists stacks by grouping the manager's services by their `com.docker.stack.namespace` label, so a stack deployed outside Arcane appears in the live list but has no saved source until Arcane deploys it.

## Services

Manage individual services here, including raw spec updates and removal.

### Create a service

1. Open **Swarm → Services**.
2. Click **Create Service**.
3. Fill in the service definition.
4. Submit.

### Inspect, scale, and roll back a service

The service detail page shows overview data, live logs, tasks, environment and label config, ports and networks, virtual IPs, and storage where present.

- **Scale** — for replicated services, enter a replica count and click **Scale**. Global services don't take replica counts.
- **Rollback** — server-side rollback to the previous service version, useful after a failed rollout or bad image update.

## Tasks

Inspect task state and placement to troubleshoot failed or restarting services. Filter by node, service, or stack. Opening **Tasks** from the Nodes page selects that node's tasks.
