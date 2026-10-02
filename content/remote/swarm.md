---
title: 'Docker Swarm'
description: 'Manage a Docker Swarm cluster, services, stacks, configs, secrets, and node agents.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
import { Link } from '#lib/components/ui/link/index.js';
</script>

Docker Swarm is Docker's built-in clustering mode: several Docker hosts join one cluster and run services that Swarm schedules, replicates, and restarts across them. Use it instead of Compose projects when an app should run on more than one host or keep running when a host goes down.

> [!NOTE]
> To manage other hosts, connect them as <Link href="/docs/remote/environments">Remote Environments</Link> first. All Swarm actions apply to the currently selected environment.

<ScreenshotFrame
  src="/img/screenshots/swarm-setup.jpeg"
  alt="Options to initialize a Docker Swarm or join an existing cluster."
  caption="Start a new Swarm or join an existing cluster from the selected environment."
  loading="lazy"
  decoding="async"
/>

## Get started

1. Select the environment and check **Swarm → Cluster** and **Nodes**.
2. To add hosts, use **Easy Join** from the Cluster page, an environment's detail page, or its row menu. Arcane fills in the manager address and join token for you.
3. Create the app's **Configs** and **Secrets**, then deploy from **Stacks**.
4. Check rollout health and logs under **Services** and **Tasks**.

## What's in the workspace

| Page                                                                     | What it covers                                                                    |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| <Link href="/docs/remote/swarm-cluster">Cluster</Link>                   | Initialize a Swarm, join, leave, unlock, rotate join tokens, update cluster spec. |
| <Link href="/docs/remote/swarm-workloads">Workloads</Link>               | Stacks, services, tasks, scaling, rollbacks, logs.                                |
| <Link href="/docs/remote/swarm-nodes-agents">Nodes & Agents</Link>       | Node operations, agent coverage, deployment, and fixing agent links.              |
| <Link href="/docs/remote/swarm-configs-secrets">Configs & Secrets</Link> | Create and delete configs and secrets, and when to use each.                      |

## Where the data comes from

Arcane reads cluster resources from the Swarm manager. Stacks are grouped by the `com.docker.stack.namespace` service label, so stacks created outside Arcane show up too.

Agents on individual nodes add access to each node's own containers and images; services and stacks stay visible without them. See <Link href="/docs/remote/swarm-nodes-agents">Nodes & Agents</Link>.

## Permissions and modes

- The selected environment must be running Docker in Swarm mode. Arcane shows the Swarm workspace only when the environment reports an active Swarm.
- Full cluster management needs a **Swarm manager** environment. On a worker, you get read-only views.
- Viewing Swarm resources needs `swarm:read`. Each change needs its own permission, such as `swarm:init`, `swarm:join`, `swarm:nodes`, `swarm:services`, `swarm:stacks`, or `swarm:unlock`. See the <Link href="/docs/access/roles#permission-catalog">permission catalog</Link>.
