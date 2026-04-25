---
title: 'Custom Metadata'
description: 'Add icons and external links to projects and services.'
---

You can give projects and services a custom icon and a list of external links — for example a docs URL, a homepage, or a repo. Project-level metadata goes in the compose file's `x-arcane` block; service-level icons go on the service via a label.

## Project-level metadata

Add an `x-arcane` block at the top level of your `compose.yaml`:

```yaml
x-arcane:
  icon: https://example.com/project-icon.png
  urls:
    - https://docs.example.com
    - https://github.com/example/repo

services:
  # ...
```

- `icon` (or `icons`) — image URL for the project.
- `urls` — extra links shown next to the project (docs, homepage, etc.).

## Service-level icons

Set an icon for an individual service via a label:

```yaml
x-arcane:
  icon: https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/nginx.png
  urls:
    - https://google.com

services:
  nginx:
    image: nginx:alpine
    container_name: nginx_service
    # ...
    labels:
      - com.getarcaneapp.arcane.icon=https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/nginx.png
```

The label only changes the container's icon. The top-level `x-arcane` block only changes the project's icon. They're independent.
