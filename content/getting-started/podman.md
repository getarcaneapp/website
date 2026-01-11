---
title: 'Podman'
description: 'Use Arcane with Podman.'
order: 3
---

<script lang="ts">
import SetupCode from '$lib/components/setup-code.svelte';
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!NOTE] This guide is for using Arcane with Podman.
> It assumes you have followed the normal <Link href="/docs/getting-started/installation">Installation</Link> already.

## 1. Start **_podman.socket_**:

<Snippet text="systemctl --user start podman.socket" class="mt-2" />

**_Optional_**: Configure socket to automatically start after reboots

```bash
systemctl --user enable podman.socket
  
loginctl enable-linger <user>
```

## 2. Update **_compose.yaml_**:

```diff
services:
  arcane:
    volumes:
-     - /var/run/docker.sock:/var/run/docker.sock
+     - /run/user/USER/podman/podman.sock:/var/run/docker.sock
```

where USER is the id of your user.

## 3. Limitations:

Podman exposes a Docker-compliant API through the socket allowing Arcane to manage containers as though it were using Docker. However, podman native features, e.g. Quadlets, Pods, are not exposed through the API. Additional development is needed to support native Podman features.
