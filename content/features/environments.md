---
title: 'Remote Environments'
description: 'Connect Arcane to remote Docker hosts using the Arcane Agent.'
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

A **Remote Environment** is a Docker host outside the Arcane Manager that you want to manage from the same UI. You create the environment in Arcane, copy the generated agent settings, and run the **Arcane Agent** on the remote host. The Agent needs Docker access — typically via `/var/run/docker.sock`.

If that host is also a Docker Swarm node, the same Agent can remain a visible Remote Environment and provide verified node coverage in **Swarm → Nodes**. Arcane reuses the environment's existing token; attaching it to a node does not rotate or replace the token.

<ScreenshotFrame
  src="/img/screenshots/environments-page.jpeg"
  alt="Remote environments page in Arcane"
  caption="Remote environments page in Arcane."
  loading="lazy"
  decoding="async"
/>

## Connection mode

Pick one when you create the environment:

- **Direct** — the Manager connects to the Agent on TCP `3553`. Requires the Agent host to accept that inbound port.
- **Edge** — the Agent connects outbound to the Manager. No inbound port required on the remote host. Use this when the remote is behind NAT or a firewall.

## Transport mode

Connection mode is _who connects to whom_. Transport mode is _how the live channel behaves_:

- **`EDGE_TRANSPORT=auto`** — keep a continuous tunnel open. Arcane uses gRPC where possible and falls back to WebSocket.
- **`EDGE_TRANSPORT=poll`** — check in periodically instead of holding a tunnel open. The first action on an idle environment can take a moment while the connection wakes up.

Generated agent snippets default to `EDGE_TRANSPORT=poll`.

The canonical container image is `ghcr.io/getarcaneapp/agent`. The older `ghcr.io/getarcaneapp/arcane-headless` name remains a supported release alias for existing installations.

## Use an environment with Swarm

With an active Swarm manager selected, you can start the same **Easy Join** workflow from:

- **Swarm → Cluster** to join one or more Remote Environments.
- An eligible environment's detail page to join that environment.
- An eligible environment's row menu on the **Environments** page.

Select a worker or manager role, an availability mode, and any optional per-environment listen, advertise, or data-path address. Arcane discovers a reachable manager address and retrieves the correct join token internally; neither needs to be copied into the Easy Join dialog or returned in its result.

The single-environment actions appear only when the Remote Environment is enabled, online, not already bound to a Swarm node, and you have the required permissions. The selected environment is always the Swarm manager, so it cannot also be an Easy Join target.

After a verified join, the environment is bound to its Swarm node. From the node's Agent dialog you can switch to the environment's Containers, Images, Volumes, or Networks pages when permitted.

## Status meanings

In poll mode, you'll see:

- **Online** — a tunnel is active right now.
- **Standby** — the Agent is checking in successfully and waiting for demand. This is healthy.
- **Pending** — the environment is created but not paired or fully connected yet.
- **Offline / Error** — the Manager can't currently use this environment.

## Requirements

- Arcane Manager running and reachable from the Agent host.
- Docker installed on the Agent host with permission to mount `/var/run/docker.sock`.
- The environment must be created in Arcane _before_ you start the Agent.
- For **Direct** mode: the Manager must reach the Agent on port `3553`.
- For **Edge** mode: the Agent must reach the Manager from inside its network.

## Add a Direct environment

1. Open **Environments → Add Environment**.
2. Enter a name.
3. Enter the Agent API URL — for example `http://my-agent:3553` or `https://10.1.1.5:3553`.
4. Create the environment.
5. Copy the generated `docker run` or Docker Compose snippet.
6. Run it on the remote host.

Example Compose:

```yaml
services:
  arcane-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-agent
    ports:
      - '3553:3553'
    environment:
      - AGENT_MODE=true
      - EDGE_TRANSPORT=poll
      - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - MANAGER_API_URL=http://10.1.1.4:3552
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
    restart: unless-stopped

volumes:
  agent-data: {}
```

Start it:

```bash
docker compose up -d
```

## Add an Edge environment

1. Open **Environments → Add Environment**.
2. Switch to the **Edge** tab.
3. Enter a name and click **Generate Agent Configuration**.
4. Copy the generated snippet and run it on the remote host.

Example Compose:

```yaml
services:
  arcane-edge-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-edge-agent
    environment:
      - EDGE_AGENT=true
      - EDGE_TRANSPORT=poll
      - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - MANAGER_API_URL=http://10.1.1.4:3552
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - agent-data:/app/data
    restart: unless-stopped

volumes:
  agent-data: {}
```

## Edit an environment

1. Open **Environments**.
2. Select the environment.
3. Change the settings you need.
4. Save.

## Update all environments

Arcane can upgrade **itself** across your whole fleet in one action. On the **Environments** page, click **Update All** to open the **Update all environments** dialog and confirm.

Arcane upgrades the manager first, then each connected agent that has an update available. The manager restarts during its own upgrade — the dialog reconnects automatically and resumes with the remaining environments. Environments that are offline or already up to date are skipped.

The dialog tracks each environment as it goes:

- **Pending** — waiting in the queue.
- **Updating** — upgrade in progress.
- **Updated** / **Update triggered** — the new version was applied, or handed off to the agent to finish.
- **Already up to date** / **Offline — skipped** — nothing to do, or unreachable.
- **Failed** — the upgrade didn't complete; the error is shown inline.

> [!NOTE]
> This upgrades the Arcane manager and agents themselves — not the containers or projects they run. To keep your _workloads_ current, see <Link href="/docs/guides/updates">Auto Updates</Link>. **Update All** requires the `system:upgrade` permission.

## Standalone binary

You can run the Agent as a binary instead of a container.

1. Download the latest release for your platform.
2. Place the binary on the target host.
3. Create a `.env` file.

> [!NOTE]
> `GIN_MODE=release` is required when running the binary — it's not injected automatically the way it is in the container image.

Direct Agent `.env` example:

```env
GIN_MODE=release
AGENT_MODE=true
EDGE_TRANSPORT=poll
AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MANAGER_API_URL=http://10.1.1.4:3552
ENVIRONMENT=production
PORT=3553
LISTEN=127.0.0.1
```

Edge Agent `.env` example:

```env
GIN_MODE=release
EDGE_AGENT=true
EDGE_TRANSPORT=poll
AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MANAGER_API_URL=http://10.1.1.4:3552
ENVIRONMENT=production
```

`LISTEN` controls which interface the Agent binds to. Leave it empty to bind all interfaces.

Start the Agent:

<Snippet text="./arcane-agent" class="mt-2 mb-2 w-full" />

Or pass everything inline:

<Snippet text="ENVIRONMENT=production GIN_MODE=release PORT=3553 LISTEN=127.0.0.1 AGENT_MODE=true EDGE_TRANSPORT=poll AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX MANAGER_API_URL=http://10.1.1.4:3552 ./arcane-agent" class="mt-2 mb-2 w-full" />
