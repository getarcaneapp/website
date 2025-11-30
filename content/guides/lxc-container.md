---
title: 'LXC Container Setup'
description: 'Run Arcane inside an LXC container with full system metrics visibility'
order: 4
---

Running Arcane inside an LXC container (such as on Proxmox) requires additional configuration to access host system metrics. This guide covers how to properly mount the necessary filesystems for full functionality.

## Prerequisites

- LXC container with Docker installed
- Privileged or properly configured unprivileged container
- Access to the LXC host configuration

## LXC Host Configuration

Before configuring Arcane, ensure your LXC container has the necessary permissions. On your Proxmox host or LXC manager, you may need to enable nesting and adjust features:

```bash
# Enable nesting for Docker support
lxc.include = /usr/share/lxc/config/nesting.conf

# For unprivileged containers, you may need:
features: nesting=1
```

## Arcane Configuration

To enable full system metrics visibility inside an LXC container, mount the `cgroup` and `proc` filesystems from the LXC host into the Arcane container.

### Basic Setup

Configure your `compose.yaml` with the required volume mounts:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      # Mount cgroup for system metrics (read-only)
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
    restart: unless-stopped

volumes:
  arcane-data:
```

## Agent Configuration

For Arcane agents running inside LXC containers, you'll need additional configuration to access process information from the host.

### Agent Setup with Host PID

Configure your agent's `compose.yaml` with host PID namespace and proc mount:

```yaml
services:
  arcane-agent:
    image: ghcr.io/getarcaneapp/arcane-agent:latest
    container_name: arcane-agent
    # Use host PID namespace for process visibility
    pid: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      # Mount proc for process metrics
      - /proc:/proc
    environment:
      - ARCANE_SERVER_URL=http://your-arcane-server:3552
      - AGENT_TOKEN=your-agent-token
    restart: unless-stopped
```

