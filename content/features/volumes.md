---
title: 'Volumes'
description: 'Manage Docker volumes in Arcane, including backups and restores.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

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

Open **Workspace** to work with files while containers keep running:

- **Browse and edit** — open any UTF-8 text file in a tab and change it.
- **New File** / **New Folder** — create files and folders anywhere in the volume.
- **Upload Files** — add one or more files from your computer; you're asked before existing files are replaced.
- **Download** — stream any file, including binary files, to your computer.
- **Rename**, **Move**, and **Delete** — reorganize the volume contents.
- **Restore a file from a backup** — pull a single file out of an existing volume backup instead of restoring the whole volume.

If the container sets a numeric `user:`, workspace writes use that user and group instead of root.

Edits are staged locally and applied together when you **Save**. If someone else changed the volume in the meantime, the save is rejected with _"Volume workspace changed; refresh it and try again"_ — refresh and reapply.

- Binary files, symlinks, and special files are read-only in the editor; binary files can still be uploaded, downloaded, and moved.
- Files larger than the configured maximum (default 10 MiB) can't be edited in place.
- Very deep or very large trees are truncated by the configured depth and entry limits, and the workspace tells you when that happens.
- Volumes that use a custom mount configuration (bind-style driver options) can't be opened in the workspace.

The size and tree limits are configurable with the `VOLUME_WORKSPACE_MAX_FILE_SIZE_MB` (default 10), `VOLUME_WORKSPACE_MAX_DEPTH` (default 50), and `VOLUME_WORKSPACE_MAX_ENTRIES` (default 10000) environment variables.

Write access follows the volume permissions: creating and editing files needs `volumes:upload`, deleting needs `volumes:delete`, renaming or moving needs both, and restoring a file from a backup needs `volumes:backup`. Browsing and downloading only need `volumes:read`.

> [!NOTE]
> The Workspace tab replaces the old volume **Browser**. The legacy `volumes:browse` permission is migrated to `volumes:read` automatically for existing roles and API keys.

## Back up and restore

Open **Backups** to create or schedule local and S3 snapshots, or restore data. See <Link href="/docs/features/backups">Backups</Link> for setup and recovery, or <Link href="/docs/features/backups#system-managed-volume-backups">System-managed volume backups</Link> to schedule multiple volumes together.

## Helper containers

Arcane creates helper containers for backup, restore, and workspace access. They carry the label `com.getarcaneapp.internal.resource=true` and are hidden from the Containers list by default. Toggle **Show Internal Containers** in the Containers view to see them.

Backups and restores run in short-lived Rustic containers. The workspace helper keeps the volume mounted between operations so it doesn't need to start again each time you browse. Arcane removes it after the **Volume Helper Idle Timeout**, which defaults to 10 minutes. Set it to `0` to disable idle cleanup.
