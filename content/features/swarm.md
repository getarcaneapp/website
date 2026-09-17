---
title: 'Docker Swarm'
description: 'Manage a Docker Swarm cluster, services, stacks, configs, secrets, and node agents.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!NOTE]
> Connect other Docker hosts through <Link href="/docs/features/environments">Remote Environments</Link> first. All Swarm actions apply to the selected environment.

<ScreenshotFrame
  src="/img/screenshots/swarm-setup.jpeg"
  alt="Options to initialize a Docker Swarm or join an existing cluster."
  caption="Start a new Swarm or join an existing cluster from the selected environment."
  loading="lazy"
  decoding="async"
/>

## Where the data comes from

Arcane reads cluster resources from the Swarm manager. Stacks are grouped by the `com.docker.stack.namespace` service label, including stacks created outside Arcane.

<span id="troubleshooting"></span>

Remote Environment agents provide access to individual nodes. Services and stacks remain visible when some nodes have no agent connected. See <Link href="/docs/features/swarm-nodes-agents">Nodes & Agents</Link> for coverage types, deployment, and agent statuses.

## Permissions and modes

- The selected environment must be running Docker in Swarm mode. Arcane only shows the workspace when the environment reports an active Swarm state.
- Full cluster management is for **Swarm manager** environments. On a worker, you'll see read-only views.
- Administrative actions (create, update, scale, delete, rotate tokens, unlock the cluster) require admin access in Arcane.

## What's in the workspace

| Page                                                                       | What it covers                                                                    |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| <Link href="/docs/features/swarm-cluster">Cluster</Link>                   | Initialize a Swarm, join, leave, unlock, rotate join tokens, update cluster spec. |
| <Link href="/docs/features/swarm-workloads">Workloads</Link>               | Stacks, services, tasks, scaling, rollbacks, logs.                                |
| <Link href="/docs/features/swarm-nodes-agents">Nodes & Agents</Link>       | Node operations, agent coverage, deployment flow, binding fixes.                  |
| <Link href="/docs/features/swarm-configs-secrets">Configs & Secrets</Link> | Create and delete configs vs. secrets, and when to use each.                      |

## Suggested workflow

1. Select the environment and check **Swarm → Cluster** and **Nodes**.
2. To add hosts, use **Easy Join** from Cluster or an environment's detail page or row menu. Arcane handles addressing, join tokens, and verified agent bindings.
3. Create the app's **Configs** and **Secrets**, then deploy from **Stacks**.
4. Check rollout health and logs under **Services** and **Tasks**.
