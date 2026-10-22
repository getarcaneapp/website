---
title: 'LXC Container Setup'
description: 'Run Arcane inside an LXC container, such as on Proxmox, with host metrics visible.'
---

Configure an LXC container (such as on Proxmox) to run Arcane and report host system metrics.

You need an LXC container with Docker installed (privileged, or unprivileged and configured for Docker) and access to the LXC host configuration.

## Enable nesting for Docker

Enable nesting on the LXC host so Docker can run inside the container.

On plain LXC, add this line to the container's config file:

```ini
lxc.include = /usr/share/lxc/config/nesting.conf
```

On Proxmox, enable **Nesting** under the container's **Options → Features**, or add this line to `/etc/pve/lxc/<CTID>.conf`:

```ini
features: nesting=1
```

## Run the Manager

Mount `/sys/fs/cgroup` read-only so Arcane can read system metrics:

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
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    environment:
      - ARCANE_APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ARCANE_ENCRYPTION_KEY=<your-encryption-key>
    restart: unless-stopped

volumes:
  arcane-data:
```

See [Installation](/docs/get-started/installation) to generate your encryption key and mount your projects folder.

## Run an agent

Set `pid: host` and mount `/proc` so the agent can read host process metrics:

```yaml
services:
  arcane-edge-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-edge-agent
    pid: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
      - /proc:/proc
    environment:
      - ARCANE_EDGE_AGENT=true
      - ARCANE_AGENT_TOKEN=<your-agent-token>
      - ARCANE_MANAGER_API_URL=http://<manager-host>:3552
    restart: unless-stopped

volumes:
  agent-data:
```

Set `ARCANE_MANAGER_API_URL` to your Arcane Manager URL and `ARCANE_AGENT_TOKEN` to the API key from [Remote Environments](/docs/remote/environments).
