---
title: "Auto Updates"
description: "Keep containers and Compose projects on newer images without clicking Update."
---

## Turn on auto updates

1. Open **Settings → Automations** and pick the agent.
2. Find the **Updates** section.
3. Turn on **Image Update Watcher** and pick or enter a schedule.
4. Turn on **Auto Update** and set its schedule. It needs **Image Update Watcher** on.
5. Optional: set **Update Delay (hours)**. See [Delay new images](#delay-new-images).
6. Optional: under **Excluded Containers**, pick containers that should never update automatically.
7. Click **Save**.

To scan new images first and block the ones with too many vulnerabilities, see [Block vulnerable updates](/docs/security/vulnerability-scans#block-vulnerable-updates).

Schedules are five-field cron expressions (`minute hour day month weekday`) or descriptors like `@daily` and `@every 6h`. They run in the timezone shown in the schedule dialog; set `TZ` to change it (see [Timezone and scheduled jobs](/docs/reference/environment-variables#timezone-and-scheduled-jobs)). Arcane doesn't enforce a minimum interval, so avoid very frequent checks against rate-limited registries.

Requirements:

- Images must come from registries Arcane can reach. Store private credentials under [Container Registries](/docs/docker/images#private-registries).
- Arcane must be able to recreate each container with the same ports, mounts, environment, and labels.
- On Podman hosts, Quadlet containers are skipped so they stay under systemd's control. Use [Podman auto-update](/docs/podman/auto-update) for those.

## Delay new images

Set **Update Delay (hours)** to wait after Arcane first detects a new image. `0` installs it at the next scheduled run. Manual updates ignore this delay.

| Setting    | Value                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| Default    | `0`                                                                                                         |
| Maximum    | `8760` hours (one year)                                                                                     |
| Applies to | The **Auto Update** schedule only. **Update**, **Update All**, and other manual updates install right away. |

Waiting updates stay on the **Updates** page. They install on the first scheduled run after the delay ends.

### When the timer resets

- The timer starts when Arcane first detects the new digest or version, not at the build date the publisher sets.
- It restarts when the target changes: a newer version, or a tag republished with a new digest.
- It restarts when the update stops being pending (installed or rolled back).
- A failed check doesn't reset it.

### Override the delay for one container

Set the delay in Compose or as a label, in whole hours. A per-container value, including `0`, wins over the agent setting.

```yaml
x-arcane:
  updater:
    delay: 72 # project default, in hours

services:
  app:
    image: ghcr.io/acme/app:latest
  cache:
    image: redis:7
    x-arcane:
      updater:
        delay: 0 # this service updates immediately
```

```yaml
labels:
  - com.getarcaneapp.arcane.updater.delay=72
```

- Compose values above `8760` or below `0` are rejected.
- A label above `8760` is treated as `8760`.

## Apply updates by hand

Open **Updates**. It lists pending updates from every agent, in **Containers** and **Projects** tabs. **Release notes** in a row's menu opens the new version's release notes; see [Release notes](/docs/docker/images#release-notes).

| Action                               | What it does                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Update Container** or **Update**   | Updates one row, or the selected rows, after you confirm.                                                                                                                       |
| **Disable/Enable automatic updates** | Turns automatic installation off or on for one container. Disabled rows still get checks and notifications. If it shows _Controlled by Docker label_, change the label instead. |
| **Update All**                       | Applies every pending update on every agent you can update, including rows not on the current page.                                                                             |

Other places to update:

- **Containers → Update Containers** runs the same **Update All**, after you confirm.
- **Projects → Update Projects** confirms, checks every image, and redeploys each project that has an update.
- To check one Compose project now, open its update indicator and select **Re-check Updates**. Arcane shows a result per service from saved policies, even while the project is stopped.

> [!IMPORTANT]
> **Updates → Update All** updates your containers and projects. **Agents → Update All** upgrades Arcane managers and agents (see [Remote Agents](/docs/remote/agents)). If Arcane's own container has a pending update, **Updates → Update All** includes it and restarts Arcane after the other updates finish. The confirmation tells you when this applies.

## Per-container labels

Set these labels on a container, or under a service's `labels` in Compose. The full list is in [Compose Labels](/docs/reference/compose-labels).

Boolean labels accept `true`, `1`, `yes`, `on` and `false`, `0`, `no`, `off`, in any case.

### Disable automatic updates for one container

```yaml
labels:
  - com.getarcaneapp.arcane.updater=false
```

Arcane stops installing updates for the container. It still checks it, lists it on **Updates**, and sends notifications. The container's **Auto Update** toggle and the **Disable automatic updates** action do the same. An explicit label always wins over the UI.

For a standalone container:

```bash
docker run -d \
  --name myapp \
  --label com.getarcaneapp.arcane.updater=false \
  ghcr.io/acme/myapp:latest
```

### Disable update checks for one container

```yaml
labels:
  - com.getarcaneapp.arcane.update-check=false
```

This stops checks and notifications. It doesn't stop automatic installation. To leave a container alone entirely, set both `updater=false` and `update-check=false`.

| Configuration                            | Checks and notifications | Automatic installation |
| ---------------------------------------- | ------------------------ | ---------------------- |
| No labels, not excluded in the UI        | Yes                      | Yes                    |
| `updater=false` or excluded in the UI    | Yes                      | No                     |
| `update-check=false`                     | No                       | Yes                    |
| `updater=false` and `update-check=false` | No                       | No                     |

- `x-arcane.update-check: false` sets the same label, for the whole project or one service.
- An image is skipped only when every container using it opts out.
- Images with no running container are always checked. Single-image checks from **Images** still work.
- Older agents may still skip checks for containers with automatic updates disabled, until you upgrade them.

### Set restart order and stop signal

```yaml
services:
  myapp:
    image: ghcr.io/acme/myapp:latest
    labels:
      - com.getarcaneapp.arcane.depends-on=db,redis
      - com.getarcaneapp.arcane.stop-signal=SIGINT
  db:
    image: postgres:16
    container_name: db
  redis:
    image: redis:7
    container_name: redis
```

- `depends-on` takes Docker container names, comma-separated. Compose service names don't work unless the container has that name, so the example sets `container_name`. Without it, Compose names containers like `myproject-db-1`; use that name instead.
- When a container updates, Arcane also restarts the containers that depend on it, dependencies first.
- Arcane also infers dependencies from legacy `links` and `network_mode: container:...`.
- `stop-signal` sets the signal used to stop the container before recreating it.

## How Arcane picks a new image

Each container follows one strategy. A digest is the registry's content hash for one exact image build. Republishing a tag such as `latest` changes it.

| Strategy           | What Arcane follows                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `digest` (default) | Keeps the configured tag, such as `3.1.2` or `latest`, and updates when that tag's digest changes.                                                                                                                    |
| `auto`             | Complete stable version tags, such as `3.1.2` or `v3.1.2`, move to newer version tags. Moving tags (`latest`, `alpine`), partial versions (`16`, `3.1`), and prerelease or ambiguous tags fall back to digest checks. |
| `tag`              | Always uses version-based selection. If no newer eligible version exists, Arcane checks the current tag's digest instead. Setting a constraint or tag pattern without a strategy also selects this behaviour.         |

Version rules:

- Without a constraint, version updates stay within the current major version (minor for `0.x`).
- Arcane never picks an equal or older version.
- Prereleases need a constraint that admits them, such as `>=3.1.2-0 <4.0.0`.
- Invalid constraints, patterns, or current tags report a check error instead of falling back to digests.
- Digest-pinned references and image IDs are never updated.
- The exception is a container Arcane itself rolled back to an image ID after a failed update. Arcane records its original reference in the `com.getarcaneapp.arcane.updater.configured-image` label and keeps updating it; the next successful update removes the label.

### Tag-based updates

For Compose projects, set defaults in `x-arcane.updater` and override fields per service:

```yaml
x-arcane:
  updater:
    strategy: auto

services:
  app:
    image: ghcr.io/acme/app:3.1.2-alpine
    x-arcane:
      updater:
        strategy: tag
        constraint: "3.x"
        tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
  worker:
    image: ghcr.io/acme/worker:3.1.2
```

- `app` follows newer `3.x` Alpine tags such as `3.2.0-alpine`. The named `version` capture supplies the version, and Arcane pulls the full tag.
- `worker` follows stable `3.x` tags through the project's `auto` default.

For standalone containers, use the matching labels:

```yaml
labels:
  com.getarcaneapp.arcane.updater.strategy: tag
  com.getarcaneapp.arcane.updater.constraint: "3.x"
  com.getarcaneapp.arcane.updater.tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
```

All fields, precedence between labels, service fields, and project defaults, and how to clear inherited values: see [Updater behavior](/docs/reference/compose-labels#updater-behavior).

- Checks use saved registry credentials.
- Containers sharing an image can follow different ranges.
- Changing an image or policy marks its previous result stale.

## When Arcane checks for updates

Arcane checks on the **Image Update Watcher** schedule, hourly by default.

- **Enable event-driven image checks** also checks after local Docker image events. It's off by default because extra requests can count toward registry rate limits.
- Keep the schedule on even with event-driven checks. Registry releases don't cause local events.
- Nearby triggers share one check, and checks never overlap. A manual check during one returns _an image update check is already in progress_.
- Checks abandoned for more than two minutes are marked failed.

## How Compose projects are updated

- Arcane groups updates by project and recreates only changed services.
- A manual **Redeploy** pulls and recreates the whole project.
- A tag update writes the new image reference into the Compose file before deploying, even if both tags resolve to the same image.
- Interpolated values become explicit references. Shared `.env` variables are untouched.
- The new reference stays in the file if deployment fails.

Tag updates can only edit a single Compose file with explicit `image:` fields. Update these at their source instead: git-synced projects, multi-file setups, `include`, `extends`, YAML anchors or aliases, and symlinked files. Digest updates work for all of them.
