---
title: 'Swarm Cluster'
description: 'Initialize, join, unlock, and update a Docker Swarm cluster.'
order: 1
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

The **Cluster** page covers the Swarm lifecycle and security settings for the selected environment — initialize, join, leave, unlock, rotate join tokens, and update the live Swarm spec.

## Initialize a Swarm

Use this when the selected environment isn't part of a Swarm yet.

1. Open **Swarm → Cluster**.
2. Click **Initialize**.
3. Optional: set advanced init fields:

   <Snippet text="listenAddr · advertiseAddr · autoLockManagers · forceNewCluster" class="mt-2 mb-2 w-full" />

4. Optional: provide an advanced Swarm spec (JSON).
5. Confirm.

After initialization, Arcane refreshes cluster state and exposes the rest of the Swarm workspace for that environment.

## Join an existing Swarm

Use this when the environment should join an existing cluster as a manager or worker.

1. Open **Swarm → Cluster**.
2. Click **Join**.
3. Enter manager addresses, the join token, and any optional listen/advertise addresses.
4. Confirm.

## Easy Join Remote Environments

When the selected environment is an initialized Swarm manager, use **Easy Join** to add existing Remote Environments without copying manager addresses or join tokens.

You can start Easy Join in three places:

- **Swarm → Cluster → Easy Join** for one or more targets.
- An eligible Remote Environment's detail page for that environment.
- An eligible Remote Environment's row menu on the **Environments** page.

For a multi-environment join:

1. Select each target environment.
2. Choose **worker** or **manager** and an availability mode.
3. Optionally set listen, advertise, or data-path addresses per target.
4. Confirm.

Arcane discovers a reachable address from the selected manager's cluster state and retrieves worker and manager tokens internally. Easy Join responses never expose the tokens. Manager targets are processed sequentially and workers use bounded concurrency. Each target has an independent result, so one failure does not undo successful joins.

- Already in this cluster: verified and bound without rejoining.
- Active in another cluster: rejected without forcing a leave.
- Joined but not verified before timeout: shown as **joined, verification pending**. Nodes-page reconciliation completes the binding later.

Easy Join requires `swarm:unlock` and `swarm:nodes` on the selected manager plus `swarm:join` on every target.

Environment detail and row-menu actions are shown only for enabled, online Remote Environments that are eligible to join the active selected manager and are not already bound to one of its nodes.

## Leave a cluster

Click **Leave** when a node should no longer be part of the Swarm. You can force the leave when needed. Arcane refreshes environment state after the operation completes.

## Unlock a locked cluster

If manager autolock is enabled and the cluster is locked after a restart:

1. Open **Swarm → Cluster**.
2. Enter the unlock key.
3. Click **Unlock**.

## Manage join tokens and the unlock key

The Cluster page shows and lets you rotate:

- the **worker join token**
- the **manager join token**
- the **manager unlock key**

Treat these like credentials. Rotating a token invalidates the previous value.

## Update the cluster spec

The Cluster page can update the live Swarm spec through the UI. This is for advanced operators who understand the Docker Swarm settings being changed.

## Notes

- Swarm actions apply to the currently selected environment.
- Full cluster management requires a **Swarm manager** environment.
- Administrative actions require admin access in Arcane.
- The Arcane Manager's own Docker node receives local Agent coverage automatically.
