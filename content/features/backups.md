---
title: 'Backups'
description: 'Protect Docker volumes and Arcane itself with encrypted local and S3-compatible backups.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Arcane uses short-lived [Rustic](https://rustic.cli.rs/) containers to create encrypted snapshots. Backups can stay local, be written directly to S3-compatible storage, or use both destinations.

## Local backup storage

The `/backups` mount is used only for local snapshots and local pre-restore safety backups. S3-only backups are written directly to the selected S3 destination and do not store a permanent local copy in `/backups`.

Arcane maps this storage into each temporary Rustic container while it works. If the Arcane container does not have a mount at `/backups`, Arcane uses its fallback Docker volume and shows a warning in the backups UI.

For local storage at a predictable host location, bind-mount a directory:

```yaml
services:
  arcane:
    volumes:
      - /srv/arcane/backups:/backups
```

Alternatively, manage the local backup storage as a named volume in Compose:

```yaml
services:
  arcane:
    volumes:
      - arcane-backups:/backups

volumes:
  arcane-backups:
```

A named volume remains inside Docker storage and may be lost if the Docker host or volume is removed. A bind mount makes the location of the local Rustic backup repository under `/backups` explicit, but it still needs separate protection from host or disk failure.

### Rename the fallback backup volume

Set this environment variable to avoid a name collision with another Docker volume:

```env
ARCANE_BACKUP_VOLUME_NAME=<your-name>
```

The default is `arcane-backups`. This setting only changes the fallback local Docker volume name. It does not change a host path mounted at `/backups` or the location of S3 backups.

> [!IMPORTANT]
> A local backup on the same host does not protect against disk or host failure. Use S3 or copy the local Rustic backup repository under `/backups` to another system for off-site recovery.

## S3 destinations

Open **Settings → Backups** and click **S3 Destinations** to manage reusable storage configurations. Arcane supports AWS S3 and compatible services such as Backblaze B2, MinIO, Hetzner Object Storage, and similar providers.

S3 destinations are managed on the manager instance and synced to remote environments, so the same saved destinations are available for volumes in every environment.

Each destination contains:

- A display name
- Endpoint URL
- Bucket
- Region
- Access key and secret key
- Optional object prefix
- SSL and path-style access options

The region is required for AWS S3. It can be left empty when a custom endpoint does not require one.

When editing a destination, changing any connection field (endpoint, bucket, region, access key, SSL, or path-style) requires re-entering the secret access key.

A destination cannot be deleted while a backup schedule or a retained remote backup still references it.

### Test before saving

The create and edit dialogs require a successful connection test before **Create** or **Save** becomes available. Changing a connection field invalidates the result and requires another test.

The test writes a temporary object, downloads and verifies it, and then deletes it. Saving performs one final round-trip test on the backend so an unreachable destination cannot be persisted through the API.

## Volume backups

Open a volume and select its **Backups** tab. See <Link href="/docs/features/volumes">Volumes</Link> for the rest of the volume-management workflow.

### Create an on-demand backup

Click **Create Backup** for a local backup, or open its dropdown and choose:

- **Local**
- **S3**
- **Local + S3**

Choosing an option that includes S3 opens a dialog for selecting one of the saved S3 destinations.

A completed row records the trigger, storage destination and destination name, size, creation time, and status. Failed runs remain visible with their error and are never treated as usable restore points.

Only one backup, upload, or delete operation runs per volume at a time; starting another while one is in progress is rejected.

A successful backup can also be downloaded from its row actions: Arcane materializes the snapshot and streams it as a `tar.gz` archive.

### Schedule backups

Click **Add schedule** to create an independent backup policy for the volume. A volume can have multiple schedules, each with its own:

- Enabled state
- Six-field cron expression, including seconds
- **Backups to keep** retention count (0–3650)
- Local, S3, or Local + S3 destination
- S3 destination
- **Stop containers during backup** option

For example, `0 0 2 * * *` runs every day at 02:00 in Arcane's configured timezone. Set **Backups to keep** to `0` to keep every restore point. Retention is applied separately to local and remote backups.

Scheduled runs and on-demand runs appear in the same backup table and Activity Center.

