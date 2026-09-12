---
title: 'Installation'
description: 'Install Arcane with Docker Compose and sign in for the first time.'
---

<script lang="ts">
import { h2 as Heading } from '#lib/components/markdown/index.js';
import InstallationTabs from '#lib/components/installation-tabs.svelte';
import * as Tabs from '#lib/components/ui/tabs/index.js';
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!NOTE]
> For remote Docker hosts, see <Link href="/docs/features/environments">Remote Environments</Link>. To restrict Docker access, see <Link href="/docs/security/socket-proxy">Socket Proxy Setup</Link>.

<InstallationTabs>

<Tabs.Content value="docker" data-install-method="docker">

## Docker Compose (Recommended)

## 1. Create `compose.yaml`:

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
      # Optional host project mount:
      # - /path/to/projects:/app/data/projects
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
    # Use the host cgroup namespace so Arcane can detect its own container ID
    # more reliably — this matters for self-upgrades.
    cgroup: host
    restart: unless-stopped

volumes:
  arcane-data:
```

> [!NOTE]
> The `ENCRYPTION_KEY` must be 32 bytes long (raw, base64, or hex).
>
> ```bash
> # You can use OpenSSL in your terminal to generate the secret
> echo "      - ENCRYPTION_KEY=$(openssl rand -hex 32)"
> ```
>
> `JWT_SECRET` is no longer used — session tokens are now signed with an ML-DSA-87 key that Arcane generates and stores itself. If it's still set, Arcane logs a warning at startup; remove it from your environment.

> [!TIP]
> You can also add extra folders in your `compose.yaml` if you want Arcane to keep build files or backups in a specific place:
>
> - `/builds`: used by the **Build Workspace** for Dockerfiles and build contexts.
>   - Host path example: `/srv/arcane/builds:/builds`
>   - Docker volume example: `arcane-builds:/builds`
> - `/backups`: used to store exported volume backups somewhere predictable.
>   - Host path example: `/srv/arcane/backups:/backups`
>   - Docker volume example: `arcane-backups:/backups`
>
> If you use named Docker volumes, remember to declare them under the top-level `volumes:` section too.

## 2. Understand the folders Arcane uses:

> [!NOTE]
> Official Arcane manager and agent images start as root only for startup preparation, then drop to a non-root runtime user by default. Set `PUID` and `PGID` when you want Arcane-created files to use a specific host UID/GID. If you omit them, Arcane uses its built-in non-root user (`65532:65532`).

**_/var/run/docker.sock_**: Gives Arcane access to Docker.

**_arcane-data_**: Stores Arcane's database and project data.

**_/builds_**: Optional folder for build files used by the Build Workspace. You can map a host folder or a Docker volume here.

**_/backups_**: Optional folder for exported backups. Use this if you want backups stored somewhere you can easily find them.

> [!IMPORTANT]
> To manage an existing Compose project, the project folder path must match inside and outside the container.
> All paths must be absolute, for example `/opt/docker` instead of `opt/docker`.
>
> For example, if your projects are at `/opt/docker` on the host:
>
> - Mount: `/opt/docker:/opt/docker` (not `/opt/docker:/app/data/projects`)
> - Set `PROJECTS_DIRECTORY=/opt/docker` in the environment (or the Arcane setting) so path resolution works immediately on startup.
>
> Matching paths let Arcane and Docker resolve relative mounts such as `./config`.

## 3. SELinux hosts and socket access mode

If you're running on SELinux-enabled systems, use one of these options:

### A) Use socket proxy (recommended)

Use the socket proxy page for full examples at <Link href="/docs/security/socket-proxy">Socket Proxy Setup</Link>. This is the recommended layout for SELinux and hardened hosts.

```yaml
services:
  docker-socket-proxy:
    image: tecnativa/docker-socket-proxy:latest
    container_name: arcane-docker-proxy
    privileged: true
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

  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - arcane-data:/app/data
      - /path/to/projects:/app/data/projects:z
    environment:
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - DOCKER_HOST=tcp://docker-socket-proxy:2375

