---
title: 'Backups'
description: 'Protect Docker volumes and Arcane itself with encrypted local and S3-compatible backups.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Arcane uses short-lived [Rustic](https://rustic.cli.rs/) containers to create encrypted snapshots. Backups can stay local, be written directly to S3-compatible storage, or use both destinations.

| What you need                          | Start here                                                                                                                                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Back up one Docker volume              | <Link href="/docs/features/backups#volume-backups">Volume backups</Link>                                                                                                                                                                          |
| Schedule backups for several volumes   | <Link href="/docs/features/backups#system-managed-volume-backups">System-managed volume backups</Link>                                                                                                                                            |
| Back up Arcane's database and settings | <Link href="/docs/features/backups#arcane-system-backups">Arcane system backups</Link>                                                                                                                                                            |
| Recover data                           | <Link href="/docs/features/backups#restore">Restore a volume</Link>, <Link href="/docs/features/backups#restore-arcane">restore Arcane</Link>, or <Link href="/docs/features/backups#restore-selected-project-files">restore project files</Link> |

For a new backup setup, configure <Link href="/docs/features/backups#local-backup-storage">local storage</Link> or an <Link href="/docs/features/backups#s3-destinations">S3 destination</Link> first. Volume backups need the original `ENCRYPTION_KEY` for recovery; system backups use a separate recovery key.

## Local backup storage

Mount `/backups` for local snapshots and pre-restore safety backups. Without it, Arcane uses a fallback Docker volume and warns in the UI. S3-only backups go directly to S3 without a permanent local copy.

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

Removing a named volume deletes its backups. Neither a named volume nor a bind mount protects against host or disk failure.

### Rename the fallback backup volume

Set this environment variable to avoid a name collision with another Docker volume:

```env
ARCANE_BACKUP_VOLUME_NAME=<your-name>
```

The default is `arcane-backups`. This changes only the fallback volume name, not bind mounts or S3 locations.

> [!IMPORTANT]
> A local backup on the same host does not protect against disk or host failure. Use S3 or copy the local Rustic backup repository under `/backups` to another system for off-site recovery.

## S3 destinations

Configure AWS S3 or a compatible service under **Settings → Backups → S3 Destinations**. Destinations sync from the manager to all remote environments.

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

**Create** and **Save** require a successful test that writes, downloads, verifies, and deletes a temporary object. Retest after changing connection fields. Arcane also tests during saves through the API.

## Volume backups

Open a volume and select its **Backups** tab. See <Link href="/docs/features/volumes">Volumes</Link> for the rest of the volume-management workflow.

### Create an on-demand backup

Click **Create Backup** for a local backup, or open its dropdown and choose:

- **Local**
- **S3**
- **Local + S3**

Choosing an option that includes S3 opens a dialog for selecting one of the saved S3 destinations.

The table records each run's trigger, destination, size, time, and status. Failed runs show their error and can't be restored.

Only one backup, upload, or delete operation can run on a volume at a time. Wait for it to finish before starting another.

To download a successful backup, open its row actions. Arcane reads the snapshot and sends it to your browser as a `tar.gz` archive.

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

### Encryption

Volume backups use a password derived from `ENCRYPTION_KEY`; no separate recovery key is needed. Keep that key to open the repository from another installation.

> [!WARNING]
> A fresh Arcane instance with a different `ENCRYPTION_KEY` cannot decrypt existing volume-backup repositories.

### Upload an existing local backup

A successful local backup can be uploaded later. Open its row actions and select **Upload to S3** for one of the configured destinations. The row then represents a Local + S3 backup.

### Restore

Restore the whole volume or selected files. Arcane stops containers using the volume and creates a local safety backup before writing. If that backup fails, the restore is cancelled.

Rustic writes directly to the volume. Whole-volume restores delete files absent from the snapshot. If a restore fails, the volume may be partially changed; use the safety backup to roll back. Arcane attempts to restart every container it stopped.

### Delete and retention

Retention is applied independently per schedule. When a restore point expires, Arcane removes its local and remote Rustic snapshots where possible.

Manual and bulk deletion also attempt to remove every stored copy:

- If every copy is deleted, the row is removed.
- If a local copy is deleted but S3 deletion fails, the row remains as S3-only and Arcane reports the error.
- If a remaining remote copy cannot be deleted, Arcane keeps the row so the backup is not incorrectly reported as gone.

## System-managed volume backups

To back up multiple local volumes, create a **Docker volumes** schedule under **Settings → Backups** as an admin. Set its schedule, retention, destination, and container-stop option as above, then choose:

- **All volumes** — every current and future non-internal volume.
- **Allowlist** — only the selected volume names. New volumes are excluded until you select them.
- **Blocklist** — every volume except the selected names. New volumes are included automatically.

Each run checks Docker's current volume list. Enable **Ignore anonymous volumes** to exclude them. **Run now** reports matched, successful, failed, and skipped volumes.

Results appear in each volume's **Backups** tab as **System-managed**, alongside **Volume-managed** backups. Retention applies per schedule.

## Arcane system backups

System backups save Arcane's application data and runtime configuration. Open **Settings → Backups** as an admin. Arcane must use SQLite, run in Docker with `/app/data` mounted, and have access to its local Docker daemon.

### Recovery key

System backups use a separate recovery key rather than Arcane's internal volume-backup key:

1. Open **Recovery key** and choose **Create recovery key**. Arcane generates a key of 8 groups of 6 characters.
2. Copy the generated key and store it somewhere outside Arcane.
3. Confirm the key to save it.

Arcane saves a copy for scheduled jobs. Keep your own copy for recovery.

If you already have a key from another Arcane installation, choose **Import recovery key** from the same dropdown and enter it. Use the same key when opening its existing system backups.

To generate a replacement, choose **Reset recovery key** and confirm. Save the new key outside Arcane before using it.

> [!WARNING]
> Losing the recovery key makes the snapshots unrecoverable. Existing system backups can only be opened with the key that created them, so Arcane refuses to replace the recovery key until the existing system backups are deleted.

### Manual and scheduled backups

System backups support Local, S3, and Local + S3 destinations. Click **Create schedule** to add schedules with independent cron expressions, destinations, S3 targets, and retention counts.

For an on-demand backup, use a saved schedule's configuration or choose a custom destination. Existing local backups can also be uploaded to S3 later.

Use **Find S3 backups** with a destination and recovery key to find restore points missing from the current database.

When a backup exists both locally and on S3, restores and file browsing automatically fall back to the other copy if one can't be read.

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

### Restore selected project files

Choose **Restore files** from a successful backup's row menu. Select project files or folders in the browser, or use **Select all**.

- The dialog needs the recovery key. When a key is stored, the file tree loads right away; otherwise enter the key and click **Load files**.
- Before writing anything, Arcane creates a complete local safety backup. Arcane and project containers keep running throughout — no restart.
- Selected files overwrite the existing files at those paths. Restoring a folder also removes files inside it that are not in the snapshot.
- If any file fails to restore, the files already restored are rolled back from the safety backup.

Database, settings, secrets, and other application data require a full system restore.

Browsing a backup's files needs the `system-backups:read` permission and restoring needs `system-backups:restore`; both are admin-only.
