---
title: 'Auto Updates'
description: 'Keep containers and Compose projects on newer images without clicking Update.'
---

Auto updates check registries for newer images on a schedule and recreate containers and Compose projects with them. You can also apply pending updates by hand from the **Updates** page. Images must come from registries Arcane can reach (store private credentials under [Container Registries](/docs/docker/images#private-registries)). Arcane must be able to recreate each container with the same ports, mounts, environment, and labels. On Podman hosts, Quadlet containers are skipped so they stay under systemd's control; use [Podman auto-update](/docs/podman/auto-update) instead.

## Turn on auto updates

1. Open **Settings → Automations** and pick the environment.
2. Find the **Updates** section.
3. Turn on **Image Update Watcher** and pick or enter a schedule.
4. Turn on **Auto Update** and set its schedule. It requires **Image Update Watcher**.
5. Optional: set **Update Delay (hours)**; see [Delay new images](#delay-new-images).
6. Optional: under **Excluded Containers**, select containers never to update automatically.
7. Save.

> [!NOTE]
> Schedules are cron expressions. Arcane doesn't enforce a minimum interval, so avoid very frequent checks against rate-limited registries.

## Delay new images

**Update Delay (hours)** holds automatic updates until a new image has been available that long. Compromised images are often pulled within hours or days, so a delay keeps them away in that window. Default `0` (install at the next scheduled run); maximum `8760` hours (one year). The count starts when Arcane first detects the new digest or version, not the publisher-controlled build date. It restarts when the target changes (a newer version, or a tag republished with a new digest) or the update stops being pending (installed or rolled back). A failed check keeps the count. Waiting updates stay on the **Updates** page and install on the first scheduled run after the delay. The delay only applies to the **Auto Update** schedule; **Update**, **Update All**, and other manual updates install immediately.

To override the delay for one container, set it in Compose or as a label. A per-container value, including `0`, wins over the environment setting. Use whole hours; Compose values above `8760` or below `0` are rejected, and a label above `8760` is treated as `8760`:

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

## Apply updates from the Updates page

The **Updates** page lists pending updates from every environment in **Containers** and **Projects** tabs:

- **Update Container** or **Update** updates one row, or several selected rows, after confirmation.
- **Disable/Enable automatic updates** toggles automatic installation for one container. Disabled rows still get checks and notifications. If it shows _Controlled by Docker label_, change the label instead.
- **Update All** applies every pending update in every environment you can update, including rows not on the current page.

**Update Containers** on the **Containers** page runs the same **Update All** after confirmation; **Update Projects** on the **Projects** page confirms, checks every image, and redeploys each project with an update. To check one Compose project now, open its update indicator and select **Re-check Updates**; Arcane shows a result per service from saved policies, even while the project is stopped.

> [!IMPORTANT]
> **Updates → Update All** updates your containers and projects. **Environments → Update All** upgrades Arcane managers and agents; see [Remote Environments](/docs/remote/environments). If Arcane's own container has a pending update, **Updates → Update All** includes it and restarts Arcane after the other updates finish. The confirmation tells you when this applies.

## Per-container labels

Set these labels on a container (or under a service's `labels` in Compose) to change how the updater treats it. Boolean labels accept `true`, `1`, `yes`, `on` and `false`, `0`, `no`, `off`, case-insensitive. The full label list is in [Compose Labels](/docs/reference/compose-labels).

### Disable automatic updates for one container

```yaml
labels:
  - com.getarcaneapp.arcane.updater=false
```

Arcane stops installing updates for this container, but still checks it, lists it on **Updates**, and sends notifications. The container's **Auto Update** toggle and the **Disable automatic updates** action do the same; an explicit label always wins over the UI.

### Disable update checks for one container

```yaml
labels:
  - com.getarcaneapp.arcane.update-check=false
```

This stops checks and notifications, not automatic installation. To leave a container alone entirely, set both `updater=false` and `update-check=false`. There is no `x-arcane` field for this label. An image is skipped only when every container using it opts out. Images with no running container are always checked, and single-image checks from **Images** still work.

| Configuration                            | Checks and notifications | Automatic installation |
| ---------------------------------------- | ------------------------ | ---------------------- |
| No labels, not excluded in the UI        | Yes                      | Yes                    |
| `updater=false` or excluded in the UI    | Yes                      | No                     |
| `update-check=false`                     | No                       | Yes                    |
| `updater=false` and `update-check=false` | No                       | No                     |

> [!NOTE]
> Remote environments running an older agent may still skip checks for containers with automatic updates disabled until the agent is upgraded.

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
  redis:
    image: redis:7
```

`depends-on` lists container names this one depends on, so Arcane restarts them in order when either side updates. Arcane also infers dependencies from legacy `links` and `network_mode: container:...`. `stop-signal` overrides the signal used to stop the container before recreating it. For a standalone container:

```bash
docker run -d \
  --name myapp \
  --label com.getarcaneapp.arcane.updater=false \
  ghcr.io/acme/myapp:latest
```

## How Arcane picks a new image

A digest is the registry's content hash for one exact image build; republishing a tag such as `latest` changes it. Each container follows one strategy:

| Strategy           | What Arcane follows                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `digest` (default) | Keeps the configured tag, such as `3.1.2` or `latest`, and updates when that tag's digest changes.                                                                                                                    |
| `auto`             | Complete stable version tags, such as `3.1.2` or `v3.1.2`, move to newer version tags. Moving tags (`latest`, `alpine`), partial versions (`16`, `3.1`), and prerelease or ambiguous tags fall back to digest checks. |
| `tag`              | Always uses version-based selection. If no newer eligible version exists, Arcane checks the current tag's digest instead. Setting a constraint or tag pattern without a strategy also selects this behaviour.         |

Without a constraint, version updates stay within the current major version (minor for `0.x`). Arcane never picks an equal or older version; prereleases need an admitting constraint such as `>=3.1.2-0 <4.0.0`. Invalid constraints, patterns, or current tags report a check error rather than falling back to digests. Digest-pinned references and image IDs are never updated.

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
        constraint: '3.x'
        tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
  worker:
    image: ghcr.io/acme/worker:3.1.2
```

The app follows newer `3.x` Alpine tags such as `3.2.0-alpine`; the named `version` capture supplies the version, and Arcane pulls the full tag. The worker follows stable `3.x` tags via the project's `auto` default. For standalone containers, use the equivalent labels:

```yaml
labels:
  com.getarcaneapp.arcane.updater.strategy: tag
  com.getarcaneapp.arcane.updater.constraint: '3.x'
  com.getarcaneapp.arcane.updater.tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
```

All fields, precedence between labels, service fields, and project defaults, and clearing inherited values are under [Updater behavior](/docs/reference/compose-labels#updater-behavior). Checks use saved registry credentials, and containers sharing an image can follow different ranges. Changing an image or policy marks its previous result stale.

## When Arcane checks for updates

Arcane checks on the **Image Update Watcher** schedule, hourly by default. **Enable event-driven image checks** (off by default, since extra requests may count toward rate limits) also checks after local Docker image events. Keep the schedule on anyway: registry releases don't cause local events. Nearby triggers share one check, and checks never overlap; a manual check during one returns _an image update check is already in progress_. Checks abandoned for more than two minutes are marked failed.

## How Compose projects are updated

Arcane groups updates by project and recreates only changed services. A manual **Redeploy** pulls and recreates the whole project. A tag update writes the new image reference into the Compose file before deploying, even if both tags resolve to the same image. Interpolated values become explicit references, shared `.env` variables are untouched, and the new reference stays if deployment fails.

Tag updates can only edit a single Compose file with explicit `image:` fields. Update git-synced projects, multi-file setups, `include`, `extends`, YAML anchors or aliases, and symlinked files at their source. Digest updates work for all of them.
