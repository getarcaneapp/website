---
title: 'Containers'
description: 'Manage Docker containers from Arcane.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

Use **Containers** for individual Docker containers and [Projects](/docs/features/projects) for Compose services.

<ScreenshotFrame
	src="/img/screenshots/containers-page.jpeg"
	alt="Containers page in Arcane"
	caption="Containers page in Arcane."
	loading="lazy"
	decoding="async"
/>

## Browse containers

Open **Containers** in the sidebar. The table shows name, ID, image, and status for containers on the host.

If you have a lot of published ports, the table collapses long port lists behind a `+N` expander. The view options menu can also hide exposed-only ports so you only see published host mappings.

### Filter by Docker label

Use the **Labels** filter to enter a label key, such as `com.example.team`, or an exact key and value, such as `com.example.team=media`. A key on its own matches containers that have that label, regardless of its value.

### Hide containers from the list

Set the Docker label `com.getarcaneapp.arcane.hidden=true` to hide a container from the default list and dashboard counts. Turn on **Show hidden containers** in the table's view options to see it again.

For Compose services, you can set `x-arcane.hidden` instead. See <Link href="/docs/guides/custom-metadata#hide-containers">Hide containers</Link> for an example and project-wide defaults.

## Create a container

1. Click **Create Container**.
2. Fill in name and image. The other fields (ports, volumes, environment variables, restart policy, and so on) are optional.
3. Click **Create**.

## Start, stop, restart, pause, kill

- **Start** / **Stop** / **Restart** — change the running state.
- **Pause** / **Unpause** — suspend and resume all processes in the container. Requires `containers:pause`.
- **Kill** — send a signal to the container's main process. Requires `containers:kill`.
- **Redeploy** — pull the latest image and recreate the container with the same name, mounts, labels, networks, and restart policy. Use this to update a single container in place.

## Edit a container

Choose **Edit** from a container's detail page or row menu to change its image, ports, mounts, variables, restart policy, networks, resource limits, or Linux capabilities. Network options include static IPv4 addresses and aliases. Editing requires `containers:edit`; network connections also require `networks:connect` / `networks:disconnect`.

Applying changes **recreates** the container. Arcane asks you to confirm, then stops it, recreates it with the new configuration, and starts it with a new container ID. If recreation fails, Arcane restores the original container. Containers that use auto-remove can't be restored this way.

- Options of existing mounts are preserved.
- The new image is only pulled if it is not already present locally.

## Convert a container to a Compose project

Enable **Experimental Features** in the sidebar's version dialog with `settings:write`. Standalone containers then offer **Convert to Compose** on their detail page, row menu, or in bulk from the table. This requires `projects:create`.

The action opens the new-project page with a generated Compose file in the editor. Check the bind mounts, networks, and environment values, make any changes you need, then click **Create Project**.

Original containers keep running by default. Stop them before deploying to avoid name and port conflicts. With `containers:delete`, select **Remove original container(s) after creation** to delete them at project creation, before deployment. Deletion can't be undone.

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
