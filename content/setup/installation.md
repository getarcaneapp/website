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

> [!NOTE] This guide is for the full installation of Arcane.
> If you are looking to setup a remote environment see <Link href="/docs/features/environments">here</Link>. For enhanced security with a Docker socket proxy, see the <Link href="/docs/setup/socket-proxy">Socket Proxy Setup</Link> guide.

## Convenience Script

For Linux users, you can use our installation script to set up Arcane and all its dependencies (Docker, Node.js, Go) automatically.

<Snippet text="curl -fsSL https://getarcane.app/install.sh | bash" />

To uninstall:

<Snippet text="curl -fsSL https://getarcane.app/uninstall.sh | sudo bash -s -- --force --remove-all" />

## Docker Compose (Recommended)

If you prefer to use Docker Compose manually or are on a different platform:

## 1. Create **_compose.yaml_**:

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
      - AGENT_MODE=true
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
    restart: unless-stopped

volumes:
  arcane-data:
```

where ENCRYPTION_KEY must be 32 bytes (raw/base64/hex).

## 2. Review Volumes & Imports:

**_/var/run/docker.sock_**: Lets Arcane manage Docker.

**_arcane-data_**: Arcanes data directory. (for the database and projects)

> [!IMPORTANT]
> To manage existing compose projects, you must mount your projects folder with **matching paths** inside and outside the container.
>
> For example, if your projects are at `/opt/docker` on the host:
> - Mount: `/opt/docker:/opt/docker` (not `/opt/docker:/app/data/projects`)
> - Set the projects directory in Arcane to `/opt/docker`
>
> This ensures that file paths in your compose files (like `./config` or relative volume mounts) resolve correctly both inside Arcane and when Docker executes on the host.
> Projects are only available if `AGENT_MODE` is set to `true` or if `UI_CONFIGURATION_DISABLED` is set to `true`, see <Link href="/docs/configuration/environment">.

## 3. Generating secrets

You can use the Arcane CLI inside a temporary container to generate secrets in the format arcane supports, or you can use the host OSes `openssl` command as previously documented.

Via Docker Container:

<Snippet text="docker run --rm ghcr.io/getarcaneapp/arcane:latest /app/arcane generate secret" class="mt-2" />

Standalone Arcane Binary:

<Snippet text="arcane-cli generate secret" class="mt-2" />

## 4. Start Arcane:

```bash
docker compose up -d
```

## 5. Access Arcane:

Go to <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup. After your first initial login, you will be asked to change the default admin password. The default credentials are shown below.

Username:
<Snippet text="arcane" class="mt-2 max-w-75" />

Password:
<Snippet text="arcane-admin" class="mt-2 max-w-75" />

## 6. Using a Custom Domain or Reverse Proxy?

> [!NOTE]
> Arcane uses WebSockets for real-time communication. If you're setting up Arcane behind a reverse proxy or custom domain, you'll need to ensure WebSocket support is properly configured.
>
> See the <Link href="/docs/configuration/websockets-reverse-proxies">WebSocket Configuration Guide</Link> for detailed instructions on configuring Nginx, Apache, and other reverse proxies.

## Next (Preview) Builds

Interested in trying out the latest features before they are officially released? Check out our <Link href="/docs/setup/next-images">Next Builds</Link> guide for information on how to use the `:next` or `:next-distroless` images.
