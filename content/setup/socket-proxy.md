---
title: 'Socket Proxy Setup'
description: 'Secure your Docker socket by using a proxy layer with Arcane.'
order: 4
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!NOTE] Enhanced Security Setup
> A Docker socket proxy adds an extra layer of safety by letting Arcane use only the Docker features it actually needs.

## Why Use a Socket Proxy?

By default, Arcane connects directly to the Docker socket (`/var/run/docker.sock`). That is simple, but it gives Arcane full access to Docker. A socket proxy adds a middle layer so you can:

- **Limit access** to only the Docker actions Arcane needs
- **Keep the Docker socket read-only** inside the proxy
- **Turn specific Docker features on or off**
- **Add another layer between Arcane and Docker**

## 1. Create **_compose.yaml_** with Socket Proxy:

```yaml
services:
  # Docker Socket Proxy - see https://github.com/Tecnativa/docker-socket-proxy
  docker-socket-proxy:
    image: tecnativa/docker-socket-proxy:latest
    container_name: arcane-docker-proxy
    environment:
      - EVENTS=1
      - PING=1
      - VERSION=1
      # Security critical
      - AUTH=0
      - SECRETS=0
      - POST=1
      # Not always needed
      - BUILD=0
      - COMMIT=0
      - CONFIGS=0
      - CONTAINERS=1
      - DISTRIBUTION=0
      - EXEC=1
      - IMAGES=1
      - INFO=1
      - NETWORKS=1
      - NODES=0
      - PLUGINS=0
      - SERVICES=0
      - SESSION=0
      - SWARM=0
      - SYSTEM=0
      - TASKS=0
      - VOLUMES=1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - arcane-internal
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true

  arcane:
    image: ghcr.io/getarcaneapp/arcane:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - arcane-data:/app/data
    environment:
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
      - DOCKER_HOST=tcp://docker-socket-proxy:2375
    networks:
      - arcane-internal
    depends_on:
      - docker-socket-proxy
    healthcheck:
      test: ['CMD-SHELL', 'curl -fsS http://localhost:3552/api/health >/dev/null || exit 1']
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 15s
    restart: unless-stopped

networks:
  arcane-internal:
    driver: bridge
    name: arcane-internal

volumes:
  arcane-data:
    name: arcane-data
```

## 2. Key Configuration Details:

### Socket Proxy Environment Variables

The socket proxy uses environment variables as simple switches. Use `1` to allow something and `0` to block it:

**Required for Arcane:**

- `EVENTS=1` - lets Arcane watch for Docker activity
- `CONTAINERS=1` - lets Arcane manage containers
- `EXEC=1` - lets Arcane run commands inside containers
- `IMAGES=1` - lets Arcane manage images
- `NETWORKS=1` - lets Arcane manage networks
- `VOLUMES=1` - lets Arcane manage volumes
- `POST=1` - lets Arcane create or update things
- `DISTRIBUTION=1` - lets Arcane inspect images and check for image updates.

**System Information:**

- `PING=1` - health checks
- `VERSION=1` - Docker version info
- `INFO=1` - Docker system info

**Security Critical (Disabled):**

- `AUTH=0` - blocks authentication-related APIs
- `SECRETS=0` - blocks Docker secrets access

**Optional (Disabled):**

- `BUILD=0` - blocks image builds
- `COMMIT=0` - blocks container commits
- `CONFIGS=0` - blocks Docker configs
- `NODES=0` - blocks node management
- `PLUGINS=0` - blocks plugin management
- `SERVICES=0` - blocks Swarm services
- `SESSION=0` - blocks session management
- `SWARM=0` - blocks Docker Swarm features
- `SYSTEM=0` - blocks system-wide operations
- `TASKS=0` - blocks Swarm tasks

### Arcane Configuration

The only Arcane setting you usually need here is:

<Snippet text="DOCKER_HOST=tcp://docker-socket-proxy:2375" class="mt-2" />

This tells Arcane to use the proxy instead of connecting directly to Docker.

## 3. Generating secrets

You can generate the required secrets with the Arcane CLI in a temporary container or with your computer's `openssl` command.

Via Docker Container:

<Snippet text="docker run --rm ghcr.io/getarcaneapp/arcane:latest /app/arcane generate secret" class="mt-2" />

Standalone Arcane Binary:

<Snippet text="arcane-cli generate secret" class="mt-2" />

## 4. Start the Project

```bash
docker compose up -d
```

The proxy starts first, then Arcane connects to it.

## 5. Access Arcane

Open <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup. The first time you sign in, you'll be asked to change the default admin password.

Username:
<Snippet text="arcane" class="mt-2 max-w-[300px]" />

Password:
<Snippet text="arcane-admin" class="mt-2 max-w-[300px]" />
