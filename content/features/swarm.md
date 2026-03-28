---
title: 'Docker Swarm'
description: 'Manage Docker Swarm clusters, services, stacks, configs, secrets, and node agent coverage in Arcane'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Arcane includes a dedicated Swarm workspace for managing Docker Swarm from the currently selected environment. It is designed for day-to-day cluster operations: cluster lifecycle changes, application deployment, service operations, node management, and Swarm-native configs and secrets.

## Before You Start

Swarm features in Arcane are environment-specific.

If you are first connecting Arcane to another Docker host, see <Link href="/docs/features/environments">Remote Environments</Link> for the base agent and connectivity workflow.

- Every Swarm action applies to the environment selected in Arcane.
- If you switch environments, Arcane switches to that environment's Docker engine and Swarm state.
- The selected environment should be running Docker in Swarm mode to access the Swarm workspace.
- Full cluster management is intended for Swarm manager environments.
- Read-only views may be available to non-admin users depending on your setup.
- Creating, updating, scaling, deleting, rotating tokens, unlocking the cluster, and similar administrative actions require admin access in Arcane.

## How Arcane Sees Your Swarm

Arcane reads cluster-wide Swarm data directly from a Swarm manager.

Nodes, services, tasks, configs, and secrets come straight from Docker's Swarm APIs. For stacks, Arcane looks at the current Swarm services and groups them by the `com.docker.stack.namespace` label.

That lets Arcane show you what the manager sees right now, without bouncing between nodes or relying on a separate saved copy of the stack list.

Arcane also supports per-node Arcane agents for Swarm nodes. Those agents are used for node coverage and identity verification, not as a merged cluster-wide browser for every node's local-only Docker resources.

## What You Can Manage

The Swarm workspace in Arcane includes these main areas:

- **Cluster**: initialize Swarm, join or leave a cluster, unlock a locked cluster, rotate join tokens, and update cluster settings.
- **Stacks**: deploy applications from Compose content, inspect a stack, update it by redeploying, and remove it.
- **Services**: create standalone services, inspect their configuration, scale them, roll them back, stream logs, and remove them.
- **Tasks**: see the tasks Swarm is running across the cluster or for a specific node, service, or stack.
- **Nodes**: inspect managers and workers, change availability, promote or demote nodes, remove nodes, and check Arcane node-agent coverage.
- **Configs**: create and delete non-sensitive configuration objects used by services and stacks.
- **Secrets**: create and delete sensitive values used by services and stacks.

## Read the Right Swarm Page

- <Link href="/docs/features/swarm-cluster">Swarm Cluster</Link>: initialize, join, leave, unlock, rotate join tokens, and update cluster settings.
- <Link href="/docs/features/swarm-workloads">Swarm Workloads</Link>: stacks, services, tasks, rollout workflows, and when to use each view.
- <Link href="/docs/features/swarm-nodes-agents">Swarm Nodes and Agents</Link>: node operations, agent coverage, deployment flow, statuses, and agent troubleshooting.
- <Link href="/docs/features/swarm-configs-secrets">Swarm Configs and Secrets</Link>: when to use configs vs secrets, plus create/delete workflows.

## Recommended Workflow

For most teams, the smoothest Swarm workflow in Arcane looks like this:

1. Select the correct environment.
2. Open **Swarm > Cluster** and confirm the environment is part of the expected Swarm.
3. Review **Nodes** to confirm managers, workers, and availability.
4. If needed, deploy Arcane node agents to the nodes you want covered.
5. Create required **Configs** and **Secrets**.
6. Deploy your application from **Stacks**.
7. Use **Services** and **Tasks** to inspect rollout health and logs.
8. Scale, roll back, redeploy, or remove workloads as needed.

## Quick Troubleshooting

**The Swarm section does not appear**

Make sure the selected environment is actually in Swarm mode. Arcane only shows the Swarm workspace when the environment reports an active Swarm state.

**A node agent stays in `pending`**

This usually means Arcane generated the deployment command, but the agent has not connected yet. Verify that:

- the command was run on the intended node
- the manager URL is reachable from that node
- the token is current

**A node agent shows `mismatched`**

This means Arcane received an agent connection, but the reported node identity does not match the node row you deployed it for. Regenerate the API key if needed and redeploy using the correct node's install command.

**Services or stacks are visible, but node-local coverage is incomplete**

That is expected if some nodes do not have Arcane node agents connected. Cluster-level Swarm resources come from the Swarm manager, while node-agent coverage is tracked separately per node.
