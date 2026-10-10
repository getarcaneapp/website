---
title: 'Auto Updates'
description: 'Keep containers and Compose projects on newer images without clicking Update.'
---

Auto updates check registries for newer images on a schedule and recreate containers and Compose projects with them, so you don't have to click **Update** yourself. You can also review pending updates and apply them by hand from the **Updates** page.

Before you start: the images must come from registries Arcane can reach (store private registry credentials under [Container Registries](/docs/docker/images#private-registries)), and each container must be one Arcane can recreate with the same ports, mounts, environment, and labels.

## Turn on auto updates

1. Open **Environments** and select the environment, for example **Local Docker**.
2. Open the **Automations** tab and find the **Updates** section.
3. Turn on **Image Update Watcher** and pick a schedule, or enter a custom one.
4. Turn on **Auto Update** and set its schedule. It can't be turned on while **Image Update Watcher** is off.
5. Optionally, under **Excluded Containers**, select containers that should never be updated automatically.
6. Save.

> [!NOTE]
> Schedules are cron expressions. Arcane doesn't enforce a minimum interval, so avoid very frequent checks against rate-limited registries.

## Apply updates from the Updates page

The **Updates** page lists pending updates in **Containers** and **Projects** tabs. You can apply them without waiting for the schedule:

- **Update Container** or **Update** updates one row after confirmation.
- To update several rows, select them, click **Update**, and confirm.
- **Disable automatic updates** and **Enable automatic updates** toggle automatic installation for one container. Disabled rows stay listed and still get checks and notifications. If the action shows _Controlled by Docker label_, change the label instead.
- **Update All** applies every pending update in the selected environment, including rows not on the current page.

**Update Containers** on the **Containers** page runs the same **Update All** after confirmation. **Update Projects** on the **Projects** page asks for confirmation, checks every image for updates, and redeploys each project that has one.

> [!IMPORTANT]
> **Updates → Update All** updates your containers and projects. **Environments → Update All** upgrades Arcane managers and agents; see [Remote Environments](/docs/remote/environments). If Arcane's own container has a pending update, **Updates → Update All** includes it and restarts Arcane after the other updates finish. The confirmation tells you when this applies.

To check a Compose project on demand, open its update indicator and select **Re-check Updates**. Arcane reads the saved service policies, even while the project is stopped, and shows a result for each service.

## Per-container labels

Set these labels on a container (or under a service's `labels` in Compose) to change how the updater treats it. Boolean labels accept `true`, `1`, `yes`, `on` and `false`, `0`, `no`, `off`, case-insensitive. The full label list is in [Compose Labels](/docs/reference/compose-labels).

### Disable automatic updates for one container

```yaml
labels:
  - com.getarcaneapp.arcane.updater=false
```

Arcane stops installing updates for this container on its own. It is still checked, still appears on the **Updates** page, and still sends notifications, so you decide when to update. You can set the same thing from the container's **Auto Update** toggle or the **Disable automatic updates** action; an explicit label always wins over the UI.

### Disable update checks for one container

```yaml
labels:
  - com.getarcaneapp.arcane.update-check=false
```

This stops checks and notifications but does not stop automatic installation. To leave a container alone entirely, set both `updater=false` and `update-check=false`. There is no `x-arcane` field for this label.

An image is skipped only when every container using it has opted out of checks. Images with no running container are always checked, and checking a single image from the **Images** page still works.

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

`depends-on` is a comma-separated list of container names this container depends on, so Arcane restarts them in the right order when either side is updated. Arcane also infers dependencies from legacy `links` and `network_mode: container:...`. `stop-signal` overrides the signal used to stop the container before it is recreated.

For a standalone container:

```bash
docker run -d \
  --name myapp \
  --label com.getarcaneapp.arcane.updater=false \
  ghcr.io/acme/myapp:latest
```

## How Arcane picks a new image

An image digest is the content hash a registry assigns to one exact build of an image; when a tag such as `latest` is republished, its digest changes. Each container follows one of these strategies:

| Strategy           | What Arcane follows                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `digest` (default) | Keeps the configured tag, such as `3.1.2` or `latest`, and updates when that tag's digest changes.                                                                                                                    |
| `auto`             | Complete stable version tags, such as `3.1.2` or `v3.1.2`, move to newer version tags. Moving tags (`latest`, `alpine`), partial versions (`16`, `3.1`), and prerelease or ambiguous tags fall back to digest checks. |
| `tag`              | Always uses version-based selection. If no newer eligible version exists, Arcane checks the current tag's digest instead. Setting a constraint or tag pattern without a strategy also selects this behaviour.         |

Without a constraint, version-based updates stay within the current major version, or the current minor version for `0.x`. Arcane never picks an equal or older version, and prereleases need a constraint that admits them, such as `>=3.1.2-0 <4.0.0`. Invalid constraints, patterns, or current tags report a check error instead of silently switching to digest checks. Digest-pinned references and image IDs are never updated.

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

The app follows newer `3.x` Alpine tags such as `3.2.0-alpine`. The named `version` capture supplies the version to compare, and Arcane pulls the full matching tag. The worker follows newer stable `3.x` tags through the project's `auto` default.

For standalone containers, use the equivalent labels:

```yaml
labels:
  com.getarcaneapp.arcane.updater.strategy: tag
  com.getarcaneapp.arcane.updater.constraint: '3.x'
  com.getarcaneapp.arcane.updater.tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
```

Every field, the order in which labels, service fields, and project defaults are applied, and how to clear an inherited value are listed under [Updater behavior](/docs/reference/compose-labels#updater-behavior). Checks use saved registry credentials, and containers sharing an image can follow different version ranges. Changing an image or policy marks its previous check result as stale.

## When Arcane checks for updates

Arcane checks on the **Image Update Watcher** schedule, hourly by default. If you turn on **Enable event-driven image checks**, it also checks right after local Docker image events; this is off by default because registries may count the extra requests toward rate limits. Keep the schedule enabled either way, since a new release in a registry doesn't cause a local Docker event.

Nearby triggers share one check, and checks never overlap. Starting a manual check while one is running returns _an image update check is already in progress_. Checks that are abandoned for more than two minutes are marked failed.

## How Compose projects are updated

Arcane groups updates by project and pulls and recreates only the services that changed. A manual **Redeploy** pulls and recreates the whole project.

A tag update writes the new image reference into the Compose file before deploying, even when both tags resolve to the same image. Interpolated values become explicit references, shared `.env` variables are left alone, and the new reference stays in the file if deployment fails.

Arcane can only edit image references in a single Compose file with explicit `image:` fields. Git-synced projects, multi-file setups, `include`, `extends`, YAML anchors or aliases, and symlinked files must be updated at their source. This limit applies to tag updates only; digest updates work for all of them.
