---
title: 'Socket Proxy'
description: 'Limit what Arcane can do through the Docker socket by putting a proxy in front of it.'
---

> [!NOTE]
> A Docker socket proxy is a small container that forwards only the Docker API calls you allow. Mounting `/var/run/docker.sock` directly gives Arcane full control of Docker; a proxy gives it only what it needs, with the socket mounted read-only in the proxy.

Read [Installation](/docs/get-started/installation) first for the encryption key, projects folder, startup, and first login.

## Set up the proxy

1. Create a `compose.yaml` from an example below. Use **wollomatic/socket-proxy** (what the [Instance Generator](/generator) produces); use **Tecnativa** only if you already run it.
2. Replace `<your-encryption-key>` with your key and `/opt/docker` with your projects folder.
3. Run `docker compose up -d`. The proxy starts first, then Arcane connects to it through this setting:

```bash
DOCKER_HOST=tcp://docker-socket-proxy:2375
```

> [!NOTE]
> On SELinux hosts, add `:z` to host bind mounts Arcane manages, such as the projects, builds, and backups folders. `label:disable` is only needed when mounting the socket directly.

### wollomatic/socket-proxy

```yaml
services:
  docker-socket-proxy:
    image: wollomatic/socket-proxy:1.13.1
    container_name: arcane-docker-proxy
    user: '0:0'
    command:
      - '-listenip=0.0.0.0'
      - '-allowfrom=arcane,arcane-upgrader'
      - '-allowhealthcheck'
      - '-allowGET=(/v[\d.]+)?/_ping'
      - '-allowGET=(/v[\d.]+)?/events(/.*)?'
      - '-allowGET=(/v[\d.]+)?/version'
      - '-allowGET=(/v[\d.]+)?/info(/.*)?'
      - '-allowGET=(/v[\d.]+)?/system/df'
      - '-allowGET=(/v[\d.]+)?/containers(/.*)?'
      - '-allowGET=(/v[\d.]+)?/exec(/.*)?'
      - '-allowGET=(/v[\d.]+)?/images(/.*)?'
      - '-allowGET=(/v[\d.]+)?/networks(/.*)?'
      - '-allowGET=(/v[\d.]+)?/volumes(/.*)?'
      - '-allowGET=(/v[\d.]+)?/distribution(/.*)?'
      - '-allowGET=(/v[\d.]+)?/swarm(/.*)?'
      - '-allowGET=(/v[\d.]+)?/nodes(/.*)?'
      - '-allowGET=(/v[\d.]+)?/services(/.*)?'
      - '-allowGET=(/v[\d.]+)?/tasks(/.*)?'
      - '-allowGET=(/v[\d.]+)?/secrets(/.*)?'
      - '-allowGET=(/v[\d.]+)?/configs(/.*)?'
      - '-allowHEAD=(/v[\d.]+)?/_ping'
      - '-allowHEAD=(/v[\d.]+)?/version'
      - '-allowPOST=(/v[\d.]+)?/containers(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/exec(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/images(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/networks(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/volumes(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/commit'
      - '-allowPOST=(/v[\d.]+)?/build(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/session'
      - '-allowPOST=(/v[\d.]+)?/grpc'
      - '-allowPOST=(/v[\d.]+)?/auth'
      - '-allowPOST=(/v[\d.]+)?/swarm(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/nodes(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/services(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/secrets(/.*)?'
      - '-allowPOST=(/v[\d.]+)?/configs(/.*)?'
      - '-allowPUT=(/v[\d.]+)?/containers(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/containers(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/images(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/networks(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/volumes(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/nodes(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/services(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/secrets(/.*)?'
      - '-allowDELETE=(/v[\d.]+)?/configs(/.*)?'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    read_only: true
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ['CMD', './healthcheck']
      interval: 2s
      timeout: 5s
      retries: 15
    networks:
      - arcane-internal
    restart: unless-stopped

  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - arcane-data:/app/data
      - /opt/docker:/opt/docker:z
    environment:
      - ARCANE_ENCRYPTION_KEY=<your-encryption-key>
      - ARCANE_PROJECTS_DIRECTORY=/opt/docker
      - DOCKER_HOST=tcp://docker-socket-proxy:2375
    networks:
      - arcane-internal
    depends_on:
      - docker-socket-proxy
    healthcheck:
      test: ['CMD', './arcane', 'health', '--timeout', '2s']
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

wollomatic blocks any request whose method and path aren't allowed. The allowlist above is the minimum Arcane needs, including Swarm, builds, commits, BuildKit, registry auth, and image update checks.

`-allowfrom=arcane,arcane-upgrader` accepts Arcane and its self-upgrade helper. `arcane-upgrader` is a temporary alias on the helper's user-defined network, so the helper stays authorized while Arcane is replaced. `-allowhealthcheck` enables the proxy's healthcheck. If you rename the Arcane container, replace `arcane` with its name and keep `arcane-upgrader`; the proxy and helper must share a user-defined network.

> [!IMPORTANT]
> Existing installs using `-allowfrom=arcane` must add `arcane-upgrader` and recreate the proxy. Install the Arcane release with this fix once via Docker Compose (pull and recreate the Arcane service), because older versions create helpers without the alias, even with a newer helper image. Later self-upgrades use the updated allowlist; no subnet-wide access is needed.

### Tecnativa docker-socket-proxy

```yaml
services:
  docker-socket-proxy:
    image: tecnativa/docker-socket-proxy:latest
    container_name: arcane-docker-proxy
    environment:
      - EVENTS=1
      - PING=1
      - VERSION=1
      - AUTH=0
      - SECRETS=0
      - POST=1
      - BUILD=0
      - COMMIT=0
      - CONFIGS=0
      - CONTAINERS=1
      - DISTRIBUTION=1
      - EXEC=1
      - IMAGES=1
      - INFO=1
      - NETWORKS=1
      - NODES=0
      - PLUGINS=0
      - SERVICES=0
      - SESSION=0
      - SWARM=0
      - SYSTEM=1
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
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - arcane-data:/app/data
      - /opt/docker:/opt/docker:z
    environment:
      - ARCANE_ENCRYPTION_KEY=<your-encryption-key>
      - ARCANE_PROJECTS_DIRECTORY=/opt/docker
      - DOCKER_HOST=tcp://docker-socket-proxy:2375
    networks:
      - arcane-internal
    depends_on:
      - docker-socket-proxy
    healthcheck:
      test: ['CMD', './arcane', 'health', '--timeout', '2s']
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

