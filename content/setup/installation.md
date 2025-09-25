---
title: 'Installation'
description: 'Get Arcane running fast with Docker Compose.'
---

<script lang="ts">
import SetupCode from '$lib/components/setup-code.svelte';
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!NOTE] This guide is for the full installation of Arcane.
> If you are looking to setup a remote environment see <Link href="/docs/features/environments">here</Link>

## 1. Create **_compose.yaml_**:

```yaml
services:
  arcane:
    image: ghcr.io/ofkm/arcane:latest
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

where ENCRYPTION_KEY must be 32 bytes (raw/base64/hex).

## 2. Review Volumes & Imports:

**_/var/run/docker.sock_**: Lets Arcane manage Docker.

**_arcane-data_**: Arcanes data directory. (for the database and projects)

To manage existing compose projects, in addition to mounting your compose projects folder to the `/app/data/projects` folder, you may need to also mount any additional folders you wish to use for config files.

## 3. Start Arcane:

```bash
docker compose up -d
```

## 4. Access Arcane:

Go to <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup, the default credentials are shown below.

Username:
<Snippet text="arcane" class="mt-2 max-w-[300px]" />

Password:
<Snippet text="arcane-admin" class="mt-2 max-w-[300px]" />

## 5. If you have a custom domain:

Arcane uses websockets, if you are using a reverse proxy to set Arcane behind a custom domain
you will need to ensure that it supports websockets and is configured correctly.

As an example, here is a sample Nginx configuration, the specific rules are under `# WebSocket support`:

```nginxconf
server {
   listen 80;
   server_name arcane.yourdomain.com;
   # Redirection from HTTP site to HTTPS
   return 301 https://$host$request_uri;
}

server {
        listen 443 ssl http2;

        ssl_certificate        /etc/letsencrypt/live/arcane.yourdomain.com/fullchain.pem;
        ssl_certificate_key    /etc/letsencrypt/live/arcane.yourdomain.com/privkey.pem;

        server_name arcane.yourdomain.com;

        add_header X-Frame-Options "*";

        location / {
                add_header X-Robots-Tag "noindex, nofollow";
                proxy_pass http://127.0.0.1:3552;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                # WebSocket support
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_cache_bypass $http_upgrade;
        }

        access_log /var/log/nginx/arcane-access.log;
        error_log /var/log/nginx/arcane-error.log debug;
}
```

Full documentation for some common reverse proxies is linked below, all from [websocket.org](https://websocket.org/):
- [Nginx](https://websocket.org/guides/infrastructure/nginx/)
- [Amazon ALB](https://websocket.org/guides/infrastructure/aws/alb/)
- [Cloudflare](https://websocket.org/guides/infrastructure/cloudflare/)
- [K8s](https://websocket.org/guides/infrastructure/kubernetes/)
