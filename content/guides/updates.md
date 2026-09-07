---
title: 'Auto Updates'
description: 'Keep containers and Compose projects up to date automatically.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

## Before you turn it on

- The images you want updated must be hosted in registries Arcane can reach.
- For private registries, store credentials under **Customization → Container Registries** first.
- The container has to be one Arcane can recreate cleanly — meaning its ports, mounts, env, and labels are visible to Arcane.

## Enable auto updates

1. Go to **Environments** from the left-hand menu.
2. Select the environment you want to configure, for example **Local Docker**.
3. Open the **Automations** tab.
4. Scroll down to the **Updates** section.
5. Turn on **Image Polling** and pick a schedule, or enter a custom one.
6. Turn on **Auto Update**.
7. Set the run interval or schedule.
8. Save.

> [!NOTE]
> Very low intervals are clamped to a safer minimum.

## When Arcane checks for updates

Arcane checks after local Docker image events and on the **Image Polling** schedule, hourly by default. Nearby events share a scan, and checks don't overlap. Leave polling enabled: registry releases don't trigger local Docker events.

Checks abandoned for more than two minutes are marked failed. Starting a manual check during another returns _an image update check is already in progress_.

## Applying updates from the Updates page

The **Updates** page shows pending updates in **Containers** and **Projects** tabs. You can apply them here without waiting for the schedule:

- **Update Container** / **Update** — update one row after confirmation.
- **Bulk update** — select rows, click **Update**, and confirm.
- **Ignore** / **Unignore** — toggle automatic updates for a container. Ignored rows stay listed. If the badge says _Controlled by Docker label_, change that label instead.
- **Update All** — applies every pending update on the selected environment, including ones not visible on the current page.

> [!IMPORTANT]
>
> - **Updates → Update All** updates containers and projects in the selected environment.
> - **Environments → Update All** upgrades Arcane managers and agents. See <Link href="/docs/features/environments">Remote Environments</Link>.
>
> If Arcane's own container has a pending update, **Updates → Update All** will pick it up too and restart Arcane after the other updates finish. The confirmation tells you when that applies.

## How Arcane decides what to update

Arcane uses the `auto` strategy by default:

- Complete stable version tags, such as `3.1.2` or `v3.1.2`, follow newer version tags. Without a constraint, updates stay within the current major version. For `0.x`, they stay within the current minor version.
- Moving tags, such as `latest`, `next`, and `alpine`, keep their tag and follow changes to its image digest. Partial version tags, such as `16` or `3.1`, and ambiguous variant or prerelease tags also use digest checks unless you provide an explicit policy.

A constraint or tag pattern supplied with `auto` requests version-based selection. Invalid constraints, patterns, or incompatible current tags report an error rather than silently switching to digest checks.

Set `strategy: digest` to keep a version tag fixed while still receiving new images published under that tag. Set `strategy: tag` to require version-based selection. Arcane checks the current tag's digest when no newer eligible version is available. Digest-pinned references and image IDs aren't eligible for updates.

### Tag-based updates

For Compose projects, put defaults in `x-arcane.updater` and override individual fields on a service:

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

The app follows newer `3.x` Alpine tags. The worker follows newer stable `3.x` tags through `auto`. Prerelease updates require an explicit constraint that admits them, such as `>=3.1.2-0 <4.0.0`. Arcane never selects an equal or older version as a tag upgrade.

For standalone containers, set the equivalent Docker labels:

```yaml
labels:
  com.getarcaneapp.arcane.updater.strategy: tag
  com.getarcaneapp.arcane.updater.constraint: '3.x'
  com.getarcaneapp.arcane.updater.tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
```

This keeps a service on tags such as `3.1.2-alpine`. The named `version` capture supplies the version to compare; Arcane pulls the original tag, including its suffix. Without a named capture, the entire matched tag must be a semantic version. Invalid patterns, constraints, or current versions produce a check error.

Each explicit updater label takes precedence over the matching service metadata field, which takes precedence over the project default. See <Link href="/docs/guides/custom-metadata#updater-behavior">Updater behavior</Link> for all fields.

Checks use saved registry credentials. Containers using the same image can follow different version ranges. Forced updates still exclude image IDs and digest-pinned references.

To check a Compose project, open its update indicator and select **Re-check Updates**. Arcane reads the saved service policies, including while the project is stopped, and shows a separate result for each service. Changing an image or policy makes its previous check stale.

## Compose-aware updates

Arcane groups updates by project, pulling and recreating only changed services. Manual **Redeploy** pulls and recreates the whole project with `pull` and `up -d`.

Tag updates write the selected image reference to Compose before deployment, even if both tags resolve to the same image. Interpolated values become explicit references; shared `.env` variables stay unchanged. The saved reference remains if deployment fails.

Automatic edits to Compose image references require a single Compose file with explicit service image fields. GitOps-managed projects, multi-file configurations, includes, extends, YAML anchors or aliases, and symlinked source files must be updated at their source. These restrictions apply to editing image references, not to ordinary digest-based updates.

## Per-container labels

All labels live under the `com.getarcaneapp.arcane.*` namespace.

### Disable updates for one container

```yaml
labels:
  - com.getarcaneapp.arcane.updater=false
```

Accepted truthy values: `true`, `1`, `yes`, `on`. Falsy: `false`, `0`, `no`, `off`. Case-insensitive.

You can also flip this from the container's detail page, or from the **Ignore** action on the Updates page. If the container already has an explicit updater label, the label wins and the UI reflects that.

Arcane skips scanning an image only when every container using it has opted out. Images with no running container are always scanned.

### Restart order

If your container needs other containers restarted first (or needs to restart when a dependency does), set:

```yaml
labels:
  - com.getarcaneapp.arcane.depends-on=container_a,container_b
```

A comma-separated list of **container names**. Arcane also infers some dependencies from Docker wiring like legacy `links` and `network_mode: container:...`.

### Override the stop signal

```yaml
labels:
  - com.getarcaneapp.arcane.stop-signal=SIGINT
```

## Compose example

```yaml
services:
  myapp:
    image: ghcr.io/acme/myapp:latest
    labels:
      - com.getarcaneapp.arcane.updater=true
      - com.getarcaneapp.arcane.depends-on=db,redis
      - com.getarcaneapp.arcane.stop-signal=SIGTERM

  db:
    image: postgres:16

  redis:
    image: redis:7
```

## docker run example

```bash
docker run -d \
  --name myapp \
  --label com.getarcaneapp.arcane.updater=true \
  ghcr.io/acme/myapp:latest
```
