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

1. Open **Swarm → Stacks** and click **Create Stack**.
2. Pick the **Environment**: the Swarm manager to deploy through.
3. Enter a stack name and paste your Compose content.
4. Optional: add `.env` content for variables the Compose file references.
5. Click **Create Stack**.

Editor shortcuts:

- **Use Template** — load a saved Arcane template. See [Templates](/docs/docker/templates).
- **Convert from Docker Run** — paste a `docker run` to generate starter Compose and env content. For standalone prep, use the [Instance Generator](/generator).
- **Save as Template** — save the editor content as a reusable template.
- **Override file** — add a `compose.override.yaml` that Arcane merges with the main file at deploy time, like the Docker CLI.

Deploy options:

- **Prune removed services** — remove services no longer in the Compose file. Off by default, so a deploy never deletes a service you didn't drop.
- **Send registry authentication** — forward your stored registry credentials to the Swarm managers so they can pull private images.
- **Resolve images** — whether the manager looks up each image tag in the registry and pins the service to its digest (the content hash of one exact image build), so every node runs the same image. **Always** (default) resolves on every deploy, **When changed** only for images whose reference changed, and **Never** skips the lookup.

> [!NOTE]
> Arcane prefixes declared resource names with the stack name. Config and secret names also depend on their content, so changes create new objects without modifying Docker's immutable originals.

### Update or remove a stack

Open the stack from **Swarm → Stacks**, click **Edit**, change the Compose or `.env`, and redeploy. To remove, use the stack detail page or row action and confirm.

### View a stack's saved source

**View Source** shows the Compose and `.env` (optional) files Arcane saved at deploy. The default source directory is:

```bash
/app/data/swarm/sources
```

Files are organized by environment ID and stack name, e.g. environment `env_123` and stack `whoami`:

```text
/app/data/swarm/sources/env_123/whoami/compose.yaml
/app/data/swarm/sources/env_123/whoami/.env
```

Stacks are listed by grouping services by their `com.docker.stack.namespace` label. A stack deployed outside Arcane appears live but has no saved source until Arcane deploys it.

## Services

Manage individual services here, including raw spec updates and removal. To create one, open **Swarm → Services**, click **Create Service**, fill in the definition, and submit.

### Inspect, scale, and roll back a service

The service detail page shows overview data, live logs, tasks, environment and label config, ports and networks, virtual IPs, and storage where present.

- **Scale** — for replicated services, enter a replica count and click **Scale**. Global services don't take replica counts.
- **Rollback** — server-side rollback to the previous service version, useful after a failed rollout or bad image update.

## Tasks

Inspect task state and placement to troubleshoot failed or restarting services. Filter by node, service, or stack. Opening **Tasks** from the Nodes page selects that node's tasks.
