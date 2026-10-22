---
title: 'TLS and HTTP/2'
description: 'Serve Arcane over HTTPS through a reverse proxy or your own TLS certificates.'
---

For most installations, let a reverse proxy handle HTTPS (Option A). Otherwise Arcane can serve HTTPS itself with your certificate (Option B).

## Option A: HTTPS handled by a reverse proxy

Set these when Nginx, Caddy, Traefik, or another proxy handles HTTPS. `ARCANE_PORT` is optional and defaults to `3552`.

```bash
ARCANE_TLS_ENABLED=false
```

```bash
ARCANE_APP_URL=https://your-domain.com
```

> [!NOTE]
> The proxy also needs to forward WebSockets. See [Reverse Proxy Setup](/docs/networking/reverse-proxy).

## Option B: Direct Arcane HTTPS and HTTP/2

You need a domain name, a valid certificate and private key, and access to Arcane's `.env` or container settings. Arcane won't start with `ARCANE_TLS_ENABLED=true` unless both `ARCANE_TLS_CERT_FILE` and `ARCANE_TLS_KEY_FILE` are set.

1. Set these in your `.env` file or container environment:

```bash
ARCANE_TLS_ENABLED=true
```

```bash
ARCANE_TLS_CERT_FILE=/full/path/to/your/certificate.pem
```

```bash
ARCANE_TLS_KEY_FILE=/full/path/to/your/private-key.pem
```

```bash
ARCANE_APP_URL=https://your-domain.com
```

2. Optionally set `ARCANE_PORT` (default `3552`) and `ARCANE_LISTEN` (empty binds all interfaces).
3. Restart Arcane.
4. Open your `https://` URL and check the browser reports a valid certificate.

## HTTP/2 without TLS

When `ARCANE_TLS_ENABLED=false`, Arcane accepts HTTP/1.1 and **h2c** (HTTP/2 without encryption) on the same port. Proxies use h2c to forward gRPC, such as the Edge Agent tunnel. Keep h2c internal; use HTTPS for public access.
