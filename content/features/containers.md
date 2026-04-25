---
title: 'Containers'
description: 'Manage Docker containers from Arcane.'
---

<script lang="ts">
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

The **Containers** page lists every container on your Docker host and lets you start, stop, inspect, and remove them. Use it for one-off containers; for grouped services, see [Projects](/docs/features/projects).

<ScreenshotFrame
	src="/img/screenshots/containers-page.jpeg"
	alt="Containers page in Arcane"
	caption="Containers page in Arcane."
	loading="lazy"
	decoding="async"
/>

## Browse containers

Open **Containers** in the sidebar. The table shows name, ID, image, and status for every container on the host.

If you have a lot of published ports, the table collapses long port lists behind a `+N` expander. The view options menu can also hide exposed-only ports so you only see published host mappings.

## Create a container

1. Click **Create Container**.
2. Fill in name and image. The other fields (ports, volumes, environment variables, restart policy, and so on) are optional.
3. Click **Create**.

## Start, stop, restart, redeploy

Each container row has action buttons:

- **Start** / **Stop** / **Restart** — change the running state.
- **Redeploy** — pull the latest image and recreate the container with the same name, mounts, labels, networks, and restart policy. Use this to update a single container in place.

## Inspect a container

Click a container's name or its **Inspect** button to open the detail view. Tabs cover configuration, network settings, mounts, and logs.

### Compose tab

If the container belongs to an Arcane-managed Compose project, the detail view also shows a **Compose** tab with the source compose file:

- the root compose file when the service is defined there
- an included compose file when the service comes from a Compose `include`

For Git-synced projects, this tab is read-only.

### Auto-update toggle

The **Overview** tab has an **Auto Update** toggle for opting a single container in or out of Arcane's updater. If the container already has an explicit `com.getarcaneapp.arcane.updater` label, that label wins.

## View logs

Open a container's detail view and switch to the **Logs** tab. The viewer:

- detects JSON and logfmt logs and renders them as structured rows
- groups multiline messages so a stack trace stays together
- shows small CPU and memory monitors alongside the log stream

## Remove a container

1. Click the trash icon on the container row.
2. Confirm.

> [!NOTE]
> A container has to be stopped before you can remove it, unless you check the **Force** option.
