---
title: 'Swarm Nodes and Agents'
description: 'Manage Swarm nodes and Arcane node-agent coverage.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

The **Nodes** page lists every Swarm node with its hostname, role, status, availability, Docker version, and agent status. Use it to drain or remove nodes, and to connect an Arcane Agent to a node so you can manage that host's own containers, images, volumes, and networks.

## Change node availability and role

Set a node's availability to **active**, **pause**, or **drain**:

| Availability | Effect                                                 |
| ------------ | ------------------------------------------------------ |
| **active**   | The node accepts new tasks.                            |
| **pause**    | The node keeps its current tasks but gets no new ones. |
| **drain**    | Swarm moves the node's tasks to other nodes.           |

You can also promote a worker to manager, demote a manager to worker, or remove a node.

> [!WARNING]
> Swarm needs a majority of its managers online to keep working. Before you demote or remove a manager, make sure enough managers remain.

## Connect an agent to a node

Without an agent, Arcane sees only cluster-wide resources such as services and stacks. With one, the node's Agent dialog links to that host's own resources. The Arcane Manager's own node is covered automatically.

### Use an existing remote environment

If the host is already a <Link href="/docs/remote/environments">Remote Environment</Link>, add it to the cluster with **Easy Join** (see <Link href="/docs/remote/swarm-cluster">Swarm Cluster</Link>). Its agent then covers the node and keeps its token.

If the host joined the Swarm some other way, open **Swarm → Nodes**. Arcane checks which Remote Environments report the same Swarm node ID and links a single match automatically. This needs the `swarm:nodes` permission.

### Create a new environment for a node

1. Open **Swarm → Nodes** and find the node.
2. Open its Agent dialog and choose **Create environment**.
3. Arcane creates an Edge Remote Environment and shows a `docker run` command and a Compose snippet for `ghcr.io/getarcaneapp/agent`.
4. Run one of them on that node.
5. Click **Refresh Status**.

When the agent reports the expected node ID, the node shows **connected**.

## Agent dialog

The Agent dialog shows how a node is covered:

| Coverage                 | Meaning                                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Local manager**        | Covered by the Arcane Manager's own Docker socket.                           |
| **Remote Environment**   | Covered by a Direct or Edge environment whose agent reported this node's ID. |
| **Dedicated node Agent** | Covered by a hidden registration that exists only for this node.             |

When a Remote Environment covers the node, the dialog links to its **Containers**, **Images**, **Volumes**, and **Networks** pages if you have permission to open them. Those pages show only that host's resources; Arcane doesn't merge every node's resources into one cluster-wide list.

### Change which environment covers a node

**Detach environment** removes the link between node and environment but keeps the environment and its token. To point a node at a different environment, rebind it and confirm. Refreshing the page never moves an existing link on its own.

### Legacy dedicated registrations

Older dedicated node agents keep working and are labelled **Legacy dedicated registration**. From the dialog you can show the deployment, regenerate the API key, or remove the registration. Removing it deletes its hidden environment and API key. Replacing it with a Remote Environment asks for confirmation and then removes the old registration.

## Agent statuses

| Status         | Meaning                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **none**       | No agent has been set up for this node.                                                                             |
| **pending**    | The agent is registered but hasn't connected yet.                                                                   |
| **offline**    | The agent is registered but not connected right now.                                                                |
| **connected**  | The agent is connected and reported this node's ID.                                                                 |
| **mismatched** | An agent connected, but it reported a different node than the one it was set up for.                                |
| **ambiguous**  | More than one Remote Environment reported this node's ID, so Arcane didn't pick one. Choose it in the Agent dialog. |

## Troubleshooting

- **Stays pending**: check that the command ran on the intended node, that the node can reach the Manager URL, and that the token is still current.
- **mismatched** on a Remote Environment: detach it, or rebind the correct environment.
- **mismatched** on a dedicated agent: regenerate its API key and redeploy on the intended node.

The agent image is also published as `arcane-headless`; see <Link href="/docs/remote/environments">Remote Environments</Link>.
