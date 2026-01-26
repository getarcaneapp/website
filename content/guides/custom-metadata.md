---
title: 'Custom Metadata'
description: 'Customize project and service appearance with icons and external links'
---

Arcane allows you to customize the appearance of your projects and services using custom metadata. This metadata can be defined globally for a project or specifically for individual containers/services.

### Project-level Metadata

To set an icon or external URLs for the entire project, add an `x-arcane` block at the top level of your `compose.yaml` file:

```yaml
x-arcane:
  icon: https://example.com/project-icon.png
  urls:
    - https://docs.example.com
    - https://github.com/example/repo

services:
  # ...
```

- `icon` (or `icons`): A URL to an image representing the project.
- `urls`: A list of strings for additional project-related links (e.g., documentation, homepage).

### Service and Container Metadata

You can also specify icons for individual services.

An example of how this can be used is below:

```yaml
x-arcane:
  icon: https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/nginx.png
  urls:
  - https://google.com

services:
  nginx:
    image: nginx:alpine
    container_name: nginx_service
    ...
    labels:
      - com.getarcaneapp.arcane.icon=https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/nginx.png
```

The individual label is used for the container icon only, and the top level x-arcane block is also only used for the project only. Each icon is independent of each other. 