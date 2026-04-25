---
title: 'Swarm Nodes and Agents'
description: 'Manage Swarm nodes and Arcane node-agent coverage.'
order: 3
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

The **Nodes** page shows every member of the Swarm cluster and the current Arcane node-agent status for each one.

For each node you see: hostname, role, status, availability, engine version, and Arcane node-agent status.

## Node operations

Arcane supports the standard Swarm availability modes for managing scheduling during maintenance, evacuation, or normal operation:

- **active**
- **pause**
- **drain**

You can also:

- promote a worker to a manager
- demote a manager to a worker
- remove a node from the Swarm

> [!WARNING]
> Only make manager changes if you understand your quorum and cluster topology.

## Why node agents exist

A Swarm manager exposes cluster-level resources, but it doesn't act as the local Docker engine for every node. Arcane's node agents handle:

- Arcane coverage verification per node
- generating a node-specific deploy command
- confirming the connected agent is running on the expected Swarm node

The agent model is similar to <Link href="/docs/features/environments">Remote Environments</Link>, but in the Swarm workspace Arcane tracks it per node — for coverage and identity verification, not as a merged cluster-wide inventory.

## Agent statuses

Each node shows one of:

- **none** — no agent has been prepared for this node.
- **pending** — the agent record exists but the agent hasn't connected yet.
- **offline** — the agent exists but isn't currently connected.
- **connected** — the agent is connected and verified against the node.
- **mismatched** — an agent connected, but its node identity doesn't match the row you deployed it for.

## Deploy a node agent

1. Open **Swarm → Nodes**.
2. Find the target node.
3. Click **Deploy Agent**.
4. Arcane shows a dialog with the current status, the (hidden) Arcane environment ID for this node, a `docker run` command, and a Compose snippet.
5. Run one of those on the target node.
6. Click **Refresh Status** in Arcane.

When the agent connects and reports the expected node identity, the status flips to **connected**.

The dialog also has **Regenerate API Key**. Use this if the previous token was lost, the node was rebuilt, or you need to invalidate an older install command.

## Troubleshooting

**Stuck in `pending`.** Verify that:

- the install command was run on the intended node
- the manager URL is reachable from that node
- the token is still current

**Showing `mismatched`.** An agent connected but its identity doesn't match the row. Regenerate the API key and redeploy on the correct node.

## Current limitations

Node-agent coverage doesn't merge every node's local containers, images, volumes, and networks into one cluster-wide view inside Arcane. Cluster-level Swarm resources come from the manager; per-node coverage is tracked separately.
