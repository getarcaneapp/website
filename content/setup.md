---
title: 'Arcane Setup Guide'
description: 'Get Arcane running fast with Docker Compose.'
---

<script lang="ts">
import SetupCode from '$lib/components/setup-code.svelte';
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

## 1. Create **_compose.yaml_**:

```yaml
services:
  arcane:
    image: ghcr.io/ofkm/arcane:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
      - /host/path/to/stacks:/app/data/stacks
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

## 2. Review Volumes & Imports:

**_/var/run/docker.sock_**: Lets Arcane manage Docker.

**_arcane-data_**: Persists settings, stacks, users, etc.

To manage existing compose projects, in addition to mounting your compose projects folder to the `/app/data/stacks` folder, you may need to also mount any additional folders you wish to use for config files.

## 3. Start Arcane:

```bash
docker compose up -d
```

## 4. Access Arcane:

Go to <Link href="http://localhost:3552">localhost:3552</Link> in your browser and follow the setup.
