---
title: 'arcane upgrade'
description: 'Upgrade an Arcane container from outside the container itself.'
---

<script lang="ts">
import CliCommand from '$lib/components/cli-command.svelte';
import { ARCANE_COMMANDS } from '$lib/config/cli-commands.js';
</script>

<CliCommand command={ARCANE_COMMANDS.upgrade} />

## Overview

The `arcane upgrade` command allows you to upgrade an Arcane container from outside the container itself. This solves the complexity of self-upgrade by running the upgrade process from a separate context.

## Usage Examples

### Auto-detect and upgrade

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/getarcaneapp/arcane:latest \
  upgrade --auto
```

### Upgrade a specific container

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/getarcaneapp/arcane:latest \
  upgrade --container arcane
```

### Upgrade to a specific image tag

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/getarcaneapp/arcane:latest \
  upgrade --container arcane --image ghcr.io/getarcaneapp/arcane:v1.2.3
```

## Docker Compose Setup

Add an upgrader service to your compose file:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:latest
    container_name: arcane
    # ... your existing config ...

  upgrader:
    image: ghcr.io/getarcaneapp/arcane:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    entrypoint: ['/app/arcane']
    command: ['upgrade', '--auto']
    profiles:
      - tools
```

Then upgrade with:

```bash
docker compose run --rm upgrader
```

## How It Works

1. **Detects** the running Arcane container (or uses specified name)
2. **Determines** the current image tag (e.g., `ghcr.io/getarcaneapp/arcane:v1.2.3`)
3. **Pulls** the latest image with that tag
4. **Stops** the old container (freeing ports)
5. **Creates** a new container with the new image
6. **Starts** the new container
7. **Removes** the old container
8. **Renames** the new container to the original name

## Tag Preservation

The upgrade command automatically preserves your current tag:

* Running `arcane:v1.2.3` → upgrades to latest `v1.2.3`
* Running `arcane:self-update` → upgrades to latest `self-update`
* Running `arcane:latest` → upgrades to latest `latest`

This ensures you stay on your intended version channel.

## Advantages

✅ **No self-termination issues** - runs from outside the container  
✅ **No port conflicts** - old container stopped before new one starts  
✅ **Clean naming** - properly restores original container name  
✅ **Tag preservation** - stays on your version channel  
✅ **Rollback on failure** - restarts old container if upgrade fails

## Example Output

```
INFO Auto-detecting Arcane container...
INFO Found Arcane container name=arcane id=abc123def456

INFO Determined image to pull image=ghcr.io/getarcaneapp/arcane:self-update

INFO Pulling new image image=ghcr.io/getarcaneapp/arcane:self-update

INFO Starting container upgrade container=arcane

INFO Stopping old container name=arcane

INFO Creating new container tempName=arcane-upgrading

INFO Starting new container id=xyz789abc123

INFO Removing old container id=abc123def456

INFO Renaming new container from=arcane-upgrading to=arcane

INFO ✅ Upgrade completed successfully container=arcane image=ghcr.io/getarcaneapp/arcane:self-update
```
