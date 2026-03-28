---
title: 'Swarm Cluster'
description: 'Initialize, join, unlock, and update a Docker Swarm cluster in Arcane'
order: 1
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

The **Cluster** page is where you manage Swarm lifecycle and security settings for the selected environment.

## What You Can Do

- initialize a new Swarm
- join an existing Swarm as a manager or worker
- leave a cluster
- unlock a locked Swarm
- view or rotate join credentials
- update the live Swarm spec

## Initialize a Swarm

Use this when the current environment is not yet part of a Swarm.

1. Open **Swarm > Cluster**.
2. Choose **Initialize**.
3. Optionally set one or more advanced init fields:

   <Snippet text="listenAddr · advertiseAddr · autoLockManagers · forceNewCluster" class="mt-2 mb-2 w-full" />

4. Optionally provide advanced Swarm spec JSON.
5. Confirm the action.

After initialization, Arcane refreshes the cluster state and exposes the rest of the Swarm workspace for that environment.

## Join or Leave a Cluster

**Join an existing Swarm**

Use this when the current environment should join an existing cluster as a manager or worker.

1. Open **Swarm > Cluster**.
2. Choose **Join**.
3. Enter one or more manager addresses, the join token, and any optional listen or advertise addresses.
4. Confirm the action.

**Leave the cluster**

Use **Leave** when a node should no longer be part of the Swarm.

- You can force the leave action when needed.
- After the operation completes, Arcane refreshes the environment state.

## Unlock and Rotate Credentials

If manager autolock is enabled and the cluster is locked after restart:

1. Open **Swarm > Cluster**.
2. Enter the unlock key.
3. Click **Unlock**.

Arcane can also show and manage these sensitive values from the same page:

- the current **worker join token**
- the current **manager join token**
- the **manager unlock key**

Arcane can rotate the join tokens from the Cluster page. Treat these values like credentials.

## Update Cluster Settings

The Cluster page supports updating the live Swarm spec through Arcane's UI. This is intended for advanced operators who understand the Docker Swarm settings they are changing.

## Notes

- Swarm actions apply to the currently selected environment.
- Full cluster management is intended for Swarm manager environments.
- Administrative actions require admin access in Arcane.
