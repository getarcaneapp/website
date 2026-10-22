---
title: "Swarm Nodes and Agents"
description: "Manage Swarm nodes and Arcane node-agent coverage."
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

### Use an existing remote agent

If the host is already a [Remote Agent](/docs/remote/agents), add it with **Easy Join** (see [Swarm Cluster](/docs/remote/swarm-cluster)). It then covers the node without re-enrolling. If it joined some other way, open **Swarm → Nodes**: Arcane links a single Remote Agent reporting the same Swarm node ID automatically. This needs `swarm-nodes:list`.

### Create a new agent for a node

1. In **Swarm → Nodes**, open the node's Agent dialog and choose **Create agent**. Arcane creates a Remote Agent and shows a `docker run` command and a Compose snippet for `ghcr.io/getarcaneapp/agent` with a single-use enrollment token.
2. Run one of them on that node.
3. Click **Refresh Status**. The node shows **connected** once the agent reports the expected node ID.

### Enroll many nodes with one token

Run the agent on each node with a multi-use token from **Agents → Enrollment Tokens** (see [Enroll many hosts with one token](/docs/remote/agents#enroll-many-hosts-with-one-token)). When the node's cluster is managed by the Arcane Manager or one of its agents, each agent gets its own agent linked to its node. Arcane refuses the enrollment if the node already has an agent or a connected agent.

## Agent dialog

| Coverage                 | Meaning                                                          |
| ------------------------ | ---------------------------------------------------------------- |
| **Local manager**        | Covered by the Arcane Manager's own Docker socket.               |
| **Remote Agent**         | Covered by a Remote Agent that reported this node's ID.          |
| **Dedicated node Agent** | Covered by a hidden registration that exists only for this node. |

With Remote Agent coverage, the dialog links to the **Containers**, **Images**, **Volumes**, and **Networks** pages you're allowed to open. Filter them by the node's agent to see only that host.

### Change which agent covers a node

**Detach agent** removes the link between node and agent but keeps the agent and its connection. To point a node at a different agent, rebind it and confirm. Refreshing the page never moves an existing link on its own.

### Legacy dedicated registrations

Older dedicated node agents keep working, labelled **Legacy dedicated registration**. From the dialog, click **Generate Enrollment Token** to redeploy it, or **Remove registration** to delete its hidden agent and API key. Replacing it with a Remote Agent asks for confirmation, then removes the old registration.

## Agent statuses

| Status         | Meaning                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **none**       | No agent has been set up for this node.                                                                       |
| **pending**    | The agent is registered but hasn't connected yet.                                                             |
| **offline**    | The agent is registered but not connected right now.                                                          |
| **connected**  | The agent is connected and reported this node's ID.                                                           |
| **mismatched** | An agent connected, but it reported a different node than the one it was set up for.                          |
| **ambiguous**  | More than one Remote Agent reported this node's ID, so Arcane didn't pick one. Choose it in the Agent dialog. |

## Troubleshooting

- **pending** doesn't change: check that the command ran on the intended node and that the node can reach the Manager URL. A single-use token works once; generate a new one if it was already used.
- **mismatched** on a Remote Agent: detach it, or rebind the correct agent.
- **mismatched** on a dedicated agent: generate a new enrollment token and redeploy on the intended node.
