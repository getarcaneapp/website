---
title: 'Arcane Setup Guide'
description: 'Get Arcane running fast with Docker Compose.'
blueprint: default
---

<script lang="ts">
import SetupCode from '$lib/components/setup-code.svelte';
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

## 1. Create `docker-compose.yml`:

<SetupCode />

## 2. Review Volumes & Imports:

`/var/run/docker.sock`: Lets Arcane manage Docker.

`arcane-data`: Persists settings, stacks, users, etc.

To import existing stacks, add a mount where your existing stacks are located:

```
/host/path/to/stacks:/host/path/to/stacks:ro
```

Use `:ro` for read-only access.

## 3. Start Arcane:

<Snippet text="docker compose up -d" class="m-4 w-full" />

## 4. Access Arcane:

Go to [http://localhost:8080](http://localhost:8080) in your browser and follow the setup.
