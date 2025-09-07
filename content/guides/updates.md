---
title: 'Auto Updates'
description: 'Configure automatic updates for containers and projects'
---

Keep selected containers and Compose projects up to date automatically when new images are available.

## Prerequisites
- Your images are hosted in registries accessible from the Arcane host.
- If using private registries, credentials are configured in Arcanes Registry Credentials.

## Enable auto updates
1. Go to Settings → Docker.
2. Turn on Auto updates.
3. Set the check interval (5–1440 minutes).
4. Save.

> Tip: Choose an interval that aligns with your maintenance window (e.g., 60 or 1440 minutes).

## Exclude specific services
To prevent updates for a project or container, add this label:

```
com.ofkm.arcane.updater=false
```

### Compose Example

```
services:
  myapp:
    image: ghcr.io/acme/myapp:1
    # Exclude this service from auto updates
    labels:
      - com.ofkm.arcane.updater=false
```