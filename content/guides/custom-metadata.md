---
title: 'Custom Metadata'
description: 'Add theme-aware icons and external links to projects and services.'
---

You can give projects and services theme-aware icons and a list of external links — for example a docs URL, a homepage, or a repo. Project-level metadata goes in the compose file's `x-arcane` block; service-level icons go on the service via labels.

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
