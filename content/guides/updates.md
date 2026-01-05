---
title: 'Auto Updates'
description: 'Configure automatic updates for containers and projects'
---

Keep selected containers and projects up to date automatically when new images are available.

## Prerequisites

- Your images are hosted in registries accessible from the Arcane host.
- If using private registries, credentials are configured in **Registry Credentials**.
- The container(s) you want to update are created in a way Arcane can recreate safely (ports, mounts, env, etc.).

## Enable auto updates

1. Go to **Environments → Select the Environment → Settings → Docker**.
2. Enable **Image Polling** and select a schedule (or enter a custom value).
3. Enable **Auto Updates**.
4. Set the interval (minutes).
5. Save.

> Note: Arcane will clamp very low intervals to a safer value.

## How Arcane decides what to update

Arcane checks for updates by comparing image digests (when possible). For tags like `latest` or `next`, a tag can point to a different digest over time, so digest comparison is the most reliable way to detect changes.

This logic is very similar to how watchtower worked/works ith Changes to support arcanes logic, so should be familiar to those who have used that. 

## Container labels (per-service / per-container)

All labels are under the `com.getarcaneapp.arcane.*` namespace.

### Disable auto updates for a container

To prevent updates for a container or service:

```
com.getarcaneapp.arcane.updater=false
```

Accepted “false” values are: `false`, `0`, `no`, `off` (case-insensitive).

Accepted “true” values are: `true`, `1`, `yes`, `on` (case-insensitive).

### Lifecycle hooks

Lifecycle hooks let you run a command *inside the container* at specific times.

#### Pre-check / post-check hooks

Run before/after Arcane checks if an update is available:

- `com.getarcaneapp.arcane.lifecycle.pre-check`
- `com.getarcaneapp.arcane.lifecycle.post-check`

#### Pre-update / post-update hooks

Run before stopping the container and after the replacement container is started:

- `com.getarcaneapp.arcane.lifecycle.pre-update`
- `com.getarcaneapp.arcane.lifecycle.post-update`

Hook values are treated as shell commands (executed as `/bin/sh -c <value>`).

##### Hook timeouts

You can set timeouts for the update hooks:

- `com.getarcaneapp.arcane.lifecycle.pre-update-timeout`
- `com.getarcaneapp.arcane.lifecycle.post-update-timeout`

Timeout values can be either:
- seconds (e.g. `90`)
- or a Go duration string (e.g. `90s`, `2m`)

##### Skipping an update from a hook

If a lifecycle hook exits with code **75** (EX_TEMPFAIL), Arcane treats it as “skip this update”.

### Dependency ordering

If your container depends on other containers being restarted first (or needs to restart when a dependency restarts), set:

```
com.getarcaneapp.arcane.depends-on=container_a,container_b
```

This is a comma-separated list of **container names**.

Arcane also infers dependencies from some Docker wiring (like legacy `links` and `network_mode: container:...`).

### Custom stop signal

To override the signal Arcane uses when stopping a container during an update:

```
com.getarcaneapp.arcane.stop-signal=SIGINT
```

## Compose example

```yaml
services:
  myapp:
    image: ghcr.io/acme/myapp:latest
    labels:
      # Enable auto updates (default behavior). Use false to disable.
      - com.getarcaneapp.arcane.updater=true

      # Or: monitor-only mode
      # - com.getarcaneapp.arcane.monitor-only=true

      # Optional: dependencies
      - com.getarcaneapp.arcane.depends-on=db,redis

      # Optional: lifecycle hooks
      - com.getarcaneapp.arcane.lifecycle.pre-update=echo "pre-update: draining" && ./bin/drain
      - com.getarcaneapp.arcane.lifecycle.pre-update-timeout=2m
      - com.getarcaneapp.arcane.lifecycle.post-update=./bin/smoke-test
      - com.getarcaneapp.arcane.lifecycle.post-update-timeout=90

      # Optional: stop signal
      - com.getarcaneapp.arcane.stop-signal=SIGTERM

  db:
    image: postgres:16

  redis:
    image: redis:7
```

## Docker run example

```bash
docker run -d \
  --name myapp \
  --label com.getarcaneapp.arcane.updater=true \
  --label com.getarcaneapp.arcane.lifecycle.pre-update="echo draining && ./drain" \
  --label com.getarcaneapp.arcane.lifecycle.pre-update-timeout=120 \
  ghcr.io/acme/myapp:latest
```