Tecnativa switches API sections with environment variables: `1` allows, `0` blocks.

| Variable                                                            | Value | Why                                                                         |
| ------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------- |
| `EVENTS`, `CONTAINERS`, `EXEC`, `IMAGES`, `NETWORKS`, `VOLUMES`     | `1`   | Watch Docker activity and manage containers, images, networks, and volumes. |
| `POST`                                                              | `1`   | Create and change resources. Without it the proxy is read-only.             |
| `DISTRIBUTION`                                                      | `1`   | Inspect images and check for image updates.                                 |
| `PING`, `VERSION`, `INFO`                                           | `1`   | Health checks and Docker version and system info.                           |
| `SYSTEM`                                                           | `1`   | Allow `/system/df`, which scheduled pruning requires.                       |
| `AUTH`, `SECRETS`                                                   | `0`   | Block authentication and Docker secrets APIs.                               |
| `BUILD`, `COMMIT`, `CONFIGS`, `NODES`, `SERVICES`, `SWARM`, `TASKS` | `0`   | Block image builds, commits, and Swarm.                                     |
| `PLUGINS`, `SESSION`                                                | `0`   | Block plugin and session APIs.                                             |

> [!NOTE]
> This is narrower than the wollomatic allowlist. To use Swarm, image builds, or commits through Tecnativa, set `BUILD`, `COMMIT`, `SWARM`, `NODES`, `SERVICES`, `TASKS`, `SECRETS`, and `CONFIGS` to `1`.
