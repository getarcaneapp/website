---
title: 'Traefik'
description: 'Put Arcane behind Traefik, including the Edge Agent gRPC tunnel.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

This is the Edge Agent setup. Traefik already handles the web UI and WebSockets — see <Link href="/docs/networking/websockets-reverse-proxies">WebSocket Configuration</Link> if that's all you need.

Edge Agents with `EDGE_TRANSPORT=auto` open a gRPC tunnel to `/api/tunnel/connect`. Traefik has to forward that as unencrypted HTTP/2 (`h2c`) and must not time the stream out.

## 1. Turn off the HTTPS read timeout

Traefik's HTTPS entrypoint times out after 60 seconds by default, which kills the gRPC stream. Add this to the Traefik service `command` (or the same setting in your static config). It goes on the entrypoint, not a router.

```yaml
command:
  - '--entrypoints.websecure.transport.respondingtimeouts.readtimeout=0s'
```

See Traefik's [responding timeouts](https://doc.traefik.io/traefik/reference/install-configuration/entrypoints/#respondingtimeouts).

## 2. Add gRPC and web routers

Put these labels on your Arcane service. Change `arcane.example.com`, `letsencrypt`, and `proxy` to your hostname, certificate resolver, and the Docker network Traefik is on. `APP_URL` is the public site. `TRUSTED_PROXIES` is that same Docker network (`172.16.0.0/12` covers Docker's default range).

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    environment:
      - APP_URL=https://arcane.example.com
      - TRUSTED_PROXIES=172.16.0.0/12
    networks:
      - proxy
    labels:
      - traefik.enable=true
      - traefik.docker.network=proxy
      - 'traefik.http.routers.arcane-grpc.rule=Host(`arcane.example.com`) && Path(`/api/tunnel/connect`) && Method(`POST`) && HeaderRegexp(`Content-Type`, `^application/grpc`)'
      - traefik.http.routers.arcane-grpc.entrypoints=websecure
      - traefik.http.routers.arcane-grpc.priority=100
      - traefik.http.routers.arcane-grpc.tls.certresolver=letsencrypt
      - traefik.http.routers.arcane-grpc.service=arcane-grpc
      - traefik.http.services.arcane-grpc.loadbalancer.server.port=3552
      - traefik.http.services.arcane-grpc.loadbalancer.server.scheme=h2c
      - 'traefik.http.routers.arcane-web.rule=Host(`arcane.example.com`)'
      - traefik.http.routers.arcane-web.entrypoints=websecure
      - traefik.http.routers.arcane-web.priority=10
      - traefik.http.routers.arcane-web.tls.certresolver=letsencrypt
      - traefik.http.routers.arcane-web.service=arcane-web
      - traefik.http.services.arcane-web.loadbalancer.server.port=3552
      - traefik.http.services.arcane-web.loadbalancer.server.scheme=http

networks:
  proxy:
    external: true
```

The gRPC router takes `POST /api/tunnel/connect`. Everything else, including WebSockets, uses the web router. `h2c` is Traefik's scheme for an unencrypted gRPC backend — see [exposing gRPC](https://doc.traefik.io/traefik/expose/overview/#exposing-grpc-services).

## 3. Point the Edge Agent at that URL

`MANAGER_API_URL` should match `APP_URL`. See <Link href="/docs/features/environments">Remote Environments</Link> if you haven't created the agent yet.

```yaml
environment:
  - EDGE_AGENT=true
  - EDGE_TRANSPORT=auto
  - MANAGER_API_URL=https://arcane.example.com
  - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 4. Check the agent logs

Restart Traefik and the Edge Agent:

```bash
docker logs arcane-edge-agent
```

You want a gRPC connection. If Traefik is dropping the stream, you'll see it fall back to WebSocket after about 60 seconds.
