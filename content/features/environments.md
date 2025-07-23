---
title: 'Remote Environments'
description: 'Learn how to set up and manage remote Docker hosts using the Arcane agent for centralized container management.'
---

<script lang="ts">
import AgentEnvTable from '$lib/components/agent-env-table.svelte';
import ArchitectureDiagram from '$lib/components/architecture-diagram.svelte';
import * as Table from '$lib/components/ui/table/index.js';
</script>

## Overview

Remote Environments use the Arcane agent to expose the Docker API of a remote host. This allows for management of Docker resources from a centralized server.

### Architecture

<ArchitectureDiagram />

### Prerequisites

- Docker Engine 20.10+
- Network access to Arcane server
- User with Docker socket permissions

### Configuration

The agent supports the following environment variables:

<AgentEnvTable />

### Configuration File

Create a `.env` file for the agent:

```bash
AGENT_ID=arcane-agent-example
AGENT_LISTEN_ADDRESS=0.0.0.0
AGENT_PORT=3552
API_KEY=your-secret-api-key-here
```

## Installation Options

### Docker Compose

```yaml
services:
  arcane-agent:
    container_name: arcane-agent
    restart: unless-stopped
    environment:
      - AGENT_ID=arcane-agent-example
      - AGENT_LISTEN_ADDRESS=0.0.0.0
      - AGENT_PORT=3552
      - API_KEY=your-secret-api-key-here
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - $(pwd)/compose-projects:/data/compose-projects
    image: ghcr.io/ofkm/arcane-agent:latest
```

### Binary Installation

```bash
# Download the binary
wget https://github.com/ofkm/arcane-agent/releases/latest/download/arcane-agent-linux-amd64

# Make executable
chmod +x arcane-agent-linux-amd64

# Create configuration
cat > .env << EOF
AGENT_ID=arcane-agent-example
AGENT_LISTEN_ADDRESS=0.0.0.0
AGENT_PORT=3552
API_KEY=your-secret-api-key-here
EOF

# Run the agent
./arcane-agent-linux-amd64
```

## Updates

### Docker Updates

```bash
docker compose down
docker compose pull
docker compose up -d
```
