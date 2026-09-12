---
title: 'Docker Swarm'
description: 'Manage a Docker Swarm cluster, services, stacks, configs, secrets, and node agents.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!NOTE]
> Connect other Docker hosts through <Link href="/docs/features/environments">Remote Environments</Link> first. All Swarm actions apply to the selected environment.

## Where the data comes from

Arcane reads cluster resources from the Swarm manager. Stacks are grouped by the `com.docker.stack.namespace` service label, including stacks created outside Arcane.

Remote Environment agents provide access to individual nodes. The manager's local node is covered automatically; legacy hidden agents remain supported.

## Permissions and modes

- The selected environment must be running Docker in Swarm mode.
- Full cluster management is for **Swarm manager** environments. On a worker, you'll see read-only views.
- Administrative actions (create, update, scale, delete, rotate tokens, unlock the cluster) require admin access in Arcane.

## What's in the workspace

| Page                                                                       | What it covers                                                                    |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| <Link href="/docs/features/swarm-cluster">Cluster</Link>                   | Initialize a Swarm, join, leave, unlock, rotate join tokens, update cluster spec. |
| <Link href="/docs/features/swarm-workloads">Workloads</Link>               | Stacks, services, tasks, scaling, rollbacks, logs.                                |
| <Link href="/docs/features/swarm-nodes-agents">Nodes & Agents</Link>       | Node operations, agent coverage, deployment flow, troubleshooting.                |
| <Link href="/docs/features/swarm-configs-secrets">Configs & Secrets</Link> | Create and delete configs vs. secrets, and when to use each.                      |

## Suggested workflow

1. Select the environment and check **Swarm → Cluster** and **Nodes**.
2. To add hosts, use **Easy Join** from Cluster or an environment's detail page or row menu. Arcane handles addressing, join tokens, and verified agent bindings.
3. Create the app's **Configs** and **Secrets**, then deploy from **Stacks**.
4. Check rollout health and logs under **Services** and **Tasks**.

## Troubleshooting

**The Swarm section doesn't appear.** The selected environment isn't in Swarm mode. Arcane only shows the workspace when the environment reports an active Swarm state.

**A node agent stays in `pending`.** Arcane generated the deploy command but the agent hasn't connected. Check that:

- the command was run on the intended node
- the manager URL is reachable from that node
- the token is still current

**A node agent shows `mismatched`.** An agent connected, but the reported node identity doesn't match the row you deployed it for. Regenerate the API key and redeploy on the right node.

**A node agent shows `ambiguous`.** Multiple visible environments reported the node identity. Open the node's Agent dialog and select the intended environment.

**Services or stacks visible, but per-node coverage is incomplete.** Expected if some nodes don't have Arcane agents connected. Cluster-level resources come from the Swarm manager; per-node coverage is tracked separately.
