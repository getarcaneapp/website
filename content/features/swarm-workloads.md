---
title: 'Swarm Workloads'
description: 'Deploy and manage Docker Swarm stacks, services, and tasks.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import { Snippet } from '#lib/components/ui/snippet/index.js';
</script>

## When to use which

- **Stacks** — normal application deployment, grouped service management. Recommended.
- **Services** — direct control over a single Swarm service. For advanced users comfortable with raw specs.
- **Tasks** — runtime placement and state visibility, mostly for troubleshooting.

## Stacks

A stack deploys related services together from a Compose file.

### How Arcane finds stacks

Arcane groups the manager's current services by `com.docker.stack.namespace`. This includes stacks deployed outside Arcane, even without saved Compose files.

### Deploy a stack

1. Open **Swarm → Stacks**.
2. Click **Create Stack**.
3. Enter a stack name.
4. Paste your Compose content.
5. Optional: add `.env` content for variables referenced by the Compose file.
6. Click **Create Stack**.

Useful shortcuts in the stack editor:

- **Use Template** — load a saved Arcane template. See <Link href="/docs/customization/templates">Templates</Link>.
- **Convert from Docker Run** — paste a `docker run` and let Arcane generate Compose and env content as a starting point. For standalone prep, use the <Link href="/generator">Compose Generator</Link>.
- **Save as Template** — save the editor content as a reusable template.
- **Override file** — add a `compose.override.yaml` alongside the main Compose file. Arcane merges the two at deploy time, the same way the Docker CLI does.

Deploy options:

- **Prune removed services** — remove services that are no longer in the Compose file. Off by default, so a deploy never deletes a service you didn't explicitly drop.
- **Send registry authentication** — forward your stored registry credentials to the Swarm managers so they can pull private images.
- **Resolve images** — how aggressively to pin image digests: **Always** (default), **When changed**, or **Never**.

> [!NOTE]
> Arcane prefixes declared resource names with the stack name. Config and secret names also depend on their content, so changes create new objects without modifying Docker's immutable originals.

### Update or remove a stack

Open the stack from **Swarm → Stacks**, click **Edit**, change the Compose or `.env`, and redeploy. To remove, use the stack detail page or row action and confirm.

### View Source vs. the live stack list

**View Source** shows the Compose and `.env` files Arcane saved during deployment. The default source directory is:

<Snippet text="/app/data/swarm/sources" class="mt-2 mb-2 w-full" />

Files are organized by environment ID and stack name. For example, environment `env_123` and stack `whoami`:

```text
/app/data/swarm/sources/env_123/whoami/compose.yaml
/app/data/swarm/sources/env_123/whoami/.env
```

The `.env` is optional. A stack deployed outside Arcane appears in the live list but won't have a saved source until Arcane deploys it.

## Services

Manage individual services here, including raw spec updates and removal.

### Create a service

1. Open **Swarm → Services**.
2. Click **Create Service**.
3. Fill in the service definition.
4. Submit.

### Inspect, scale, roll back

The service detail page shows overview data, live logs, tasks, environment and label config, ports and networks, virtual IPs, and storage where present.

- **Scale** — for replicated services, enter a replica count and click **Scale**. Global services don't take replica counts.
- **Rollback** — server-side rollback to the previous service version, useful after a failed rollout or bad image update.

## Tasks

Inspect task state and placement to troubleshoot failed or restarting services. Filter by node, service, or stack. Opening **Tasks** from the Nodes page selects that node's tasks.
