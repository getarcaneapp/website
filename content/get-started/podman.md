---
title: 'Podman'
description: 'Use Arcane with Podman.'
---

<script lang="ts">
import SetupCode from '#lib/components/setup-code.svelte';
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!NOTE] This guide is for using Arcane with Podman.
> Follow the <Link href="/docs/get-started/installation">Installation</Link> guide first, then make the changes below.

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

Replace USER with your numeric user ID.

If you are on Windows 11 with Podman Desktop, the socket is exposed inside the VM and this mount has been used successfully:

```diff
services:
  arcane:
    volumes:
      - /run/podman/podman.sock:/var/run/docker.sock
```

If you mount additional volumes, keep Arcane’s data mount as normal:

```diff
services:
  arcane:
    volumes:
      - /run/podman/podman.sock:/var/run/docker.sock
      - ./arcane-data:/app/data
```

## 3. Limitations:

Arcane manages Podman containers through the socket's Docker-compatible API. Podman-specific features such as Quadlets and Pods aren't exposed through that API, so Arcane doesn't support them yet.