### Container consistency

Enable **Stop containers during backup** on a schedule when applications may write to the volume while it is being copied. Arcane stops running containers that use the volume, creates the snapshot, and starts the containers again afterward.

This option belongs to backup schedules; a plain on-demand **Create Backup** does not stop containers.

Leaving containers running avoids downtime, but applications with active writes may produce an inconsistent restore point.

### Backup safety

- Arcane waits for the Rustic container to finish and checks its exit code. A failed attempt remains in the backup table with a **Failed** status and its error; it is not treated as a usable restore point.
- Before a whole-volume or selected-file restore, Arcane stops containers that use the volume and creates a local safety backup. If the safety backup fails, Arcane aborts without restoring any data.
- Rustic restores directly into the target volume. A whole-volume restore uses Rustic's delete mode so files absent from the selected snapshot are removed.
- If a restore fails after it starts writing, the volume may be partially changed. The local safety backup remains available for rollback, and Arcane attempts to restart every container it stopped.

### Encryption

Rustic encrypts every volume backup automatically. You do not need to configure a separate recovery key.

Arcane derives the repository password from its internal `ENCRYPTION_KEY`. Keep the original key if you need to open the repository from another Arcane installation.

> [!WARNING]
> A fresh Arcane instance with a different `ENCRYPTION_KEY` cannot decrypt existing volume-backup repositories.

### Upload an existing local backup

A successful local backup can be uploaded later. Open its row actions and select **Upload to S3** for one of the configured destinations. The row then represents a Local + S3 backup.

### Restore

Arcane can restore the whole volume or selected files. Before changing any data, it creates a local safety backup.

For volumes used by running containers, Arcane stops the affected containers, creates the safety backup, restores the data with Rustic, and starts the containers again.

### Delete and retention

Retention is applied independently per schedule. When a restore point expires, Arcane removes its local and remote Rustic snapshots where possible.

Manual and bulk deletion also attempt to remove every stored copy:

- If every copy is deleted, the row is removed.
- If a local copy is deleted but S3 deletion fails, the row remains as S3-only and Arcane reports the error.
- If a remaining remote copy cannot be deleted, Arcane keeps the row so the backup is not incorrectly reported as gone.

## Arcane system backups

System backups protect Arcane's persistent application data and runtime configuration so a replacement instance can be restored as a clone.

Open **Settings → Backups** (admin only). This feature requires Arcane to run in Docker with `/app/data` mounted and access to its local Docker daemon, and is currently available only with the SQLite database provider.

### Recovery key

System backups use a separate recovery key rather than Arcane's internal volume-backup key:

1. Click **Set up recovery key**. Arcane generates a key of 8 groups of 6 characters.
2. Copy the generated key and store it somewhere outside Arcane.
3. Confirm the key to save it.

The saved copy lets scheduled jobs run unattended. You still need an external copy to recover a lost installation.

> [!WARNING]
> Losing the recovery key makes the snapshots unrecoverable. Existing system backups can only be opened with the key that created them, so Arcane refuses to replace the recovery key until the existing system backups are deleted.

### Manual and scheduled backups

System backups support Local, S3, and Local + S3 destinations. Click **Create schedule** to add schedules with independent cron expressions, destinations, S3 targets, and retention counts.

For an on-demand backup, use a saved schedule's configuration or choose a custom destination. Existing local backups can also be uploaded to S3 later.

The backup table shows each run's status, trigger, destination, size, and creation time. Schedule cards show the latest run's status and time. Use **Find S3 backups** with a destination and recovery key to discover restore points that are not present in the current database.

### Restore Arcane

Restoring replaces the running Arcane installation:

1. Arcane creates and records a local safety backup.
2. A detached recovery helper stops the Arcane container.
3. Rustic restores the selected snapshot into `/app/data`.
4. The helper recreates Arcane with the recovered runtime configuration.
5. The recovered container starts, and the backup and Activity Center records are finalized.

The page disconnects while Arcane restarts. Reload it after the container is available again.

> [!CAUTION]
> A system restore replaces Arcane's current database, users, settings, destinations, secrets, and other persistent application data with the selected restore point.
