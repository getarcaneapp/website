---
title: 'GPU Monitoring Setup'
description: 'Setup GPU monitoring for NVIDIA GPUs'
order: 3
---

> [!IMPORTANT]
> This guide assumes GPU drivers are already installed and configured on your host system. Refer to the respective vendor documentation for driver installation. 

## NVIDIA GPU Setup

Configure Arcane with NVIDIA GPU support in your `compose.yaml`:

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/arcane:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
      - NVIDIA_VISIBLE_DEVICES=all
      - GPU_MONITORING_ENABLED=true
      - GPU_TYPE=nvidia
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    restart: unless-stopped

volumes:
  arcane-data:
```
