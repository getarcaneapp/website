---
title: 'Volumes'
description: 'Manage Docker volumes in Arcane, including backups and restores.'
---

<script lang="ts">
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

The **Volumes** page lists every Docker volume on the selected host and lets you create, remove, and back up volumes.

<ScreenshotFrame
	src="/img/screenshots/volumes-page.jpeg"
	alt="Volumes page in Arcane"
	caption="Volumes page in Arcane."
	loading="lazy"
	decoding="async"
/>

## Browse volumes

Open **Volumes** in the sidebar. The table shows name, driver, and current usage for each volume.

## Create a volume

1. Click **Create Volume**.
2. Enter a name.
3. Optional: pick a driver or add labels.
4. Click **Create**.

## Remove a volume

1. Open the row's dropdown and click the trash icon.
2. Confirm.

> [!NOTE]
> A volume in use by a container can't be removed.

## Back up and restore

Arcane runs a short-lived helper container to `tar` the volume contents into a backup, and reverses the process on restore.

### Backup storage

Backups are stored in a dedicated Docker volume mounted into the helper container at `/backups`. If the Arcane container itself doesn't have a host-backed mount at `/backups`, the backups UI shows a warning so you know backups only live inside Docker storage.

To keep backups somewhere predictable, mount a host path or named volume to `/backups` in your `compose.yaml`:

- Host path: `/srv/arcane/backups:/backups`
- Named volume: `arcane-backups:/backups`

If you use a named volume, declare it under the top-level `volumes:` section too.

### Backup safety

- Arcane waits for the backup container to finish and checks its exit code. If `tar` fails, the backup isn't recorded — you get an error instead of a silent failure.
- Restore extracts the backup into a temporary directory first. Only after extraction succeeds does Arcane wipe the volume and move the data into place. If the restore container exits non-zero, you get an error noting that the volume may be partially changed.

### Rename the backup volume

Set this environment variable to avoid name collisions with your own volumes:

```
ARCANE_BACKUP_VOLUME_NAME=<your-name>
```

Default: `arcane-backups`.

## Helper containers

Arcane creates short-lived helper containers for backup and restore work. They carry the label `com.getarcaneapp.internal.container=true` and are hidden from the Containers list by default. Toggle **Show Internal Containers** in the Containers view to see them.
