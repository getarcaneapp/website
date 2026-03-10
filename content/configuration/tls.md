---
title: 'TLS and HTTP/2'
description: 'Set up Arcane with secure HTTPS/TLS and HTTP/2, using either a reverse proxy or direct TLS termination.'
order: 6
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

This guide explains how to run Arcane securely over HTTPS, either behind a reverse proxy or by letting Arcane handle TLS directly.

> [!NOTE]
> If you use a reverse proxy, make sure WebSockets are configured correctly. See the <Link href="/docs/configuration/websockets-reverse-proxies">WebSocket Configuration</Link> guide.

## Overview

Arcane supports two common HTTPS setups:

1. **Reverse proxy (recommended)** — Nginx, Caddy, Traefik, or a load balancer handles HTTPS in front of Arcane
2. **Direct TLS in Arcane** — Arcane serves HTTPS and HTTP/2 using your certificate files

## Before you start

If you plan to use direct TLS in Arcane, you will need:

- access to your Arcane `.env` file or container environment settings
- a domain name such as `arcane.example.com`
- a valid TLS certificate file
- a matching private key file

If your reverse proxy already provides HTTPS, you usually do **not** need to configure certificate files in Arcane itself.

## Option A: HTTPS handled by a reverse proxy

Use this when Arcane sits behind Nginx, Caddy, Traefik, or a cloud proxy.

### Recommended settings

<Snippet text="TLS_ENABLED=false" class="mt-2 mb-2 w-full" />
<Snippet text="APP_URL=https://your-domain.com" class="mt-2 mb-2 w-full" />

Optional:

<Snippet text="PORT=3552" class="mt-2 mb-2 w-full" />

### What this gives you

- HTTPS for end users
- simpler Arcane configuration
- easier certificate management
- the most common deployment model

## Option B: Direct Arcane HTTPS + HTTP/2

Use this when Arcane itself should terminate TLS.

### 1) Configure environment values

Set the following values in your `.env` file or container environment:

<Snippet text="TLS_ENABLED=true" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_CERT_FILE=/full/path/to/your/certificate.pem" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_KEY_FILE=/full/path/to/your/private-key.pem" class="mt-2 mb-2 w-full" />
<Snippet text="APP_URL=https://your-domain.com" class="mt-2 mb-2 w-full" />

Optional network settings:

<Snippet text="PORT=3552" class="mt-2 mb-2 w-full" />
<Snippet text="LISTEN=" class="mt-2 mb-2 w-full" />

Notes:

- `PORT` can be changed if needed
- leave `LISTEN` empty to bind on all interfaces

### 2) Restart Arcane

After saving the configuration, restart Arcane so the new TLS settings are applied.

### 3) Confirm it is working

Open your Arcane URL in a browser:

- the site should load over `https://`
- your browser should show a valid secure connection

## Important notes

- If `TLS_ENABLED=true`, Arcane requires **both** of these files:
  - `TLS_CERT_FILE`
  - `TLS_KEY_FILE`
- If either file is missing or invalid, Arcane will not start correctly
- **h2c** (unencrypted HTTP/2) is meant for internal or non-public use
- For public access, use HTTPS
- Arcane uses port `3552` by default unless you change `PORT`

## Which option should I use?

For most users, choose **Option A** and terminate HTTPS at a reverse proxy.

Choose **Option B** only when Arcane itself must serve TLS directly.
