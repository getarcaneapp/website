---
title: "TLS and HTTP/2"
description: "Set up Arcane with secure HTTPS/TLS and HTTP/2, using either a reverse proxy or direct TLS termination."
order: 6
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

This guide explains how to set up Arcane behind a reverse proxy or use built-in TLS certificates.

> [!NOTE]
> If you are using a reverse proxy, make sure WebSockets are configured correctly. See the <Link href="/docs/configuration/websockets-reverse-proxies">WebSocket Configuration</Link> guide.

Arcane supports two modes:

1. **Recommended for most users**: HTTPS/HTTP2 handled by a reverse proxy (like Nginx, Caddy, or Traefik).
2. **Direct Arcane HTTPS mode**: Arcane itself serves HTTPS and HTTP/2 using your certificate files.

## Before you start

If choosing to setup arcane in direct HTTPS mode you will need the following:

- Access to your Arcane `.env` file (or your container environment settings)
- A domain name (for example: `arcane.example.com`)
- A valid TLS certificate and private key file (if using Direct Arcane HTTPS mode)

> If you already use a reverse proxy that provides HTTPS, you usually **do not** need to configure certificate files in Arcane.

## Option A (Recommended): HTTPS handled by a reverse proxy

Use this option if your setup already has Nginx, Caddy, Traefik, or a cloud load balancer in front of Arcane.

### Settings

Set (or keep) these values:

- `TLS_ENABLED=false`
- `APP_URL=https://your-domain.com`

You can also change `PORT` if desired, as long as your reverse proxy points to the same internal Arcane port.

### Result

- End users connect securely over HTTPS.
- Arcane remains simple internally.
- This is the easiest and safest setup for most environments.

## Option B: Direct Arcane HTTPS + HTTP/2

Use this option only if Arcane is responsible for HTTPS directly.

### 1) Configure environment values

In your `.env` file (or equivalent environment config), set:

<Snippet text="TLS_ENABLED=true" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_CERT_FILE=/full/path/to/your/certificate.pem" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_KEY_FILE=/full/path/to/your/private-key.pem" class="mt-2 mb-2 w-full" />
<Snippet text="APP_URL=https://your-domain.com" class="mt-2 mb-2 w-full" />

Optional network settings:

<Snippet text="PORT=3552" class="mt-2 mb-2 w-full" />
<Snippet text="LISTEN=" class="mt-2 mb-2 w-full" />

- `PORT` can be changed to any available port if desired.
- Keep `LISTEN` empty to listen on all interfaces.

### 2) Restart Arcane

After saving settings, restart Arcane so changes take effect.

### 3) Confirm it is working

Open your Arcane URL in a browser:

- You should see the lock icon (HTTPS).
- The site should load normally.

## Important notes

- If `TLS_ENABLED=true`, Arcane requires **both**:
  - `TLS_CERT_FILE`
  - `TLS_KEY_FILE`
- If either file is missing or invalid, Arcane will not start correctly.
- **h2c** (unencrypted HTTP/2) is for non-TLS/internal use. For public access, use HTTPS.
- The default Arcane port is `3552`, but you can change `PORT` to another available port.

If you are unsure which option to choose, use **Option A (reverse proxy)**.
