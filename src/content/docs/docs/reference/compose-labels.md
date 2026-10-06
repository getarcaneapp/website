---
title: 'Compose Labels (x-arcane)'
description: 'Reference for the x-arcane Compose extension and Arcane container labels.'
---

This is the reference for the `x-arcane` Compose extension and the `com.getarcaneapp.arcane.*` container labels. Use them to set project and container icons, add links to a project, configure the updater, and hide containers from the default list.

Arcane turns `x-arcane` settings into container labels when it loads the Compose file. Docker Compose run outside Arcane ignores `x-arcane`, so in that case, and for standalone containers, set the labels directly. After changing either, deploy or recreate the containers through Arcane to apply them.

## Set project icons and links

Add an `x-arcane` block at the top level of `compose.yaml`:

```yaml
x-arcane:
  icon-light: nginx
  icon-dark: nginx
  urls:
    - https://docs.example.com
    - https://github.com/example/repo

services:
  nginx:
    image: nginx:alpine
```

| Field        | Meaning                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `icon-light` | Light-coloured icon, shown when Arcane uses the dark theme.              |
| `icon-dark`  | Dark-coloured icon, shown when Arcane uses the light theme.              |
| `icon`       | Single icon for both themes, used only when neither of the above is set. |
| `urls`       | Extra links shown next to the project, such as docs or a homepage.       |

Project tags can also be declared here; see [Projects](/docs/docker/projects).

## Set service icons

Service icons are set with labels, not `x-arcane`:

```yaml
services:
  nginx:
    image: nginx:alpine
    labels:
      - com.getarcaneapp.arcane.icon-light=nginx
      - com.getarcaneapp.arcane.icon-dark=nginx
```

The labels work like the project fields above, and `com.getarcaneapp.arcane.icon` is the single-icon fallback. The short forms `arcane.icon`, `arcane.icon-light`, and `arcane.icon-dark` also work. Project icons and service icons are independent: one never changes the other.

Icon values are either absolute `http://` or `https://` URLs, which are used as-is, or slugs from your icon catalog. Data URIs and base64 icons are not supported. The **Icon Catalog** setting in your account preferences decides how slugs resolve:

| Catalog                | `nginx` resolves to                                                     |
| ---------------------- | ----------------------------------------------------------------------- |
| **selfh.st** (default) | `https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/nginx.svg`          |
| **Dashboard Icons**    | `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/nginx.svg` |

`icon-light` and `icon-dark` slugs get `-light` or `-dark` added before `.svg`, so `icon-light: nginx` resolves to `nginx-light.svg`. The single `icon` slug uses the base file.

## Hide containers

Set `hidden: true` to leave a service's containers out of the default container list and dashboard counts:

```yaml
services:
  worker:
    image: ghcr.io/acme/worker:latest
    x-arcane:
      hidden: true
```

A top-level `x-arcane.hidden: true` applies to every service, and `hidden: false` on a service keeps that service visible. An explicit `com.getarcaneapp.arcane.hidden` label overrides both. Outside Arcane, use the label:

```yaml
labels:
  com.getarcaneapp.arcane.hidden: 'true'
```

To see hidden containers, turn on **Show Hidden Containers** in the container table's view options.

## Updater behavior

Set project defaults under `x-arcane.updater`, then override individual fields per service:

```yaml
x-arcane:
  updater:
    strategy: auto
    constraint: '3.x'

services:
  first:
    image: alpine:3.20.0
    x-arcane:
      updater:
        constraint: '=3.20.1'
  second:
    image: alpine:3.20.0
    x-arcane:
      updater:
        enabled: false
```

| Field         | Label                                         | Meaning                                                                                                                                                  |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`     | `com.getarcaneapp.arcane.updater`             | Boolean. `false` stops automatic installation; the container is still checked. It does not turn on the environment's auto-update schedule.               |
| `strategy`    | `com.getarcaneapp.arcane.updater.strategy`    | `digest` (default), `auto`, or `tag`.                                                                                                                    |
| `constraint`  | `com.getarcaneapp.arcane.updater.constraint`  | Semantic version range, such as `3.x`, `3.20.x`, or `=3.20.1`. Without one, version updates stay within the current major, or current minor for `0.x`.   |
| `tag-pattern` | `com.getarcaneapp.arcane.updater.tag-pattern` | Regex the whole tag must match. A named `version` capture extracts the version from variant tags; without one, the whole tag must be a semantic version. |

Each field is resolved separately, first match wins:

1. An explicit label on the service.
2. The service's `x-arcane.updater` field.
3. The project's `x-arcane.updater` default.

An empty `constraint` or `tag-pattern` string clears an inherited value. Arcane can check project metadata before any containers exist, and the Compose editor offers completions and hover help for these fields.

What each strategy does, and how updates are checked and applied, is explained in [Auto Updates](/docs/docker/auto-updates).

## Reference

### Container labels

| Label                                         | Purpose                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `com.getarcaneapp.arcane.icon`                | Fallback service icon.                                                                   |
| `com.getarcaneapp.arcane.icon-light`          | Light-coloured service icon for the dark theme.                                          |
| `com.getarcaneapp.arcane.icon-dark`           | Dark-coloured service icon for the light theme.                                          |
| `com.getarcaneapp.arcane.hidden`              | Hide the container from the default list.                                                |
| `com.getarcaneapp.arcane.updater`             | Allow or block automatic installation.                                                   |
| `com.getarcaneapp.arcane.updater.strategy`    | Update strategy.                                                                         |
| `com.getarcaneapp.arcane.updater.constraint`  | Version range for tag updates.                                                           |
| `com.getarcaneapp.arcane.updater.tag-pattern` | Tag regex for tag updates.                                                               |
| `com.getarcaneapp.arcane.update-check`        | `false` stops update checks and notifications. No `x-arcane` field.                      |
| `com.getarcaneapp.arcane.depends-on`          | Comma-separated container names to restart in order during updates. No `x-arcane` field. |
| `com.getarcaneapp.arcane.stop-signal`         | Signal used to stop the container during updates. No `x-arcane` field.                   |

The last three are explained under [Per-container labels](/docs/docker/auto-updates#per-container-labels).
