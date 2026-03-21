---
title: 'Remote Environments'
description: 'Learn how to set up and manage remote Docker hosts using the Arcane agent for centralized container management.'
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

## Overview

Remote Environments let Arcane manage Docker hosts outside the main Arcane server.

You create the environment in Arcane, generate the agent settings, and run the Arcane Agent on the remote host. The Agent needs access to Docker on that host, usually through `/var/run/docker.sock`.

Arcane supports two connection modes:

- **Direct**: the Manager connects to the Agent API over TCP `3553`
- **Edge**: the Agent connects outbound to the Manager, so no inbound port is required on the remote host

## Transport modes

Connection mode and transport mode are related, but not the same thing:

- **`EDGE_TRANSPORT=auto`** picks the best connection method automatically. Arcane uses gRPC when it can and falls back to WebSocket if needed.
- **`EDGE_TRANSPORT=poll`** checks in from time to time instead of keeping a constant live tunnel open.

### What `poll` changes

In poll mode, this is expected behavior:

- **Standby** = the environment is healthy, but no live tunnel is open right now
- **Online** = the environment is connected right now
- The first action on an idle environment can take a moment while the connection starts

Generated agent snippets use `EDGE_TRANSPORT=poll` explicitly.

## Screenshot

<ScreenshotFrame
  src="/img/screenshots/environments-page.jpeg"
  alt="Remote environments page in Arcane"
  caption="Remote environments page in Arcane."
  loading="lazy"
  decoding="async"
/>

## Requirements

- Arcane Manager running and reachable from the Agent host
- Docker installed on the Agent host
- Permission to mount `/var/run/docker.sock`
- The environment must be created in Arcane before starting the Agent
- **Direct mode only:** the Manager must be able to reach the Agent on port `3553`
- **Edge mode only:** the Agent must be able to reach the Manager from inside your network

## Setup on the Arcane Manager (Direct)

1. Go to **Environments** and select **Add Environment**.
2. Enter the environment name.
3. Enter the Agent API URL, for example:
   - `http://my-new-agent:3553`
   - `https://10.1.1.5:3553`
4. Create the environment.
5. Copy the generated Docker run or Docker Compose command.
6. Start the Agent on the remote host.

Example Docker Compose:

```yaml
services:
  arcane-agent:
    image: ghcr.io/getarcaneapp/arcane-headless:latest
    container_name: arcane-agent
    ports:
      - '3553:3553'
    environment:
      - AGENT_MODE=true
      - EDGE_TRANSPORT=poll
      - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - MANAGER_API_URL=http://10.1.1.4:3552
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
    restart: unless-stopped

volumes:
  agent-data: {}
```

Start the Agent:

```bash
docker compose up -d
```

## Edge Agent (Outbound)

Edge mode is useful when the Manager cannot reach the remote host directly, such as behind NAT, firewalls, or private networks.

### Setup on the Arcane Manager (Edge)

1. Go to **Environments** and select **Add Environment**.
2. Open the **Edge** tab.
3. Enter the environment name and select **Generate Agent Configuration**.
4. Copy the generated Docker run or Docker Compose command.
5. Start the Agent on the remote host.

Example Docker Compose:

```yaml
services:
  arcane-edge-agent:
    image: ghcr.io/getarcaneapp/arcane-headless:latest
    container_name: arcane-edge-agent
    environment:
      - EDGE_AGENT=true
      - EDGE_TRANSPORT=poll
      - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - MANAGER_API_URL=http://10.1.1.4:3552
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
    restart: unless-stopped

volumes:
  agent-data: {}
```

Start the Edge Agent:

```bash
docker compose up -d
```

## Status meanings

If you use `EDGE_TRANSPORT=poll`, the most common statuses are:

- **Online**: a live tunnel is currently active
- **Standby**: the Agent is checking in successfully and waiting for demand
- **Pending**: the environment is created but not yet paired or fully connected
- **Offline / Error**: the Manager cannot currently use the environment

Standby is healthy. It does not mean the environment is broken.

## Managing Environment Settings

To update an environment later:

1. Open **Environments**.
2. Select the environment.
3. Update the settings you need.
4. Save the changes.

## Standalone Binary

You can also run the Agent as a standalone binary.

1. Download the latest release for your platform.
2. Place the binary on the target host.
3. Create a `.env` file.

> [!NOTE]
> `GIN_MODE=release` is required here because it is not injected automatically the way it is in the container image.

For standalone agents, choose the transport the same way:

- use `EDGE_TRANSPORT=poll` for on-demand tunnels and standby status
- use `EDGE_TRANSPORT=auto` for a continuously managed tunnel preference

Direct Agent example:

```env
GIN_MODE=release
AGENT_MODE=true
EDGE_TRANSPORT=poll
AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MANAGER_API_URL=http://10.1.1.4:3552
ENVIRONMENT=production
PORT=3553
LISTEN=127.0.0.1
```

Edge Agent example:

```env
GIN_MODE=release
EDGE_AGENT=true
EDGE_TRANSPORT=poll
AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MANAGER_API_URL=http://10.1.1.4:3552
ENVIRONMENT=production
```

`LISTEN` controls which interface the Agent binds to. Leave it empty to bind all interfaces.

Start the Agent:

<Snippet text="./arcane-agent" class="mt-2 mb-2 w-full" />

Or use inline environment variables:

<Snippet text="ENVIRONMENT=production GIN_MODE=release PORT=3553 LISTEN=127.0.0.1 AGENT_MODE=true EDGE_TRANSPORT=poll AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX MANAGER_API_URL=http://10.1.1.4:3552 ./arcane-agent" class="mt-2 mb-2 w-full" />
