---
title: 'Volumes'
description: 'Learn how to manage Docker volumes with Arcane'
---

<script lang="ts">
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

## What Can You Do With Volumes in Arcane?

- **View Volumes:** See a list of all Docker volumes on your system, along with details like name, driver, and usage.
- **Create Volumes:** Add a new volume by providing a name and (optionally) driver or labels.
- **Remove Volumes:** Delete volumes you no longer need. Arcane will warn you if a volume is currently in use by a container.

## Screenshot

<ScreenshotFrame
	src="/img/screenshots/volumes-page.jpeg"
	alt="Volumes page in Arcane"
	caption="Volumes page in Arcane."
	loading="lazy"
	decoding="async"
/>

## How to Use

### Viewing Volumes

1. Go to the **Volumes** section in the sidebar.
2. You'll see a table listing all your Docker volumes.

### Creating a Volume

1. Click the **Create Volume** button.
2. Enter a name for your new volume.
3. (Optional) Choose a driver or add labels if needed.
4. Click **Create**. Your new volume will appear in the list.

### Removing a Volume

1. In the volumes list, find the volume you want to remove.
2. Click the dropdown then the **Delete** button (trash icon) in the list.
3. Confirm the deletion in the dialog.

> **Note:** You cannot remove a volume that is currently used by a container.

## Backups and Restores

Arcane now performs safer backups and restores with clearer safeguards.

### Backup storage and /backups mount warning

Backups are stored in a dedicated Docker volume that is mounted into the helper container at `/backups`. If the Arcane container itself does **not** have a host-backed mount at `/backups`, a warning appears in the backups UI so you know backups live only inside Docker storage. To keep backups on the host, mount a host path into the Arcane container at `/backups`.

### Backup creation now checks exit codes

When a backup is created, Arcane waits for the backup container to finish and checks its exit code. If the `tar` operation fails, the backup is not recorded in the database and you’ll see an error instead of a silent failure.

### Restore is now safer

Restore now extracts the backup into a temporary directory first. Only if extraction succeeds does Arcane wipe the volume and move the extracted data into place. The restore container’s exit code is checked, and failures return an error with a warning that the volume may be partially changed.

## Internal Helper Containers

Arcane creates short‑lived helper containers for volume operations. These containers are labeled `com.getarcaneapp.internal.container=true` and are hidden from the main Containers list by default. If you need to see them, use the **Show Internal Containers** toggle in the Containers view.

## Configuring the Backup Volume Name (New)

To avoid name collisions with user volumes, the backup volume name is now configurable. Set the environment variable:

```
ARCANE_BACKUP_VOLUME_NAME=<your-name>
```

If not set, Arcane defaults to `arcane-backups`.
