---
title: 'Installation'
description: 'Get Arcane running fast with Docker Compose.'
order: 1
---

<script lang="ts">
import SetupCode from '$lib/components/setup-code.svelte';
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!NOTE] This guide walks you through a full Arcane installation.
> If you want to use Arcane with a remote server, see <Link href="/docs/features/environments">the remote environments guide</Link>. If you want extra protection for Docker access, see the <Link href="/docs/setup/socket-proxy">Socket Proxy Setup</Link> guide.

## Docker Compose (Recommended)

If you'd rather set things up yourself, or if you're on a different platform, use Docker Compose:

## 1. Create `compose.yaml`:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /host/path/to/projects:/app/data/projects
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
    restart: unless-stopped

volumes:
  arcane-data:
```

> [!NOTE]
> The `ENCRYPTION_KEY` must be 32 bytes long (raw, base64, or hex).
>
> ```bash
> # You can use OpenSSL in your terminal to generate the secrets
> echo "      - ENCRYPTION_KEY=$(openssl rand -hex 32)"
> echo "      - JWT_SECRET=$(openssl rand -hex 32)"
> ```

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

**_/var/run/docker.sock_**: Gives Arcane access to Docker.

**_arcane-data_**: Arcane's data folder, which stores things like the database and project data.

**_/builds_**: Optional folder for build files used by the Build Workspace. You can map a host folder or a Docker volume here.

**_/backups_**: Optional folder for exported backups. Use this if you want backups stored somewhere you can easily find them.

> [!IMPORTANT]
> To manage an existing Compose project, the project folder path must match inside and outside the container.
> All paths must be absolute, for example `/opt/docker` instead of `opt/docker`.
>
> For example, if your projects are at `/opt/docker` on the host:
>
> - Mount: `/opt/docker:/opt/docker` (not `/opt/docker:/app/data/projects`)
> - Set the projects directory in Arcane to `/opt/docker` or set `PROJECTS_DIRECTORY=/opt/docker` in the environment for this to take effect immediately on startup of Arcane.
>
> This helps Arcane and Docker agree on where your files live, so paths like `./config` work the way you expect.

## 3. Generate your secrets

You can generate the required secrets either with the Arcane CLI in a temporary container or with your computer's `openssl` command.

Via Docker Container:

<Snippet text="docker run --rm ghcr.io/getarcaneapp/arcane:latest /app/arcane generate secret" class="mt-2" />

If you already have the Arcane CLI installed:

<Snippet text="arcane-cli generate secret" class="mt-2" />

## 4. Start Arcane

```bash
docker compose up -d
```

## 5. Open Arcane

Open <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup steps. The first time you sign in, you'll be asked to change the default admin password. Use these default credentials:

Username:
<Snippet text="arcane" class="mt-2 max-w-75" />

Password:
<Snippet text="arcane-admin" class="mt-2 max-w-75" />

## 6. Using a custom domain or reverse proxy?

> [!NOTE]
> Arcane uses WebSockets to stay connected in real time. If you're putting Arcane behind a reverse proxy or custom domain, make sure WebSocket support is enabled.
>
> See the <Link href="/docs/configuration/websockets-reverse-proxies">WebSocket Configuration Guide</Link> for setup steps for Nginx, Apache, and other reverse proxies.

## 7. Behind an outbound HTTP proxy?

If Arcane needs to reach the internet through a proxy, for example to download templates or check for updates, see the <Link href="/docs/configuration/proxy">HTTP Proxy Configuration Guide</Link>.

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

## Next (Preview) Builds

Want to try the latest features before they are officially released? See the <Link href="/docs/setup/next-images">Next Builds</Link> guide for the `:next` and `:next-distroless` images.
