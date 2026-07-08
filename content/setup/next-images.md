---
title: 'Next Builds'
description: 'Information about the latest beta and next builds of Arcane.'
order: 100
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
import BinaryDownloads from '$lib/components/binary-downloads.svelte';
</script>

> [!CAUTION]
> These builds are intended for users who like to have a "rolling release" or that are interested in testing new features early. They may contain bugs, incomplete features, or breaking changes. **Do not use these builds in production environments.**

## Overview

Arcane provides "next" builds that contain the latest features and improvements currently under development. These builds are automatically generated from the `main` branch and are available as Docker images.

## Docker Images

Next images use static binaries with Arcane's distroless runtime base.

Every build is published under three tags:

- `next` — always points to the most recent build.
- `next-static` — an alias of `next`, kept for existing setups.
- A versioned tag such as `v2.4.0-next.1` — a permanent tag for that specific build.

## Versioning

Next builds are versioned after the upcoming Arcane release. For example, if the latest release is `v2.3.2` and new features have landed since, next builds are versioned `v2.4.0-next.1`, `v2.4.0-next.2`, and so on — the counter increases with each build until `v2.4.0` is released.

This is also the version Arcane shows in the dashboard, so you can always tell exactly which build you are running.

### Arcane Manager (Next)

The main Arcane container image.

<Snippet class="m-2" text="ghcr.io/getarcaneapp/manager:next" />

### Arcane Agent (Next)

The agent used for remote environment management.

<Snippet class="m-2" text="ghcr.io/getarcaneapp/agent:next" />

> [!TIP]
> Prefer staying on a specific prerelease build? Use its versioned tag, e.g. `ghcr.io/getarcaneapp/manager:v2.4.0-next.1`, instead of the rolling `next` tag.

## How to Use

To use the next builds, update your `compose.yaml` file to use the `:next` tag instead of `:latest` or your current tag.

### Example Compose File

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:next
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

The next builds typically include:

- **Experimental Features**: New functionality that is still being refined.
- **Bug Fixes**: Early access to fixes before they are officially released.
- **Performance Improvements**: Optimizations that are being tested for stability.

## Binary Downloads

Direct binary downloads from the latest next builds.

<BinaryDownloads />

## Feedback

If you encounter any issues while using the beta builds, please report them on our [GitHub Issues](https://github.com/getarcaneapp/arcane/issues) page. Your feedback helps us make Arcane better for everyone!
