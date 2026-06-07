---
title: 'Websocket Configuration'
description: 'Configure your reverse proxy to support WebSockets for Arcane.'
order: 4
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Arcane uses WebSockets to keep the app updated in real time. If you place Arcane behind a reverse proxy or custom domain, make sure the proxy allows WebSocket connections and forwards the real client IP — Arcane's per-IP login rate limit relies on it to tell clients apart (see [Trust the proxy with `TRUSTED_PROXIES`](#trust-the-proxy-with-trusted_proxies)).

## Nginx Configuration

Here is a sample Nginx configuration with WebSocket support enabled. If you are not familiar with every line, you can usually copy it as-is and just change the domain name and paths:

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

The important WebSocket lines are:

- `proxy_http_version 1.1;`
- `proxy_set_header Upgrade $http_upgrade;`
- `proxy_set_header Connection "upgrade";`
- `proxy_cache_bypass $http_upgrade;`

This config already forwards the client IP via `X-Forwarded-For` and `X-Real-IP`; set `TRUSTED_PROXIES` so Arcane trusts it (see [below](#trust-the-proxy-with-trusted_proxies)).

## Apache Configuration

If you use Apache 2.4.47 or later, you need `mod_proxy_http` and a `ProxyPassMatch` rule with `upgrade=websocket`:

```apache
Define HOST arcane.example.com
Define PORT 3552

<VirtualHost *:443>
  ServerName ${HOST}

  ProxyPassMatch ^/(.*)\/ws\/(.*)$  ws://127.0.0.1:${PORT}/$1/ws/$2 upgrade=websocket
  ProxyPass / http://127.0.0.1:${PORT}/
  ProxyPassReverse / http://127.0.0.1:${PORT}/

  ErrorLog ${APACHE_LOG_DIR}/arcane.error.log
  CustomLog ${APACHE_LOG_DIR}/arcane.access.log combined

  Include /etc/letsencrypt/options-ssl-apache.conf
  SSLCertificateFile /etc/letsencrypt/live/${HOST}/fullchain.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/${HOST}/privkey.pem
</VirtualHost>
```

Apache's `mod_proxy` adds `X-Forwarded-For` automatically; set `TRUSTED_PROXIES` so Arcane trusts it (see [below](#trust-the-proxy-with-trusted_proxies)).

## Traefik Configuration

Traefik proxies WebSocket connections automatically, so no extra middleware is needed for live updates to work. When running Arcane and Traefik with Docker Compose, configure the router and service with labels on the Arcane container:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    environment:
      - APP_URL=https://arcane.example.com
      - TRUSTED_PROXIES=172.16.0.0/12
    labels:
      - traefik.enable=true
      - traefik.http.routers.arcane.rule=Host(`arcane.example.com`)
      - traefik.http.routers.arcane.entrypoints=websecure
      - traefik.http.routers.arcane.tls.certresolver=myresolver
      - traefik.http.services.arcane.loadbalancer.server.port=3552
```

Notes:

- Set `APP_URL` to the public URL only — do **not** append the internal port (`:3552`). Arcane derives the WebSocket (`wss://`) address from `APP_URL`; an internal port that isn't exposed publicly breaks the WebSocket connection.
- Set `TRUSTED_PROXIES` to the subnet of the Docker network that Traefik and Arcane share. The example uses `172.16.0.0/12`, which covers Docker's entire default address range and works without further setup; to scope it down to your actual network, see [Trust the proxy with `TRUSTED_PROXIES`](#trust-the-proxy-with-trusted_proxies).

## Trust the proxy with `TRUSTED_PROXIES`

Arcane rate-limits authentication endpoints (login, token refresh, OIDC callback) per client IP. Behind a reverse proxy the direct peer is the proxy, so without extra configuration every request looks like it comes from a single IP — which both weakens brute-force protection and can lock out legitimate users sharing the proxy.

Set the `TRUSTED_PROXIES` environment variable on the Arcane container to the address (or CIDR range) of your reverse proxy. Arcane then reads the real client IP from the `X-Forwarded-For` header for requests coming from those addresses:

```bash
# Single proxy host
TRUSTED_PROXIES=10.0.0.5

# Or a CIDR range (e.g. a Docker network)
TRUSTED_PROXIES=172.16.0.0/12
```

Docker assigns every user-defined network a subnet from the `172.16.0.0/12` range, which is why the broad example value works anywhere. To scope `TRUSTED_PROXIES` down to your actual network, look up its subnet:

```bash
docker network inspect <network> --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}'
```

`TRUSTED_PROXIES` accepts a comma-separated list of IPs or CIDR ranges. Only requests whose direct peer is in this list have their forwarded headers trusted, so an untrusted client cannot spoof its IP via `X-Forwarded-For`. See the <Link href="/docs/configuration/environment">Environment Variables</Link> reference for all configuration options.

> [!NOTE]
> When you bind Arcane to a loopback address with `LISTEN` (for example `LISTEN=127.0.0.1`, the usual same-host proxy setup), Arcane automatically trusts loopback proxies (`127.0.0.0/8`, `::1/128`), so you do not need to set `TRUSTED_PROXIES`. Auto-trust applies only to literal loopback IPs, not hostnames such as `localhost`.

## Additional Resources

Full documentation for common reverse proxies is available from [websocket.org](https://websocket.org/):

- [Nginx](https://websocket.org/guides/infrastructure/nginx/)
- [Amazon ALB](https://websocket.org/guides/infrastructure/aws/alb/)
- [Cloudflare](https://websocket.org/guides/infrastructure/cloudflare/)
- [Kubernetes](https://websocket.org/guides/infrastructure/kubernetes/)
