---
title: 'GPU Monitoring Setup'
description: 'Setup GPU monitoring for NVIDIA, AMD, and Intel GPUs'
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

## AMD GPU Setup

Configure Arcane with AMD GPU support in your `compose.yaml`:

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
    devices:
      - /dev/dri:/dev/dri
      - /dev/kfd:/dev/kfd
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
      - ROCR_VISIBLE_DEVICES=all
    restart: unless-stopped

volumes:
  arcane-data:
```

## Intel GPU Setup

Configure Arcane with Intel GPU support in your `compose.yaml`:

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
    devices:
      - /dev/dri:/dev/dri
    environment:
      - APP_URL=http://localhost:3552
      - PUID=1000
      - PGID=1000
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
    restart: unless-stopped

volumes:
  arcane-data:
```