---
title: 'TLS and HTTP/2'
description: 'Serve Arcane over HTTPS through a reverse proxy or your own TLS certificates.'
---

For most installations, let a reverse proxy handle HTTPS (Option A). Otherwise Arcane can serve HTTPS itself with your certificate (Option B).

## Option A: HTTPS handled by a reverse proxy

1. Set up your proxy (Nginx, Caddy, Traefik, or another) to forward WebSockets. See [Reverse Proxy Setup](/docs/networking/reverse-proxy).
2. Set these on Arcane:

   ```bash
   ARCANE_TLS_ENABLED=false
   ARCANE_APP_URL=https://your-domain.com
   ```

3. Optional: set `ARCANE_PORT` (default `3552`).

## Option B: Direct Arcane HTTPS and HTTP/2

You need a domain name, a valid certificate and private key, and access to Arcane's `.env` or container settings.

1. Set these in your `.env` file or container environment:

   ```bash
   ARCANE_TLS_ENABLED=true
   ARCANE_TLS_CERT_FILE=/full/path/to/your/certificate.pem
   ARCANE_TLS_KEY_FILE=/full/path/to/your/private-key.pem
   ARCANE_APP_URL=https://your-domain.com
   ```

   Arcane won't start with `ARCANE_TLS_ENABLED=true` unless both the cert and key files are set.

2. Optional: set `ARCANE_PORT` (default `3552`) and `ARCANE_LISTEN` (empty binds all interfaces).
3. Restart Arcane.
4. Open your `https://` URL and check the browser reports a valid certificate.

## HTTP/2 without TLS

With `ARCANE_TLS_ENABLED=false`, Arcane accepts HTTP/1.1 and **h2c** (HTTP/2 without encryption) on one port. Proxies use h2c to forward gRPC, such as the agent tunnel. Keep h2c internal and use HTTPS for public access.
