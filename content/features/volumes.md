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

## Back up and restore

Open a volume and select **Backups** to create or schedule encrypted Rustic snapshots. Backups can use local storage, an S3-compatible destination, or both.

Arcane supports multiple schedules per volume, retention policies, optional container shutdown for consistent snapshots, whole-volume restores, selected-file restores, and local safety backups before a restore.

See <Link href="/docs/features/backups">Backups</Link> for storage setup, S3 destinations, encryption, scheduling, retention, and recovery instructions.

## Helper containers

Arcane creates short-lived Rustic containers for backup and restore work. They carry the label `com.getarcaneapp.internal.resource=true` and are hidden from the Containers list by default. Toggle **Show Internal Containers** in the Containers view to see them.
