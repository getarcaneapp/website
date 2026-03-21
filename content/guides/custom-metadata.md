---
title: 'Custom Metadata'
description: 'Customize project and service appearance with icons and external links'
---

Arcane lets you customize the look of your projects and services with extra metadata. You can apply it to the whole project or to a single service.

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

- `icon` (or `icons`): a link to an image for the project
- `urls`: extra links for the project, like documentation or a homepage

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

The label only changes the container icon. The top-level `x-arcane` block only changes the project icon. Each one works separately.
