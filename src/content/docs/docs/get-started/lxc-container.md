---
title: 'LXC Container Setup'
description: 'Run Arcane inside an LXC container, such as on Proxmox, with host metrics visible.'
---

You need an LXC container with Docker installed and access to the LXC host's configuration. The container can be privileged, or unprivileged and configured for Docker.

## 1. Enable nesting

Docker needs nesting to run inside the container.

- **Proxmox:** enable **Nesting** under the container's **Options → Features**, or add this line to `/etc/pve/lxc/<CTID>.conf`:

  ```ini
  features: nesting=1
  ```

- **Plain LXC:** add this line to the container's config file:

  ```ini
  lxc.include = /usr/share/lxc/config/nesting.conf
  ```

## 2. Run the Manager

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

To generate the encryption key and mount your projects folder, see [Installation](/docs/get-started/installation).

## Run an agent

To use the LXC as a remote environment, run an agent. Set `pid: host` and mount `/proc` so the agent can read host process metrics:

```yaml
services:
  arcane-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-agent
    pid: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
      - /proc:/proc
    environment:
      - ARCANE_AGENT=true
      - ARCANE_AGENT_TOKEN=<your-agent-token>
      - ARCANE_MANAGER_API_URL=http://<manager-host>:3552
    restart: unless-stopped

volumes:
  agent-data:
```

- `ARCANE_MANAGER_API_URL`: your Arcane Manager URL.
- `ARCANE_AGENT_TOKEN`: the API key from [Remote Environments](/docs/remote/environments).
