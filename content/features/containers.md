---
title: 'Containers'
description: 'Learn how to manage Docker containers with Arcane'
---

<script lang="ts">
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

## What Can You Do With Containers in Arcane?

- **View Containers:** See all containers on your Docker host, including their names, IDs, images, and current status (like running or stopped).
- **Create Containers:** Launch new containers from existing images. You can set the name, image, ports, volumes, environment variables, and more using a guided form.
- **Start/Stop/Restart Containers:** Easily control the state of your containers with one click.
- **Redeploy Containers:** Pull the latest image for a single container and recreate it while keeping its existing configuration.
- **Inspect Containers:** Click on a container to see detailed information, including configuration, network settings, mounts, and logs.
- **Edit Compose-Managed Services in Place:** For containers that belong to an Arcane-managed project, open the Compose tab to inspect or edit the service's source compose file.
- **Control Auto Updates Per Container:** Toggle auto updates directly from the container detail view when the container is not already controlled by an explicit updater label.
- **Remove Containers:** Delete containers you no longer need. You can only remove stopped containers (unless you use the force option).
- **View Logs:** Use the updated log viewer with structured log detection, multiline grouping, and small CPU and memory monitors in the logs panel.

## Screenshot

<ScreenshotFrame
	src="/img/screenshots/containers-page.jpeg"
	alt="Containers page in Arcane"
	caption="Containers page in Arcane."
	loading="lazy"
	decoding="async"
/>

## How to Use

### Viewing Containers

1. Go to the **Containers** section in the sidebar.
2. You'll see a table listing all your Docker containers with their names, IDs, images, and status.

### Creating a Container

1. Click the **Create Container** button.
2. Fill out the form with the required details (name, image, etc.).
3. (Optional) Set advanced options like ports, volumes, environment variables, and more.
4. Click **Create** to launch your new container.

### Controlling a Container

- **Start:** Click the **Start** button to run a stopped container.
- **Stop:** Click the **Stop** button to stop a running container.
- **Restart:** Click the **Restart** button to quickly restart a container.
- **Redeploy:** Use **Redeploy** when you want Arcane to pull the latest image for one container and recreate it with the same name, mounts, labels, networks, and restart behavior.

### Inspecting a Container

1. Click on a container's name or the **Inspect** button.
2. View detailed information about the container's configuration, state, network, mounts, and logs.

### Compose Tab

If a container belongs to an Arcane-managed compose project, the detail view can show a **Compose** tab.

Arcane loads the compose file that actually defines that service:

- the root compose file when the service lives there
- an included compose file when the service comes from a Compose `include`

For Git-synced projects, the Compose tab stays visible but is read-only.

### Removing a Container

1. In the containers list, find the container you want to remove.
2. Click the **Remove** button (trash icon).
3. Confirm the deletion in the dialog.

> **Note:** You can only remove stopped containers unless you use the force option.

### Viewing Logs

1. Click on a container to open its details.
2. Go to the **Logs** tab to see the container's output and error logs.
3. Use structured view when Arcane detects JSON or logfmt logs.
4. Expand grouped multiline entries when a single log message spans several lines.

### Port Display Options

The containers table is optimized for noisy port lists:

- long port lists collapse behind a `+N` expander in the table
- the view options menu can hide exposed-only ports so the table shows only published host mappings

### Auto-Update Toggle

On the **Overview** tab, Arcane can show an **Auto Update** toggle for the current container.

Use this when you want to opt a single container in or out of Arcane's updater without editing labels or recreating the container. If the container already has an explicit `com.getarcaneapp.arcane.updater` label, that label takes precedence.
