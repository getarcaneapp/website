---
title: 'LXC Container Setup'
description: 'Run Arcane inside an LXC container with full system metrics visibility'
---

If you run Arcane inside an LXC container, such as on Proxmox, you'll need extra filesystem mounts to read host system metrics. The examples below cover mounts for the manager and agent.

## Prerequisites

- LXC container with Docker installed
- Privileged or properly configured unprivileged container
- Access to the LXC host configuration

## LXC Host Configuration

Before configuring Arcane, check the LXC container's permissions on your Proxmox host or LXC manager. You may need to enable nesting for Docker:

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
    image: ghcr.io/getarcaneapp/manager:latest
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
    image: ghcr.io/getarcaneapp/agent:latest
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
