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
