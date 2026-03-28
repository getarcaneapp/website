---
title: 'Swarm Nodes and Agents'
description: 'Manage Docker Swarm nodes and Arcane node-agent coverage in Arcane'
order: 3
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

The **Nodes** page shows the members of your Swarm cluster and the current Arcane node-agent status for each node.

## What Arcane Shows for Each Node

For each node, Arcane shows:

- hostname
- role
- status
- availability
- engine version
- Arcane node-agent status

## Node Operations

Arcane supports the standard Swarm availability modes:

- **active**
- **pause**
- **drain**

Use these to control scheduling on a node during maintenance, evacuation, or normal operation.

Arcane can also:

- promote a worker to a manager
- demote a manager to a worker
- remove a node from the Swarm

Only perform manager changes if you understand your quorum and cluster topology.

## Why Node Agents Exist

A Swarm manager can already expose cluster-level Swarm resources, but it does not automatically act as the local Docker engine for every node.

Arcane node agents are used to:

- verify Arcane coverage for each node
- generate a node-specific deployment command
- confirm that the connected agent is running on the expected Swarm node

The underlying agent model is similar to the one described in <Link href="/docs/features/environments">Remote Environments</Link>, but in the Swarm workspace Arcane tracks it per node for coverage and identity verification.

## Agent Statuses

Each node shows one of these Arcane agent states:

- **none**: no Arcane node agent has been prepared for this node
- **pending**: Arcane created the node-agent record, but the agent has not connected yet
- **offline**: the node agent exists but is not currently connected
- **connected**: the agent is connected and Arcane verified that it matches the node
- **mismatched**: an agent connected, but it does not match the expected Swarm node identity

## Deploy a Node Agent

1. Open **Swarm > Nodes**.
2. Find the target node.
3. Click **Deploy Agent**.
4. Arcane opens a dialog with the current node-agent status, the hidden Arcane environment ID used for that node, a `docker run` command, and a `docker compose` snippet.
5. Run one of those commands on the target node.
6. Click **Refresh Status** in Arcane.

When the node agent connects successfully and reports the expected node identity, the node status changes to **connected**.

The node-agent dialog also supports **Regenerate API Key**. Use this if the previous token was lost, the node was rebuilt, or you need to invalidate an older install command.

## Troubleshooting Node Agents

If a node agent stays in **pending**, verify that:

- the command was run on the intended node
- the manager URL is reachable from that node
- the token is current

If a node agent shows **mismatched**, Arcane received an agent connection, but the reported node identity does not match the node row you deployed it for. Regenerate the API key if needed and redeploy using the correct node's install command.

## Current Limitations

Node-agent coverage does **not** currently make every node's local containers, images, volumes, and local-only networks appear as one merged cluster-wide inventory inside Arcane.

Cluster-level Swarm resources come from the Swarm manager, while node-agent coverage is tracked separately per node.
