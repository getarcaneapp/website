---
title: 'Auto Updates'
description: 'Keep containers and Compose projects up to date automatically.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Arcane can watch your registries and update containers (or whole Compose projects) when a new image is published.

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

Update checks are driven by **Docker image events**. When an image changes locally, Arcane queues a check and waits a couple of seconds before running it, so a burst of events results in one scan rather than many.

Because a new tag published to a registry produces no local Docker event, Arcane also runs a **scheduled poll** as a safety net. That is what **Image Polling** and its schedule control — the default is hourly. Both paths queue the same scan, so a poll that lands while an event-driven check is already running won't start a second one.

Leave polling enabled. Turning it off limits Arcane to noticing images that change on the host, which will miss most registry-side releases.

If a check is interrupted, Arcane no longer leaves it stuck: a background sweep fails any check abandoned for more than two minutes, and starting a manual check while one is running tells you _an image update check is already in progress_ instead of queueing a duplicate.

## Applying updates from the Updates page

The **Updates** page lists everything with a pending update, split into **Containers** and **Projects** tabs. Beyond waiting for the schedule, you can apply updates from here directly:

- **Row action** — the kebab menu on a row offers **Update Container** (containers) or **Update** (projects), applying just that one after a confirmation.
- **Bulk update** — tick the checkboxes on several rows and use the **Update** button, which shows how many you selected. Arcane confirms before pulling the images and applying every selected update.
- **Ignore** — the container row menu also has **Ignore** / **Unignore**, which excludes that container from automatic updates. The row stays listed and picks up an **Ignored** badge. If the exclusion comes from a Docker label instead of this toggle, the item is disabled and the badge reads _Controlled by Docker label_ — change the label to alter it.
- **Update All** — applies every pending update on the selected environment, including ones not visible on the current page.

Updating a project from this page is a **scoped** run: only the services whose images actually changed are recreated. That differs from a manual **Redeploy** on the Projects page, which pulls and recreates the whole project.

> [!IMPORTANT]
> **Update All** on the Updates page and **Update All** on the Environments page do different things.
>
> - **Updates → Update All** updates your **workloads** — the containers and projects running on the selected environment.
> - **Environments → Update All** upgrades **Arcane itself** across your fleet. See <Link href="/docs/features/environments">Remote Environments</Link>.
>
> If Arcane's own container has a pending update, **Updates → Update All** will pick it up too and restart Arcane after the other updates finish. The confirmation tells you when that applies.

## How Arcane decides what to update

Arcane compares image **digests**, not tags. Tags like `latest` and `next` move over time, so digest comparison is the only reliable way to spot a change.

The model is similar to Watchtower's, with adjustments to fit Arcane's update flow — so it should feel familiar if you've used Watchtower.

## Compose-aware updates

When a container belongs to a Compose project, Arcane uses Compose-aware logic instead of treating each service as a standalone container. That means Arcane can:

- group pending updates by project
- pull only the images of services that actually changed
- recreate only those services, leaving the rest running

Manual project redeploys still use the project-level Compose flow (a deliberate `pull` + `up -d` across the whole project).

## Per-container labels

All labels live under the `com.getarcaneapp.arcane.*` namespace.

### Disable updates for one container

```yaml
labels:
  - com.getarcaneapp.arcane.updater=false
```

Accepted truthy values: `true`, `1`, `yes`, `on`. Falsy: `false`, `0`, `no`, `off`. Case-insensitive.

You can also flip this from the container's detail page, or from the **Ignore** action on the Updates page. If the container already has an explicit updater label, the label wins and the UI reflects that.

Opting out also excludes the image from update **scanning**, not just from being updated — but only when _every_ container using that image is opted out. If any other container still uses the image without the label, Arcane keeps scanning it. Images with no running container are always scanned.

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
