---
title: 'TLS and HTTP/2'
description: 'Serve Arcane over HTTPS through a reverse proxy or your own TLS certificates.'
---

Arcane can serve HTTPS in two ways: a reverse proxy in front of it handles the certificates, or Arcane serves HTTPS itself with a certificate you provide. For most installations, let the reverse proxy handle it.

## Option A: HTTPS handled by a reverse proxy

Set these values when Nginx, Caddy, Traefik, or another proxy handles HTTPS:

```bash
TLS_ENABLED=false
```

```bash
APP_URL=https://your-domain.com
```

`PORT` is optional and defaults to `3552`.

> [!NOTE]
> The proxy also needs to forward WebSockets. See [Reverse Proxy Setup](/docs/networking/reverse-proxy).

## Option B: Direct Arcane HTTPS and HTTP/2

You need a domain name, a valid certificate and its private key, and access to Arcane's `.env` or container settings.

1. Set these values in your `.env` file or container environment:

```bash
TLS_ENABLED=true
```

```bash
TLS_CERT_FILE=/full/path/to/your/certificate.pem
```

```bash
TLS_KEY_FILE=/full/path/to/your/private-key.pem
```

```bash
APP_URL=https://your-domain.com
```

2. Optionally set `PORT` (default `3552`) and `LISTEN`. Leave `LISTEN` empty to bind on all interfaces.
3. Restart Arcane.
4. Open your `https://` URL and check that the browser reports a valid certificate.

With `TLS_ENABLED=true`, Arcane won't start unless both `TLS_CERT_FILE` and `TLS_KEY_FILE` are set.

## HTTP/2 without TLS

When `TLS_ENABLED=false`, Arcane accepts HTTP/1.1 and **h2c** (HTTP/2 without encryption) on the same port. Proxies use h2c to forward gRPC traffic, such as the Edge Agent tunnel. Keep h2c on internal networks and use HTTPS for public access.
