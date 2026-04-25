---
title: 'Networks'
description: 'Manage Docker networks in Arcane, including topology and ports views.'
---

<script lang="ts">
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

The **Networks** page lists every Docker network on the selected host and lets you create, inspect, and remove them. Two extra views — **Ports** and **Topology** — give you a host-wide picture of what's published and how containers are wired up.

<ScreenshotFrame
	src="/img/screenshots/networks-page.jpeg"
	alt="Networks page in Arcane"
	caption="Networks page in Arcane."
	loading="lazy"
	decoding="async"
/>

## Browse networks

Open **Networks** in the sidebar. The table shows name, driver, and subnet for each network.

## Create a network

1. Click **Create Network**.
2. Enter a name.
3. Optional: pick a driver (`bridge`, `overlay`, etc.) and configure subnet, gateway, and other advanced options.
4. Click **Create**.

## Inspect a network

Click a network's name to see its ID, driver, subnet, gateway, and the containers attached to it.

## Remove a network

1. Open the row's dropdown and click the trash icon.
2. Confirm.

> [!NOTE]
> Networks in use by containers can't be removed, and Docker's defaults (`bridge`, `host`, `none`) can never be removed.

## Ports view

Open the **Ports** view from the Networks area to answer questions like:

- which ports are published to the host
- which containers expose ports without publishing them
- which `host:port` combinations are already taken

The table supports search, sorting, and pagination across the whole environment.

## Topology view

The **Topology** view renders an interactive graph of:

- Docker networks
- containers attached to them
- the relationships between them

Useful when you want a quick visual overview of bridge, overlay, or shared application networks.

---

For background on Docker networking concepts, see the [official Docker documentation](https://docs.docker.com/network/).
