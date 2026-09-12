---
title: 'Next Builds'
description: 'Try development builds of Arcane with the next image tags.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
import BinaryDownloads from '#lib/components/binary-downloads.svelte';
</script>

> [!CAUTION]
> Use these builds to test new features before release. They may contain bugs, incomplete features, or breaking changes. **Do not use these builds in production environments.**

## Overview

Next builds are Docker images built automatically from the `main` branch. They include changes that haven't reached a stable release yet.

## Docker Images

Next images use static binaries with Arcane's distroless runtime base.

Every build is published under three tags:

- `next` — always points to the most recent build.
- `next-static` — an alias of `next`, kept for existing setups.
- A versioned tag such as `v2.4.0-next.1` — a permanent tag for that specific build.

## Versioning

Versions follow the upcoming release: `v2.4.0-next.1`, `v2.4.0-next.2`, and so on until `v2.4.0` ships. The dashboard shows the build you're running.

### Arcane Manager (Next)

<Snippet class="m-2" text="ghcr.io/getarcaneapp/manager:next" />

### Arcane Agent (Next)

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
    restart: unless-stopped

volumes:
  arcane-data:
```

## Binary Downloads

<BinaryDownloads />

## Feedback

Report problems with next builds on [GitHub Issues](https://github.com/getarcaneapp/arcane/issues). Include the version shown in your dashboard so we can identify the build you tested.
