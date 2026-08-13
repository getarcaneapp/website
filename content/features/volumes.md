---
title: 'Volumes'
description: 'Manage Docker volumes in Arcane, including backups and restores.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
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

## Volume Workspace

Open a volume and switch to the **Workspace** tab to work with the files inside it — no need to stop the containers using it. The workspace shows a file tree next to a tabbed text editor, the same layout the project workspace uses.

From the workspace you can:

- **Browse and edit** — open any UTF-8 text file in a tab and change it.
- **New File** / **New Folder** — create files and folders anywhere in the volume.
- **Upload Files** — add one or more files from your computer; you're asked before existing files are replaced.
- **Download** — stream any file, including binary files, to your computer.
- **Rename**, **Move**, and **Delete** — reorganize the volume contents.
- **Restore a file from a backup** — pull a single file out of an existing volume backup instead of restoring the whole volume.

Edits are staged locally and applied together when you **Save**. If someone else changed the volume in the meantime, the save is rejected with _"Volume workspace changed; refresh it and try again"_ — refresh and reapply.

A few limits to keep in mind:

- Binary files, symlinks, and special files are read-only in the editor; binary files can still be uploaded, downloaded, and moved.
- Files larger than the configured maximum (default 10 MiB) can't be edited in place.
- Very deep or very large trees are truncated by the configured depth and entry limits, and the workspace tells you when that happens.
- Volumes that use a custom mount configuration (bind-style driver options) can't be opened in the workspace.

The size and tree limits are configurable with the `VOLUME_WORKSPACE_MAX_FILE_SIZE_MB` (default 10), `VOLUME_WORKSPACE_MAX_DEPTH` (default 50), and `VOLUME_WORKSPACE_MAX_ENTRIES` (default 10000) environment variables.

Write access follows the volume permissions: creating and editing files needs `volumes:upload`, deleting needs `volumes:delete`, renaming or moving needs both, and restoring a file from a backup needs `volumes:backup`. Browsing and downloading only need `volumes:read`.

> [!NOTE]
> The Workspace tab replaces the old volume **Browser**. The legacy `volumes:browse` permission is migrated to `volumes:read` automatically for existing roles and API keys.

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

Arcane creates helper containers for backup, restore, and workspace access. They carry the label `com.getarcaneapp.internal.resource=true` and are hidden from the Containers list by default. Toggle **Show Internal Containers** in the Containers view to see them.

Backup and restore helpers are short-lived. The workspace helper mounts the volume and stays around between operations so browsing feels instant; it is removed after sitting idle for the **Volume Helper Idle Timeout** (default 10 minutes, `0` disables the reaper).
