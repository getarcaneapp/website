---
title: 'Containers'
description: 'Manage Docker containers from Arcane.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

The **Containers** page lists every container on your Docker host and lets you start, stop, pause, kill, inspect, commit, and remove them. Use it for one-off containers; for grouped services, see [Projects](/docs/features/projects).

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

## Start, stop, restart, pause, kill

Each container row has action buttons:

- **Start** / **Stop** / **Restart** — change the running state.
- **Pause** / **Unpause** — suspend and resume all processes in the container. Requires `containers:pause`.
- **Kill** — send a signal to the container's main process. Requires `containers:kill`.
- **Redeploy** — pull the latest image and recreate the container with the same name, mounts, labels, networks, and restart policy. Use this to update a single container in place.

## Edit a container

Open a container's detail page (or its row menu) and choose **Edit** to change the container's configuration — image, ports, volumes and bind mounts, environment variables, restart policy, network settings (including static IPv4 addresses and aliases), resource limits (memory, CPU shares), and Linux capabilities. Editing requires the `containers:edit` permission; connecting or disconnecting networks also needs `networks:connect` / `networks:disconnect`.

Applying changes **recreates** the container: it is stopped, recreated with the new configuration, and restarted, and it comes back with a new container ID. Arcane asks you to confirm before doing this. If recreation fails, Arcane restores the original container — unless the container uses auto-remove, in which case the original can't be brought back.

A couple of details:

- Options of existing mounts are preserved.
- The new image is only pulled if it is not already present locally.

## Convert a container to a Compose project

With **Experimental Features** enabled (toggle in the version dialog, opened from the sidebar — requires `settings:write`), containers that aren't already part of a Compose project get a **Convert to Compose** action on the detail page and in the row menu. The containers table also has a bulk version for converting several containers at once.

The action takes you to the new-project page with a generated compose file pre-filled in the editor. Review and edit the YAML — generated output often needs a look over for bind mounts, networks, and environment values — then click **Create Project**.

The original containers keep running by default. If you have the `containers:delete` permission, the create dialog offers a **Remove original container(s) after creation** checkbox; removal happens right after the project is created, before it is deployed, and can't be undone. If you leave the originals running, deploy the new project only after stopping them, or names and ports may collide.

Seeing the action requires the `projects:create` permission.

## Commit a container to an image

Open a container detail page and click **Commit** to create a new image from the container's current filesystem. You can set:

- repository and tag
- commit comment
- author
- whether Docker should skip its default pause during commit

The new image appears on the **Images** page after the commit finishes. Committing requires `images:commit`.

## Inspect a container

Click a container's name or its **Inspect** button to open the detail view. Tabs cover configuration, network settings, mounts, and logs.

### Compose tab

If the container belongs to an Arcane-managed Compose project, the detail view also shows a **Compose** tab with the source compose file:

- the root compose file when the service is defined there
- an included compose file when the service comes from a Compose `include`

For Git-synced projects, this tab is read-only.

### Auto-update toggle

The **Overview** tab has an **Auto Update** toggle for opting a single container in or out of Arcane's updater. If the container already has an explicit `com.getarcaneapp.arcane.updater` label, that label wins.

When a newer image is available, the detail header shows an **Update available** badge and an **Update** action to apply it on the spot (requires the `containers:autoupdate` permission). If the container belongs to a project, the header links to that project too.

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
