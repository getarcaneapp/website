---
title: 'Installation'
description: 'Install Arcane with Docker Compose or the Linux install script.'
---

<script lang="ts">
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
import DocTabs from '#lib/components/doc-tabs.svelte';
import * as Tabs from '#lib/components/ui/tabs/index.js';
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
import Collapsible from '#lib/components/collapsible.svelte';
</script>

Arcane runs as a single container that manages Docker on the same host through the Docker socket. Install it with Docker Compose, or on Linux run the install script, which also sets up Docker.

> [!NOTE]
> To manage other Docker hosts later, add them as <Link href="/docs/remote/environments">remote environments</Link>. To restrict Docker access, see <Link href="/docs/security/socket-proxy">Socket Proxy</Link>.

<DocTabs label="Installation method" tabs={[{ value: 'docker', label: 'Docker' }, { value: 'script', label: 'Convenience script' }]}>

<Tabs.Content value="docker" data-tab="docker">

## 1. Generate an encryption key

Arcane needs an `ENCRYPTION_KEY` that is 32 bytes long (raw, base64, or hex). Generate one with any of these commands and copy the output.

With a temporary Arcane container:

<Snippet text="docker run --rm ghcr.io/getarcaneapp/manager:latest /app/arcane generate secret" class="mt-2" />

With the Arcane CLI, if you already have it installed:

<Snippet text="arcane-cli generate secret" class="mt-2" />

With OpenSSL:

<Snippet text="openssl rand -hex 32" class="mt-2" />

> [!NOTE]
> Arcane doesn't use `JWT_SECRET`. Session tokens are signed with an ML-DSA-87 key that Arcane generates and stores itself. If `JWT_SECRET` is still set, Arcane logs a warning at startup; remove it from your environment.

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
> The official images start as root only to prepare the container, then run as a non-root user. `PUID` and `PGID` set the host UID and GID that Arcane-created files belong to. If you leave them out, Arcane uses its built-in user `65532:65532`.

### Projects folder

> [!IMPORTANT]
> Mount your projects folder at the same path inside the container and set `PROJECTS_DIRECTORY` to that path, as in the example above. The path must be absolute (`/opt/docker`, not `opt/docker`). With matching paths, relative mounts such as `./config` resolve the same way for Arcane and Docker, and Arcane can manage the Compose projects already in that folder.
>
> A different container path, such as `/opt/docker:/app/data/projects`, also works. Arcane reads its own container mounts and translates project paths to host paths for Compose. To state the mapping yourself, set `PROJECTS_DIRECTORY=<containerPath>:<hostPath>`. If you don't set `PROJECTS_DIRECTORY`, Arcane uses `/app/data/projects`.

## 3. Start Arcane

```bash
docker compose up -d
```

</Tabs.Content>

<Tabs.Content value="script" data-tab="script">

## Run the install script

On Linux, the install script sets up Docker and Arcane for you:

<Snippet text="curl -fsSL https://getarcane.app/install.sh | sudo bash" />

### Uninstall

The recommended uninstall asks before it removes Arcane data, the Arcane user and group, or Docker:

<Snippet text="curl -fsSL https://getarcane.app/uninstall.sh -o /tmp/arcane-uninstall.sh && sudo bash /tmp/arcane-uninstall.sh" />

To remove everything without prompting:

> [!WARNING]
> This removes Arcane, its data, the Arcane user and group, and the Docker packages. Only use it if you want Docker gone from the machine too.

<Snippet class="mt-4" text="curl -fsSL https://getarcane.app/uninstall.sh | sudo bash -s -- --force --remove-all" />

</Tabs.Content>

</DocTabs>

## Open Arcane

Open <Link href="http://localhost:3552">localhost:3552</Link> in your browser and sign in with the default credentials below. Arcane asks you to change the password the first time you sign in.

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

| Mount                  | Purpose                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/var/run/docker.sock` | Gives Arcane access to Docker. To limit what Arcane can do, use a <Link href="/docs/security/socket-proxy">socket proxy</Link> instead. |
| `arcane-data`          | Stores Arcane's database and data.                                                                                                      |
| Projects folder        | Holds your Compose projects. See [Projects folder](#projects-folder).                                                                   |
| `/builds`              | Optional. Build contexts for the Build Workspace. See <Link href="/docs/docker/image-builds">Image Builds</Link>.                       |
| `/backups`             | Optional. Where exported backups are stored. See <Link href="/docs/docker/backups">Backups</Link>.                                      |

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

On SELinux hosts, pick one of these:

- **Use a socket proxy (recommended).** Run a Docker socket proxy, point Arcane at it with `DOCKER_HOST`, and add `:z` to the projects folder mount (`/opt/docker:/opt/docker:z`). <Link href="/docs/security/socket-proxy">Socket Proxy</Link> has the full Compose file.
- **Mount the socket directly.** If you can't run a proxy, disable SELinux labelling for the Arcane container and relabel the projects mount:

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

The Arcane image includes an `arcane health` command for Docker health checks. It calls Arcane's local `/api/health` endpoint and exits non-zero if the server isn't responding. Add it to your `compose.yaml`:

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

`start_period` gives Arcane time to run database migrations on first boot before failed checks count against `retries`.

</Collapsible>

<Collapsible id="external-postgres" title="External Postgres database" description="Store Arcane's data in Postgres instead of the built-in SQLite file.">

Arcane stores its data in a SQLite file inside `arcane-data` by default, which works well for most setups. To use Postgres instead, set `DATABASE_URL`:

<Snippet text="postgres://<db_username>:<db_password>@<postgres_url>:<postgres_port>/<postgres_db_name>" class="mt-2 mb-2 w-full" />

Replace each placeholder with your database's username, password, server address, port, and database name.

The default SQLite value, if you need to set it back, is:

<Snippet text="file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate" class="mt-2 mb-2 w-full" />

</Collapsible>

<Collapsible id="reverse-proxy" title="Reverse proxy" description="Enable WebSocket support when Arcane is behind a proxy or custom domain.">

> [!NOTE]
> Arcane uses WebSockets for live updates, so a reverse proxy in front of it must pass WebSocket connections through. <Link href="/docs/networking/reverse-proxy">Reverse Proxy</Link> has setup steps for Nginx, Apache, and other proxies.

</Collapsible>

<Collapsible id="outbound-http-proxy" title="Outbound HTTP proxy" description="Route Arcane's outbound traffic through an HTTP proxy.">

If Arcane has to reach the internet through a proxy, for example to download templates or check for updates, see <Link href="/docs/networking/outbound-proxy">Outbound Proxy</Link>.

</Collapsible>

<Collapsible id="supported-architectures" title="Supported architectures" description="CPU architectures available for the images and binaries.">

The `manager` and `agent` images are published for:

- `linux/amd64`
- `linux/arm64`
- `linux/arm/v7`
- `linux/riscv64`

Docker picks your host's architecture automatically. CLI and agent binaries on <Link href="https://github.com/getarcaneapp/arcane/releases/latest">GitHub Releases</Link> also cover Linux `386` and macOS (`amd64`, `arm64`).

</Collapsible>

<Collapsible id="preview-builds" title="Preview builds" description="Try features that haven't been released yet.">

Preview builds are published from the `main` branch under the `:next` image tag. They're for testing, not production. See <Link href="/docs/get-started/preview-builds">Preview Builds</Link>.

</Collapsible>
