---
title: 'Next Builds'
description: 'Information about the latest beta and next builds of Arcane.'
order: 100
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!CAUTION]
> These builds are intended for users who like to have a "rolling release" or that are interested in testing new features early. They may contain bugs, incomplete features, or breaking changes. **Do not use these builds in production environments.**

## Overview

Arcane provides "next" builds that contain the latest features and improvements currently under development. These builds are automatically generated from the `main` branch and are available as Docker images.

## Docker Images

The following images are available for testing the next version of Arcane:

### Arcane Manager (Next)
The main Arcane container image.

<Snippet class="m-2" text="ghcr.io/getarcaneapp/arcane:next" />
<Snippet class="m-2" text="ghcr.io/getarcaneapp/arcane:next-distroless" />

### Arcane Agent (Next)
The agent used for remote environment management.

<Snippet class="m-2" text="ghcr.io/getarcaneapp/arcane-headless:next" />
<Snippet class="m-2" text="ghcr.io/getarcaneapp/arcane-headless:next-distroless" />

## How to Use

To use the next builds, update your `compose.yaml` file to use the `:next` or `:next-distroless` tag instead of `:latest` or your current tag.

### Example Compose File

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:next
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    environment:
      - APP_URL=http://localhost:3552
      - ENCRYPTION_KEY=your-encryption-key
      - JWT_SECRET=your-jwt-secret
    restart: unless-stopped

volumes:
  arcane-data:
```

## What's Included?

The `:next` or `:next-distroless` builds typically include:
- **Experimental Features**: New functionality that is still being refined.
- **Bug Fixes**: Early access to fixes before they are officially released.
- **Performance Improvements**: Optimizations that are being tested for stability.

They are built with static binaries, `next` is based on alpine and `next-distroless` is using distroless-static. These builds may not contain the required functionality for some external monitoring tools like GPU's etc.

## Feedback

If you encounter any issues while using the beta builds, please report them on our [GitHub Issues](https://github.com/getarcaneapp/arcane/issues) page. Your feedback helps us make Arcane better for everyone!
