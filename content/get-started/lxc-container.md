---
title: 'LXC Container Setup'
description: 'Run Arcane inside an LXC container, such as on Proxmox, with host metrics visible.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

If you run Arcane inside an LXC container, such as on Proxmox, it needs a few extra mounts to read system metrics. This page covers the container settings and the Compose files for the Manager and an agent.

You need an LXC container with Docker installed (privileged, or unprivileged and configured to run Docker) and access to its configuration on the LXC host.

## Enable nesting for Docker

Docker inside LXC usually needs nesting enabled. Add it to the container's configuration on the host.

On plain LXC, add this to the container's config file:

```ini
lxc.include = /usr/share/lxc/config/nesting.conf
```

On Proxmox, add this to `/etc/pve/lxc/<CTID>.conf`, or enable **Nesting** under the container's **Options → Features**:

```ini
features: nesting=1
```

## Run the Manager

Mount the cgroup filesystem read-only so Arcane can read system metrics:

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
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=<your-encryption-key>
    restart: unless-stopped

volumes:
  arcane-data:
```

See <Link href="/docs/get-started/installation">Installation</Link> for generating the encryption key and mounting your projects folder.

## Run an agent

An agent inside LXC also needs the host PID namespace (`pid: host`) and `/proc` mounted so it can see process information:

```yaml
services:
  arcane-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-agent
    pid: host
    ports:
      - '3553:3553'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
      - /proc:/proc
    environment:
      - AGENT_MODE=true
      - AGENT_TOKEN=<your-agent-token>
      - MANAGER_API_URL=http://<manager-host>:3552
    restart: unless-stopped

volumes:
  agent-data:
```

`MANAGER_API_URL` is the address of your Arcane Manager, and `AGENT_TOKEN` comes from the environment you create for this host. See <Link href="/docs/remote/environments">Remote Environments</Link>.
