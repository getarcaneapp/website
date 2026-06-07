---
title: 'Websocket Configuration'
description: 'Configure your reverse proxy to support WebSockets for Arcane.'
order: 4
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Arcane uses WebSockets to keep the app updated in real time. If you place Arcane behind a reverse proxy or custom domain, make sure the proxy allows WebSocket connections.

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

## Trusted proxies

Arcane reads the `X-Forwarded-For` and `X-Forwarded-Proto` headers your reverse proxy sets (see the configs above) to determine the real client IP and whether the original request used HTTPS. To prevent header spoofing, Arcane only trusts those headers from proxies you explicitly allow.

Set `TRUSTED_PROXIES` to the comma-separated CIDR range(s) of your reverse proxy:

```bash
TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12
```

> [!NOTE]
> When you bind Arcane to a loopback address with `LISTEN` (for example `LISTEN=127.0.0.1`, the usual setup for a same-host reverse proxy), Arcane automatically trusts loopback proxies (`127.0.0.0/8`, `::1/128`), so you do not need to set `TRUSTED_PROXIES`. Auto-trust only applies to literal loopback IPs, not hostnames such as `localhost`.

If trusted proxies are misconfigured, Arcane may log the proxy's address as the client IP or treat HTTPS requests as HTTP. Make sure `APP_URL` also matches the public URL your users use, since Arcane derives its cross-origin protection from it.

## Additional Resources

Full documentation for common reverse proxies is available from [websocket.org](https://websocket.org/):

- [Nginx](https://websocket.org/guides/infrastructure/nginx/)
- [Amazon ALB](https://websocket.org/guides/infrastructure/aws/alb/)
- [Cloudflare](https://websocket.org/guides/infrastructure/cloudflare/)
- [Kubernetes](https://websocket.org/guides/infrastructure/kubernetes/)
