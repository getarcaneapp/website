---
title: 'TLS and HTTP/2'
description: 'Serve Arcane over HTTPS through a reverse proxy or your own TLS certificates.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

For most installations, let your reverse proxy handle HTTPS. Use direct TLS if Arcane needs to serve HTTPS itself.

> [!NOTE]
> If you use a reverse proxy, make sure WebSockets are configured correctly. See the <Link href="/docs/networking/websockets-reverse-proxies">WebSocket Configuration</Link> guide.

## Before you start

For direct TLS, you need a domain name, a valid certificate and matching private key, and access to Arcane's `.env` or container settings. A reverse proxy handles the certificates for you.

## Option A: HTTPS handled by a reverse proxy

Set these values when Nginx, Caddy, Traefik, or another proxy handles HTTPS:

<Snippet text="TLS_ENABLED=false" class="mt-2 mb-2 w-full" />
<Snippet text="APP_URL=https://your-domain.com" class="mt-2 mb-2 w-full" />

Optional:

<Snippet text="PORT=3552" class="mt-2 mb-2 w-full" />

## Option B: Direct Arcane HTTPS + HTTP/2

### 1) Configure environment values

Set the following values in your `.env` file or container environment:

<Snippet text="TLS_ENABLED=true" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_CERT_FILE=/full/path/to/your/certificate.pem" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_KEY_FILE=/full/path/to/your/private-key.pem" class="mt-2 mb-2 w-full" />
<Snippet text="APP_URL=https://your-domain.com" class="mt-2 mb-2 w-full" />

Optional network settings:

<Snippet text="PORT=3552" class="mt-2 mb-2 w-full" />
<Snippet text="LISTEN=" class="mt-2 mb-2 w-full" />

Leave `LISTEN` empty to bind on all interfaces. The default port is `3552`.

### 2) Restart Arcane

Save the configuration and restart Arcane.

### 3) Confirm it is working

Open your `https://` URL and check that the browser reports a valid certificate.

## Important notes

- With `TLS_ENABLED=true`, both `TLS_CERT_FILE` and `TLS_KEY_FILE` must be valid or Arcane won't start correctly.
- Keep **h2c**, unencrypted HTTP/2, on internal networks. Use HTTPS for public access.
