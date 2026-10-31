---
title: 'Swarm Nodes and Agents'
description: 'Manage Swarm nodes and Arcane node-agent coverage.'
---

The **Nodes** page lists every Swarm node with its hostname, role, status, availability, Docker version, and agent status. Use it to drain or remove nodes, and to connect an Arcane Agent to a node so you can manage that host's own containers, images, volumes, and networks.

## Change node availability and role

| Availability | Effect                                                 |
| ------------ | ------------------------------------------------------ |
| **active**   | The node accepts new tasks.                            |
| **pause**    | The node keeps its current tasks but gets no new ones. |
| **drain**    | Swarm moves the node's tasks to other nodes.           |

You can also promote a worker, demote a manager, or remove a node.

> [!WARNING]
> Swarm needs a majority of its managers online to keep working. Before you demote or remove a manager, make sure enough managers remain.

## Connect an agent to a node

Without an agent, Arcane sees only cluster-wide resources like services and stacks. With one, the node's Agent dialog links to that host's own resources. The Manager's own node is covered automatically.

### Use an existing remote environment

If the host is already a [Remote Environment](/docs/remote/environments), add it with **Easy Join** (see [Swarm Cluster](/docs/remote/swarm-cluster)). Its agent then covers the node and keeps its token. If it joined some other way, open **Swarm → Nodes**: Arcane links a single Remote Environment reporting the same Swarm node ID automatically. This needs `swarm:nodes`.

### Create a new environment for a node

1. In **Swarm → Nodes**, open the node's Agent dialog and choose **Create environment**. Arcane creates a Remote Environment and shows a `docker run` command and a Compose snippet for `ghcr.io/getarcaneapp/agent`.
2. Run one of them on that node.
3. Click **Refresh Status**. The node shows **connected** once the agent reports the expected node ID.

## Agent dialog

| Coverage                 | Meaning                                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Local manager**        | Covered by the Arcane Manager's own Docker socket.                           |
| **Remote Environment**   | Covered by a Remote Environment whose agent reported this node's ID.         |
| **Dedicated node Agent** | Covered by a hidden registration that exists only for this node.             |

With Remote Environment coverage, the dialog links to the **Containers**, **Images**, **Volumes**, and **Networks** pages you're allowed to open. Filter them by the node's environment to see only that host.

### Change which environment covers a node

**Detach environment** removes the link between node and environment but keeps the environment and its token. To point a node at a different environment, rebind it and confirm. Refreshing the page never moves an existing link on its own.

### Legacy dedicated registrations

Older dedicated node agents keep working, labelled **Legacy dedicated registration**. From the dialog, show the deployment, regenerate the API key, or remove the registration (deleting its hidden environment and API key). Replacing it with a Remote Environment asks for confirmation, then removes the old registration.

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
