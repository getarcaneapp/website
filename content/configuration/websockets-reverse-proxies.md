---
title: 'Websocket Configuration'
description: 'Configure your reverse proxy to support WebSockets for Arcane.'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Arcane uses WebSockets for real-time communication. If you are using a reverse proxy to set Arcane behind a custom domain, you will need to ensure that it supports WebSockets and is configured correctly.

## Nginx Configuration

Here is a sample Nginx configuration with WebSocket support enabled:

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

The key lines for WebSocket support are:
- `proxy_http_version 1.1;`
- `proxy_set_header Upgrade $http_upgrade;`
- `proxy_set_header Connection "upgrade";`
- `proxy_cache_bypass $http_upgrade;`

## Apache Configuration

If you are using Apache 2.4.47 or later, you need to use a `ProxyPass` rule with `upgrade=websocket`:

```apache
Define HOST arcane.example.com
Define PORT 3552

<VirtualHost *:443>
  ServerName ${HOST}

  ProxyPassMatch ^/(.*)\/ws$  ws://127.0.0.1:${PORT}/$1/ws upgrade=websocket
  ProxyPass / http://127.0.0.1:${PORT}/
  ProxyPassReverse / http://127.0.0.1:${PORT}/

  ErrorLog ${APACHE_LOG_DIR}/arcane.error.log
  CustomLog ${APACHE_LOG_DIR}/arcane.access.log combined

  Include /etc/letsencrypt/options-ssl-apache.conf
  SSLCertificateFile /etc/letsencrypt/live/${HOST}/fullchain.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/${HOST}/privkey.pem
</VirtualHost>
```

## Additional Resources

Full documentation for common reverse proxies is available from [websocket.org](https://websocket.org/):
- [Nginx](https://websocket.org/guides/infrastructure/nginx/)
- [Amazon ALB](https://websocket.org/guides/infrastructure/aws/alb/)
- [Cloudflare](https://websocket.org/guides/infrastructure/cloudflare/)
- [Kubernetes](https://websocket.org/guides/infrastructure/kubernetes/)
