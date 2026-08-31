---
title: 'Volumes'
description: 'Manage Docker volumes in Arcane, including backups and restores.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
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

## Rename a volume

A volume that is not in use by any container can be renamed from its row dropdown. Arcane copies the volume data to a volume with the new name, then removes the original.

> [!NOTE]
> Renaming a deployment-managed volume doesn't update the project that references it — the project may recreate the original volume on its next deploy unless you update its configuration to the new name.

## Volume Workspace

Open a volume and switch to the **Workspace** tab to work with the files inside it — no need to stop the containers using it. The workspace shows a file tree next to a tabbed text editor, the same layout the project workspace uses.

From the workspace you can:

- **Browse and edit** — open any UTF-8 text file in a tab and change it.
- **New File** / **New Folder** — create files and folders anywhere in the volume.
- **Upload Files** — add one or more files from your computer; you're asked before existing files are replaced.
- **Download** — stream any file, including binary files, to your computer.
- **Rename**, **Move**, and **Delete** — reorganize the volume contents.
- **Restore a file from a backup** — pull a single file out of an existing volume backup instead of restoring the whole volume.

Files you create or change through the workspace are written with the user and group of the container that uses the volume (when that container sets a numeric `user:`), instead of as root — so the application keeps permission over its own files.

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

Open a volume and select **Backups** to create or schedule encrypted Rustic snapshots. Backups can use local storage, an S3-compatible destination, or both.

Arcane supports multiple schedules per volume, retention policies, optional container shutdown for consistent snapshots, whole-volume restores, selected-file restores, and local safety backups before a restore.

Volumes can also be backed up centrally with one schedule covering many volumes — see <Link href="/docs/features/backups#system-managed-volume-backups">System-managed volume backups</Link>.

See <Link href="/docs/features/backups">Backups</Link> for storage setup, S3 destinations, encryption, scheduling, retention, and recovery instructions.

## Helper containers

Arcane creates helper containers for backup, restore, and workspace access. They carry the label `com.getarcaneapp.internal.resource=true` and are hidden from the Containers list by default. Toggle **Show Internal Containers** in the Containers view to see them.

Backup and restore work runs in short-lived Rustic containers. The workspace helper mounts the volume and stays around between operations so browsing feels instant; it is removed after sitting idle for the **Volume Helper Idle Timeout** (default 10 minutes, `0` disables the reaper).