volumes:
  arcane-data:
```

### B) Direct socket mount (legacy mode)

For environments where socket proxy is not possible, keep the direct socket mount and add SELinux options:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    security_opt:
      - label:disable
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /path/to/projects:/app/data/projects:z
```

> [!TIP]
> If you change the container mount path for projects, set `PROJECTS_DIRECTORY` to that container path (for example `/app/data/projects`) unless it stays at the default.

## 4. Generate your secrets

You can generate the required secrets either with the Arcane CLI in a temporary container or with your computer's `openssl` command.

Via Docker Container:

<Snippet text="docker run --rm ghcr.io/getarcaneapp/manager:latest /app/arcane generate secret" class="mt-2" />

If you already have the Arcane CLI installed:

<Snippet text="arcane-cli generate secret" class="mt-2" />

## 5. Start Arcane

```bash
docker compose up -d
```

## Supported architectures

The `manager` and `agent` images are published for:

- `linux/amd64`
- `linux/arm64`
- `linux/arm/v7`
- `linux/riscv64`

Docker selects your host's architecture automatically. CLI and agent binaries on <Link href="https://github.com/getarcaneapp/arcane/releases/latest">GitHub Releases</Link> also cover Linux `386` and macOS (`amd64`, `arm64`).

## Container health check

The Arcane image ships an `arcane health` command for use as a Docker health check. It makes a local request to Arcane's `/api/health` endpoint and exits non-zero if the server isn't responding. Add it to your `compose.yaml`:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    # ...
    healthcheck:
      test: ['CMD', './arcane', 'health', '--timeout', '2s']
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 15s
```

The `start_period` gives Arcane time to run migrations on first boot before failed checks count against `retries`.

</Tabs.Content>

<Tabs.Content value="script" data-install-method="script">

## Convenience Script

If you're using Linux, you can run our installer to set up Arcane and Docker for you.

<Snippet text="curl -fsSL https://getarcane.app/install.sh | sudo bash" />

To uninstall:

### Safe uninstall, recommended

This version asks before removing Arcane data, the Arcane user/group, or Docker.

<Snippet text="curl -fsSL https://getarcane.app/uninstall.sh -o /tmp/arcane-uninstall.sh && sudo bash /tmp/arcane-uninstall.sh" />

### Full cleanup, use with caution

> [!WARNING]
> This removes Arcane, its data, the Arcane user/group, and Docker packages.
> Only use this if you really want Docker removed from the machine too.

<Snippet class="mt-4" text="curl -fsSL https://getarcane.app/uninstall.sh | sudo bash -s -- --force --remove-all" />

</Tabs.Content>

</InstallationTabs>

<Heading id="6-open-arcane">Open Arcane</Heading>

Open <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup steps. The first time you sign in, you'll be asked to change the default admin password. Use these default credentials:

Username:
<Snippet text="arcane" class="mt-2 max-w-75" />

Password:
<Snippet text="arcane-admin" class="mt-2 max-w-75" />

<Heading id="7-using-a-custom-domain-or-reverse-proxy">Reverse proxy</Heading>

> [!NOTE]
> Arcane uses WebSockets to stay connected in real time. If you're putting Arcane behind a reverse proxy or custom domain, make sure WebSocket support is enabled.
>
> See the <Link href="/docs/networking/websockets-reverse-proxies">WebSocket Configuration Guide</Link> for setup steps for Nginx, Apache, and other reverse proxies.

<Heading id="8-behind-an-outbound-http-proxy">Outbound HTTP proxy</Heading>

If Arcane needs to reach the internet through a proxy, for example to download templates or check for updates, see the <Link href="/docs/networking/proxy">HTTP Proxy Configuration Guide</Link>.

## Next (Preview) Builds

To test features that are still in development, see the <Link href="/docs/upgrade/next-images">Next Builds</Link> guide for the `:next` images.
