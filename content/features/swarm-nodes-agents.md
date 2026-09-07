---
title: 'Swarm Nodes and Agents'
description: 'Manage Swarm nodes and Arcane node-agent coverage.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

The **Nodes** page lists each node's hostname, role, status, availability, Docker version, and agent status.

## Node operations

Set availability to **active**, **pause**, or **drain** to accept tasks, keep current tasks only, or move tasks elsewhere. You can also promote, demote, or remove nodes.

> [!WARNING]
> Only make manager changes if you understand your quorum and cluster topology.

## Why node agents exist

Node agents access each node's local Docker engine and verify its Swarm identity. New deployments use a visible <Link href="/docs/features/environments">Remote Environment</Link> for both jobs. The manager's local node needs no extra agent. Legacy hidden agents remain supported.

## Agent statuses

- **none** — no agent has been prepared for this node.
- **pending** — the agent record exists but the agent hasn't connected yet.
- **offline** — the agent exists but isn't currently connected.
- **connected** — the agent is connected and verified against the node.
- **mismatched** — an agent connected, but its node identity doesn't match the row you deployed it for.
- **ambiguous** — more than one visible environment reported the same node identity, so Arcane did not choose one automatically.

The Nodes page reconciles visible Remote Environments when you have the `swarm:nodes` permission. Unique verified matches are attached automatically. Conflicts fail closed: select the intended environment in the Agent dialog.

## Cover a node

Open a node's Agent dialog to see one of three coverage types:

- **Local manager** — automatic coverage from the Arcane Manager's Docker socket.
- **Remote Environment** — a visible direct or edge environment verified against this node. Its existing Agent token is preserved.
- **Dedicated node Agent** — a hidden registration created only for node coverage.

When a visible environment covers the node, the dialog links to its **Containers**, **Images**, **Volumes**, and **Networks** pages when your permissions allow those pages.

### Create coverage for a node

1. Open **Swarm → Nodes**.
2. Find the target node.
3. Open the Agent dialog and choose **Create environment**.
4. Arcane creates one visible Edge Remote Environment and shows a `docker run` command and Compose snippet using `ghcr.io/getarcaneapp/agent`.
5. Run one of those on the target node.
6. Click **Refresh Status** in Arcane.

When the agent reports the expected node identity, Arcane binds it to the node and shows **connected**. Its token stays unchanged.

If you already created and connected a Remote Environment for the host, use **Easy Join** to add it to the cluster. Reconciliation attaches a unique identity match automatically. When multiple environments report the same node, open the Agent dialog and choose the intended verified candidate.

### Legacy dedicated registrations

Existing hidden dedicated node Agents continue to provide coverage. Their Agent dialog labels them as a **Legacy dedicated registration** and lets you show the deployment, regenerate its API key, or remove the registration.

Removing a legacy registration deletes its hidden environment and API key. Replacing one with a verified visible Remote Environment requires explicit confirmation and removes the obsolete hidden registration. `ghcr.io/getarcaneapp/arcane-headless` remains a supported release alias for existing deployments.

### Change a visible binding

Detaching removes the node binding but keeps the environment and token. Rebinding requires confirmation; refreshing the page never moves conflicting bindings.

## Troubleshooting

**Stuck in `pending`.** Verify that:

- the install command was run on the intended node
- the manager URL is reachable from that node
- the token is still current

**Showing `mismatched`.** The bound environment reports a different node ID. Detach it or explicitly rebind the correct environment; Arcane will not silently move a conflicting binding.

**Showing `ambiguous`.** Open the Agent dialog and select the intended verified Remote Environment.

## Current limitations

Node-agent coverage doesn't merge every node's local containers, images, volumes, and networks into one cluster-wide list. Cluster-level Swarm resources come from the manager; node-local links switch to the bound Remote Environment's existing resource pages.
