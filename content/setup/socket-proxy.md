---
title: 'Socket Proxy Setup'
description: 'Secure your Docker socket by using a proxy layer with Arcane.'
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!NOTE] Enhanced Security Setup
> Using a Docker socket proxy adds an extra layer of security by limiting Docker API access to only the endpoints Arcane needs.

## Why Use a Socket Proxy?

By default, Arcane connects directly to the Docker socket (`/var/run/docker.sock`). While convenient, this grants full Docker daemon access. A socket proxy acts as a security layer, allowing you to:

- **Limit API Access**: Only expose specific Docker API endpoints
- **Read-Only Socket**: Mount the Docker socket as read-only in the proxy
- **Fine-Grained Control**: Enable/disable individual Docker operations
- **Defense in Depth**: Add an isolation layer between Arcane and the Docker daemon

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
    image: ghcr.io/ofkm/arcane:latest
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

The socket proxy uses environment variables to control API endpoint access. Set to `1` to enable, `0` to disable:

**Required for Arcane:**
- `EVENTS=1` - Container event monitoring
- `CONTAINERS=1` - Container management
- `EXEC=1` - Execute commands in containers
- `IMAGES=1` - Image management
- `NETWORKS=1` - Network management
- `VOLUMES=1` - Volume management
- `POST=1` - Required for create/update operations

**System Information:**
- `PING=1` - Health checks
- `VERSION=1` - Docker version info
- `INFO=1` - Docker system info

**Security Critical (Disabled):**
- `AUTH=0` - Authentication APIs
- `SECRETS=0` - Docker secrets access

**Optional (Disabled):**
- `BUILD=0` - Image building
- `COMMIT=0` - Container commits
- `CONFIGS=0` - Docker configs
- `DISTRIBUTION=0` - Distribution APIs
- `NODES=0` - Node management
- `PLUGINS=0` - Plugin management
- `SERVICES=0` - Service management (Swarm)
- `SESSION=0` - Session management
- `SWARM=0` - Docker Swarm features
- `SYSTEM=0` - System-wide operations
- `TASKS=0` - Task management (Swarm)

### Arcane Configuration

Key environment variables for proxy integration:

<Snippet text="DOCKER_HOST=tcp://docker-socket-proxy:2375" class="mt-2" />

This tells Arcane to connect to the Docker API through the proxy instead of the direct socket.

**Generate secure keys:**

For ENCRYPTION_KEY and JWT Secret you can use the below command to generate these values:

<Snippet text="openssl rand -base64 32" class="mt-2 max-w-[300px]" />

## 4. Start the Project:

```bash
docker compose up -d
```

The proxy will start first, followed by Arcane which depends on it.

## 5. Access Arcane:

Go to <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup. After your first initial login, you will be asked to change the default admin password.

Username:
<Snippet text="arcane" class="mt-2 max-w-[300px]" />

Password:
<Snippet text="arcane-admin" class="mt-2 max-w-[300px]" />
