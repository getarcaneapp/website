---
title: 'Installation'
description: 'Install a new Arcane instance'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
import { h2 as Heading, h3 as SubHeading } from '#lib/components/markdown/index.js';
import InstallationTabs from '#lib/components/installation-tabs.svelte';
import * as Tabs from '#lib/components/ui/tabs/index.js';
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
import Collapsible from '#lib/components/collapsible.svelte';
</script>

> [!NOTE]
> For remote Docker hosts, see <Link href="/docs/features/environments">Remote Environments</Link>. To restrict Docker access, see <Link href="/docs/security/socket-proxy">Socket Proxy Setup</Link>.

<InstallationTabs>

<Tabs.Content value="docker" data-install-method="docker">

## 1. Generate an encryption key

Arcane needs an `ENCRYPTION_KEY` that is 32 bytes long (raw, base64, or hex). Generate one with any of these commands and copy the output:

With a temporary Arcane container:

<Snippet text="docker run --rm ghcr.io/getarcaneapp/manager:latest /app/arcane generate secret" class="mt-2" />

With the Arcane CLI, if you already have it installed:

<Snippet text="arcane-cli generate secret" class="mt-2" />

With OpenSSL:

<Snippet text="openssl rand -hex 32" class="mt-2" />

> [!NOTE]
> `JWT_SECRET` is no longer used — session tokens are now signed with an ML-DSA-87 key that Arcane generates and stores itself. If it's still set, Arcane logs a warning at startup; remove it from your environment.

## 2. Create `compose.yaml`

Paste your key in place of `<your-encryption-key>`, and replace `/opt/docker` with the folder where your Compose projects live (or where you want Arcane to create them):

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
      - /opt/docker:/opt/docker
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=<your-encryption-key>
      - PROJECTS_DIRECTORY=/opt/docker
    cgroup: host
    restart: unless-stopped

volumes:
  arcane-data:
```

> [!NOTE]
> Official Arcane manager and agent images start as root only for startup preparation, then drop to a non-root runtime user by default. Set `PUID` and `PGID` when you want Arcane-created files to use a specific host UID/GID. If you omit them, Arcane uses its built-in non-root user (`65532:65532`).

<SubHeading id="existing-compose-projects">Projects folder</SubHeading>

> [!IMPORTANT]
> The projects folder path must be the same inside and outside the container, and it must be absolute (`/opt/docker`, not `opt/docker`).
>
> - Mount: `/opt/docker:/opt/docker` (not `/opt/docker:/app/data/projects`)
> - Set `PROJECTS_DIRECTORY=/opt/docker` in the environment (or the Arcane setting) so path resolution works immediately on startup.
>
> Matching paths let Arcane and Docker resolve relative mounts such as `./config`, and let Arcane manage Compose projects you already have.

## 3. Start Arcane

```bash
docker compose up -d
```

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

<ScreenshotFrame
  src="/img/screenshots/dashboard.jpeg"
  alt="Arcane dashboard showing running containers, images, volumes, and host resource usage."
  caption="After signing in, the dashboard summarizes your environment and its resource usage."
  loading="lazy"
  decoding="async"
/>

## More setup options

You don't need any of these to get started. Expand a section if it applies to your setup.

<Collapsible id="folders-and-volumes" title="Folders and volumes" description="What each mount is for, plus optional build and backup folders.">

**_/var/run/docker.sock_**: Gives Arcane access to Docker.

**_arcane-data_**: Stores Arcane's database and project data.

**_/builds_**: Optional folder for build files used by the Build Workspace. You can map a host folder or a Docker volume here.

**_/backups_**: Optional folder for exported backups. Use this if you want backups stored somewhere you can easily find them.

> [!TIP]
> To use the optional folders, add them to the `volumes:` list in your `compose.yaml`:
>
> - `/builds`: used by the **Build Workspace** for Dockerfiles and build contexts.
>   - Host path example: `/srv/arcane/builds:/builds`
>   - Docker volume example: `arcane-builds:/builds`
> - `/backups`: used to store exported volume backups somewhere predictable.
>   - Host path example: `/srv/arcane/backups:/backups`
>   - Docker volume example: `arcane-backups:/backups`
>
> If you use named Docker volumes, remember to declare them under the top-level `volumes:` section too.

</Collapsible>

<Collapsible id="selinux-hosts" title="SELinux hosts" description="Use a socket proxy or relabel the Docker socket mount.">

If you're running on SELinux-enabled systems, use one of these options:

#### A) Use socket proxy (recommended)

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
      - /opt/docker:/opt/docker:z
    environment:
      - PROJECTS_DIRECTORY=/opt/docker
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=<your-encryption-key>
      - DOCKER_HOST=tcp://docker-socket-proxy:2375

volumes:
  arcane-data:
```

#### B) Direct socket mount (legacy mode)

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
      - /opt/docker:/opt/docker:z
    environment:
      - PROJECTS_DIRECTORY=/opt/docker
```

</Collapsible>

<Collapsible id="container-health-check" title="Container health check" description="Add a Docker health check using the built-in arcane health command.">

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

</Collapsible>

<Collapsible id="7-using-a-custom-domain-or-reverse-proxy" title="Reverse proxy" description="Enable WebSocket support when Arcane is behind a proxy or custom domain.">

> [!NOTE]
> Arcane uses WebSockets to stay connected in real time. If you're putting Arcane behind a reverse proxy or custom domain, make sure WebSocket support is enabled.
>
> See the <Link href="/docs/networking/websockets-reverse-proxies">WebSocket Configuration Guide</Link> for setup steps for Nginx, Apache, and other reverse proxies.

</Collapsible>

<Collapsible id="8-behind-an-outbound-http-proxy" title="Outbound HTTP proxy" description="Route Arcane's outbound traffic through an HTTP proxy.">

If Arcane needs to reach the internet through a proxy, for example to download templates or check for updates, see the <Link href="/docs/networking/proxy">HTTP Proxy Configuration Guide</Link>.

</Collapsible>

<Collapsible id="supported-architectures" title="Supported architectures" description="CPU architectures available for the images and binaries.">

The `manager` and `agent` images are published for:

- `linux/amd64`
- `linux/arm64`
- `linux/arm/v7`
- `linux/riscv64`

Docker selects your host's architecture automatically. CLI and agent binaries on <Link href="https://github.com/getarcaneapp/arcane/releases/latest">GitHub Releases</Link> also cover Linux `386` and macOS (`amd64`, `arm64`).

</Collapsible>

## Next (Preview) Builds

To test features that are still in development, see the <Link href="/docs/upgrade/next-images">Next Builds</Link> guide for the `:next` images.
