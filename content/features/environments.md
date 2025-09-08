---
title: 'Remote Environments'
description: 'Learn how to set up and manage remote Docker hosts using the Arcane agent for centralized container management.'
---

## Overview

Remote Environments let Arcane manage containers on other hosts through a stripped down version of Arcane it self. You run the Agent on a remote machine (with access to its Docker daemon), pair it to your Arcane manager using a one-time Bootstrap Token, and both sides store an Agent Token for all future requests.

## Requirements

- Arcane running and reachable from the Agent host
- Docker installed on the Agent host (with permission to mount `/var/run/docker.sock`)
- Network access from Manager to Agent on TCP 3553

## Quick start (Docker Compose)

```yaml
# docker-compose.yml
services:
  arcane-agent:
    image: ghcr.io/ofkm/arcane-headless:latest
    container_name: arcane-agent
    ports:
      - '3553:3553'
    environment:
      - AGENT_MODE=true
      # Use a strong, temporary bootstrap token for pairing:
      - AGENT_BOOTSTRAP_TOKEN=this-is-my-test-bs-token
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
    restart: unless-stopped

volumes:
  agent-data: {}
```

Start the Agent:

```bash
docker compose up -d
```

## Pair the Agent with Arcane

1. In Arcane, go to Environments → New Environment.
2. Give your new environment a friendly name. 
3. Set API URL to the Agent’s address, for example:
   - http://agent-host:3553 (or https if terminated by a reverse proxy)
4. Enter the same Bootstrap Token you set in `AGENT_BOOTSTRAP_TOKEN`.
5. Save. Arcane will contact the Agent, and the access token will get created and stored.

> Requests to the agent are authenticated by `X-Arcane-Agent-Token` header.

### After pairing

For security, remove the bootstrap token from the Agent after successful pairing and restart it. The Agent will continue using the stored Agent Token.

## Troubleshooting

- 401/403 during pairing: Bootstrap token mismatch; ensure `AGENT_BOOTSTRAP_TOKEN` equals the value provided in Arcane.
- Connection errors: Ensure port 3553 is reachable from the Manager to the Agent host.
- Docker access issues: Verify `/var/run/docker.sock` is mounted and the container user has permissions.
- Logs: `docker logs -f arcane-agent`

## Reference: Environment variables

- AGENT_MODE (required): Set to `true` to run in Agent mode.
- AGENT_BOOTSTRAP_TOKEN (pairing only): One-time secret used to mint the Agent Token. Remove after pairing.