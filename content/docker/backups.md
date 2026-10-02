---
title: 'Backups'
description: 'Back up Docker volumes and Arcane itself to local storage or S3-compatible storage.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
import { Link } from '#lib/components/ui/link/index.js';
</script>

Arcane can back up your Docker volumes and its own data (database, settings, and runtime configuration), on demand or on a schedule. Backups are stored on local storage mounted at `/backups`, in an S3-compatible bucket, or in both.

Backups are encrypted snapshots made with [Rustic](https://rustic.cli.rs/), an open-source backup tool that Arcane runs in short-lived containers. Before your first backup, set up storage and a recovery key.

## Set up backup storage

### Mount local storage

Local backups and the safety backups taken before a restore are written to `/backups` inside the Arcane container. Mount a host directory there so they land in a predictable place:

```yaml
services:
  arcane:
    volumes:
      - /srv/arcane/backups:/backups
```

Or use a named volume:

```yaml
services:
  arcane:
    volumes:
      - arcane-backups:/backups

volumes:
  arcane-backups:
```

Removing a named volume deletes its backups. Without a `/backups` mount, Arcane uses a fallback Docker volume named `arcane-backups` and shows a warning in the UI; set `ARCANE_BACKUP_VOLUME_NAME` if that name collides with another volume. S3-only backups don't keep a permanent local copy.

> [!IMPORTANT]
> Backups on the same host don't survive a disk or host failure. Use S3, or copy the Rustic repository under `/backups` to another system.

### Add an S3 destination

1. Open **Settings → Backups → S3 Destinations**.
2. Enter the connection details (see [S3 destination fields](#s3-destination-fields)).
3. Test the destination. **Create** and **Save** need a passing test, which writes, downloads, verifies, and deletes a temporary object.
4. Save.

Destinations sync from the manager to all remote environments. When you change the endpoint, bucket, region, access key ID, SSL, or path-style setting, re-enter the secret access key and test again. A destination can't be deleted while a schedule or a retained remote backup still uses it.

## Recovery key

The recovery key encrypts system backups and volume backups. Without it, snapshots can't be restored, so keep a copy outside Arcane.

1. Open **Settings → Backups → Recovery key** and choose **Create recovery key**. Arcane generates a key of 8 groups of 6 characters.
2. Copy the key and store it somewhere outside Arcane. It isn't shown again.
3. Confirm the key to save it.

Arcane keeps a copy for scheduled jobs. To use a key from another installation, choose **Import recovery key** instead. To replace the key, choose **Reset recovery key**.

> [!WARNING]
> Losing the recovery key makes the snapshots unrecoverable. Arcane refuses to reset the key while system backups made with the current key still exist, because they can only be opened with the key that created them.

Volume backups made before any recovery key was set use a password derived from `ENCRYPTION_KEY`. When you set a recovery key, Arcane tries to move its existing volume backup repositories to the new key. Repositories that belong to another Arcane instance must be moved by that instance.

> [!WARNING]
> Keep your original `ENCRYPTION_KEY` until you've confirmed older volume backups open with the recovery key. A recovery key imported on a fresh installation can't unlock a repository that still uses the old password.

## Volume backups

Open a volume and select its **Backups** tab. The rest of the volume workflow is on <Link href="/docs/docker/volumes">Volumes</Link>.

### Create a backup

Click **Create Backup** for a local backup, or open its dropdown and choose **Local**, **S3**, or **Local + S3**. Options that include S3 ask which saved destination to use.

The table shows each run's trigger, destination, size, time, and status. Failed runs show their error and can't be restored. Only one backup, upload, or delete can run on a volume at a time.

From a successful backup's row actions you can:

- **Upload to S3**: copy a local backup to a destination, turning it into a Local + S3 backup.
- Download it as a `tar.gz` archive.

### Schedule backups

Click **Add schedule**. A volume can have several schedules, each with these settings:

| Setting                           | What it does                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Enabled                           | Turns the schedule on or off.                                                                               |
| Schedule                          | Six-field cron expression with seconds, in Arcane's configured timezone. `0 0 2 * * *` runs daily at 02:00. |
| **Backups to keep**               | How many restore points to keep, 0 to 3650. `0` keeps all of them.                                          |
| Destination                       | **Local**, **S3**, or **Local + S3**. If S3 is included, also pick the S3 destination.                      |
| **Stop containers during backup** | Stops running containers that use the volume, takes the snapshot, then starts them again.                   |

Turn on **Stop containers during backup** for applications that write to the volume constantly, such as databases; otherwise the restore point may be inconsistent. Leaving it off avoids downtime. On-demand **Create Backup** never stops containers.

Scheduled and on-demand runs appear in the same table and in the Activity Center.

<ScreenshotFrame
  src="/img/screenshots/backup-schedule.jpeg"
  alt="A volume backup schedule set for 2 AM with seven backups retained."
  caption="Choose when to back up a volume, how many snapshots to keep, and where to store them."
  loading="lazy"
  decoding="async"
/>

### Restore a volume

Restore the whole volume or selected files. For an existing volume, Arcane stops the containers using it and takes a local safety backup first; if that fails, the restore is cancelled. Arcane restarts every container it stopped.

Rustic writes directly to the volume, and a whole-volume restore deletes files that aren't in the snapshot. If a restore fails partway, roll back with the safety backup. Restoring a backup for a volume that doesn't exist creates the volume, with no safety backup.

### Delete backups and retention

Retention runs separately for each schedule, and separately for local and S3 copies. When a restore point expires, Arcane removes its local and S3 snapshots where possible.

Deleting backups by hand also tries to remove every stored copy. If the local copy is deleted but S3 deletion fails, the row stays as S3-only and Arcane reports the error. If any remote copy can't be deleted, the row stays, so the backup isn't wrongly shown as gone.

### System-managed volume backups

To back up many volumes with one schedule, an admin can open **Settings → Backups**, click **Create schedule**, and choose the **Volume** type. Set the schedule, retention, destination, and stop-containers option as above, then pick which volumes to include:

| Mode            | Included volumes                                                               |
| --------------- | ------------------------------------------------------------------------------ |
| **All volumes** | Every current and future volume, except Arcane's internal ones.                |
| **Allowlist**   | Only the selected volumes. New volumes are left out until you select them.     |
| **Blocklist**   | Every volume except the selected ones. New volumes are included automatically. |

Each run reads Docker's current volume list. Turn on **Ignore anonymous volumes** to skip unnamed volumes. **Run now** reports matched, successful, failed, and skipped volumes. The results show up in each volume's **Backups** tab as **System-managed**, next to **Volume-managed** backups.

## Back up Arcane itself

System backups save Arcane's application data and runtime configuration so you can recover the whole installation. They need SQLite, Arcane running in Docker with `/app/data` mounted, access to the local Docker daemon, and a [recovery key](#recovery-key).

### Create and schedule system backups

Open **Settings → Backups** as an admin. Click **Create schedule** and choose the **System** type to add a schedule with its own cron expression, destination (**Local**, **S3**, or **Local + S3**), S3 destination, and retention. For a one-off backup, reuse a saved schedule's configuration or pick a destination. Local backups can be uploaded to S3 later.

When a backup exists both locally and on S3, restores and file browsing use the other copy if one can't be read.

### Restore Arcane

> [!CAUTION]
> A system restore replaces Arcane's current database, users, settings, destinations, secrets, and other application data with the selected restore point.

1. Arcane creates and records a local safety backup.
2. A detached recovery helper stops the Arcane container.
3. Rustic restores the snapshot into `/app/data`.
4. The helper recreates Arcane with the recovered runtime configuration.
5. Arcane starts, and the backup and Activity Center records are finalized.

The page disconnects while Arcane restarts. Reload it once the container is back.

### Restore selected project files

1. Choose **Restore files** from a successful backup's row menu.
2. If no recovery key is stored, enter it and click **Load files**.
3. Select project files or folders, or use **Select all**, and restore.

Arcane first takes a full local safety backup; Arcane and project containers keep running. Selected files overwrite the files at those paths, and restoring a folder also removes files in it that aren't in the snapshot. If any file fails, the files already restored are rolled back. Database, settings, and secrets need a full system restore.

Browsing backup files needs `system-backups:read` and restoring needs `system-backups:restore`. Both are admin-only.

## Recover backups on another installation

1. Import the original key under **Settings → Backups → Recovery key → Import recovery key**.
2. Add the S3 destination with the same bucket and object prefix.
3. Open **Settings → Backups** to see the restore points Arcane found.

With a recovery key stored, Arcane looks for existing system and volume backups whenever you save an S3 destination or open the Backups page. It searches each instance directory in the destination and lists every snapshot it can decrypt; a failure in one directory doesn't stop the others. **Find S3 backups** runs the same search on demand for system backups.

## Reference

### S3 destination fields

| Field                     | Notes                                                                |
| ------------------------- | -------------------------------------------------------------------- |
| Name                      | Display name.                                                        |
| Endpoint URL              | The S3 or S3-compatible endpoint.                                    |
| Bucket                    | Bucket that holds the backups.                                       |
| Region                    | Required for AWS S3. Can be empty for endpoints that don't need one. |
| Access key and secret key | Credentials for the bucket.                                          |
| Object prefix             | Optional path inside the bucket.                                     |
| SSL and path-style access | Connection options for S3-compatible services.                       |

### Environment variables

| Variable                    | Default          | Purpose                                                                                           |
| --------------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `ARCANE_BACKUP_VOLUME_NAME` | `arcane-backups` | Name of the fallback volume used when `/backups` isn't mounted. Doesn't affect bind mounts or S3. |
