---
title: 'Custom Metadata'
description: 'Configure project and service icons, links, and updater policies with x-arcane metadata.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Use the Compose file's `x-arcane` block for project icons, external links, and updater defaults. Services can override updater settings in their own `x-arcane` block. Service icon labels are documented below.

Icon values can be either absolute `http://` or `https://` URLs, or catalog slugs from the selected icon catalog. Data URIs and embedded base64 icons are not supported.

## Project-level metadata

Add an `x-arcane` block at the top level of your `compose.yaml`:

```yaml
x-arcane:
  icon-light: nginx
  icon-dark: nginx
  urls:
    - https://docs.example.com
    - https://github.com/example/repo

services:
  # ...
```

- `icon-light` — light icon used in dark theme.
- `icon-dark` — dark icon used in light theme.
- `icon` — fallback icon used only when neither `icon-light` nor `icon-dark` is provided.
- `urls` — extra links shown next to the project (docs, homepage, etc.).

## Service-level icons

Set icons for an individual service via labels:

```yaml
x-arcane:
  icon-light: nginx
  icon-dark: nginx
  urls:
    - https://google.com

services:
  nginx:
    image: nginx:alpine
    container_name: nginx_service
    # ...
    labels:
      - com.getarcaneapp.arcane.icon-light=nginx
      - com.getarcaneapp.arcane.icon-dark=nginx
```

The labels only change the container's icons. The top-level `x-arcane` block only changes the project's icons. They're independent.

If a service only needs one icon for both themes, use `com.getarcaneapp.arcane.icon`. Arcane uses this fallback only when neither `com.getarcaneapp.arcane.icon-light` nor `com.getarcaneapp.arcane.icon-dark` is set for the service.

Short label aliases are also supported:

```yaml
labels:
  - arcane.icon=nginx
  - arcane.icon-light=nginx
  - arcane.icon-dark=nginx
```

## Icon catalogs

The icon catalog setting controls how slugs are resolved:

- `selfhst` resolves `nginx` to `https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/nginx.svg`.
- `dashboard-icons` resolves `nginx` to `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/nginx.svg`.

Theme variants append `-light` or `-dark` before `.svg`. For example, `icon-light: nginx` resolves to `nginx-light.svg`.

Fallback `icon` slugs use the base catalog file without a theme suffix.

Absolute URLs pass through unchanged:

```yaml
x-arcane:
  icon-light: https://example.com/nginx-light.svg
  icon-dark: https://example.com/nginx-dark.svg
```

## Updater behavior

Set project defaults under `x-arcane.updater`, then override individual fields on a service:

```yaml
x-arcane:
  updater:
    enabled: true
    strategy: auto
    constraint: '3.x'

services:
  first:
    image: alpine:3.20.0
    command: ['sleep', 'infinity']
    x-arcane:
      updater:
        constraint: '=3.20.1'
  second:
    image: alpine:3.20.0
    command: ['sleep', 'infinity']
    x-arcane:
      updater:
        constraint: '=3.20.2'
```

These services start from the same image but select different target tags. See <Link href="/docs/guides/updates#tag-based-updates">Tag-based updates</Link> for version selection, checking, and applying updates.

| Field         | Meaning                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enabled`     | Boolean controlling updater participation. Set `false` to opt out. This doesn't enable the environment's auto-update schedule.                                                 |
| `strategy`    | `auto` is the default: complete stable version tags use tag checks; other tags use digest checks. `digest` keeps the configured tag. `tag` requires version-based selection.   |
| `constraint`  | Optional semantic version range, such as `3.x`, `3.20.x`, or `=3.20.1`. In tag mode, an omitted constraint keeps updates within the current major, or current minor for `0.x`. |
| `tag-pattern` | Optional full-tag regex. A named `version` capture extracts the comparable version from variant tags.                                                                          |

Settings are resolved per field, in this order:

1. Explicit `com.getarcaneapp.arcane.updater` labels on the service.
2. The service's `x-arcane.updater` fields.
3. The project's top-level `x-arcane.updater` defaults.

When `auto` has an explicit constraint or tag pattern, Arcane validates it and uses version-based selection. Invalid policies produce a check error. Prereleases require an explicit constraint that admits them.

An omitted service field inherits its project default. An empty `constraint` or `tag-pattern` string clears an inherited value. For variant tags such as `3.1.2-alpine`, use:

```yaml
x-arcane:
  updater:
    strategy: tag
    constraint: '3.x'
    tag-pattern: '(?P<version>\d+\.\d+\.\d+)-alpine'
```

Arcane turns these settings into updater labels when it loads the Compose model. It can check project metadata before you create any containers. After changing the metadata, deploy or recreate existing containers through Arcane to apply the new policy to their labels.

Docker Compose launched outside Arcane ignores `x-arcane`. Use <Link href="/docs/guides/updates#per-container-labels">explicit updater labels</Link> for that workflow and for standalone containers. Arcane's Compose editor offers completions and hover help for the updater fields.

## Hide containers

Set `hidden: true` to hide a service's containers from the default container list and dashboard counts:

```yaml
services:
  worker:
    image: ghcr.io/acme/worker:latest
    x-arcane:
      hidden: true
```

A top-level `x-arcane.hidden: true` applies to every service. Set `hidden: false` on an individual service to keep its containers visible. An explicit `com.getarcaneapp.arcane.hidden` Docker label overrides both values.

Deploy or recreate the containers through Arcane to apply metadata changes. If you deploy with Docker Compose outside Arcane, use the Docker label directly:

```yaml
labels:
  com.getarcaneapp.arcane.hidden: 'true'
```

Turn on **Show hidden containers** in the container table's view options to reveal hidden containers.
