---
title: 'Remote Environments'
description: 'Connect Arcane to remote Docker hosts using the Arcane Agent.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
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
      - arcane-data:/app/data
    restart: unless-stopped

volumes:
  arcane-data:
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
      - arcane-data:/app/data
    restart: unless-stopped

volumes:
  arcane-data:
```

## Edit an environment

1. Open **Environments**.
2. Select the environment.
3. Change the settings you need.
4. Save.

The environment's **name** and **API URL** are edited directly in the page header — click either to edit it inline, and use the copy button next to the API URL to copy it. Both are read-only for the built-in local environment. The header also has a **Test Connection** button, and **Regenerate API Key** for non-edge environments.

### Environment tabs

- **Connection & Edge** — edge environments only. Live tunnel, control plane, and heartbeat status, the agent's mTLS certificate status, expiry, and common name, buttons to download the mTLS **bundle**, **certificate**, or **key**, and **Regenerate API Key**. See <Link href="/docs/security/edge-mtls">Edge Agent mTLS</Link>.
- **Storage & Limits** — _Directories & Storage Paths_ (Projects Directory, Templates Directory, Swarm Stack Sources Directory, Disk Usage Path, Follow Project Symlinks) and _Sync & Upload Limits_ (Max Image Upload Size, and Git Sync max files, max total size, and max binary size).
- **Docker** — Docker connection settings, including the **Base Server URL** used to build host links.
- **Security** — Trivy and Lifecycle sub-tabs. See <Link href="/docs/features/vulnerability-scans">Vulnerability Scans</Link> and <Link href="/docs/guides/gitops-lifecycle-hooks">GitOps Lifecycle Hooks</Link>.
- **Automations** — scheduled jobs for this environment, including image polling and auto updates.
- **Git Syncs** — GitOps repository syncs.

An offline or disabled environment shows only **Git Syncs**, and stays on the page so you can fix the connection from the header.

## Update all environments

Arcane can upgrade **itself** across your whole fleet in one action. On the **Environments** page, click **Update All** to open the **Update all environments** dialog and confirm.

Arcane upgrades the connected **agents first**, while the manager is still up to orchestrate the run and report live progress, then upgrades the **manager last**. The manager only restarts if the pull actually brought down a new image — if it is already running the latest, it skips the recreate and there is no downtime. Offline environments are skipped.

Each row shows the version it is moving `from → to`, and the local environment is marked with a **Manager** badge.

The dialog tracks each environment as it goes:

- **Pending** — waiting in the queue.
- **Updating** — upgrade in progress.
- **Updated** / **Update triggered** — the new version was applied, or handed off to the agent to finish.
- **Up to Date** / **Offline — skipped** — nothing to do, or unreachable.
- **Failed** — the upgrade didn't complete; the error is shown inline.

> [!NOTE]
> This upgrades the Arcane manager and agents themselves — not the containers or projects they run. To keep your _workloads_ current, use **Update All** on the <Link href="/docs/guides/updates">Updates</Link> page instead. The two buttons share a label but do different things. **Update All** here requires the `system:upgrade` permission.

## Standalone binary

You can run the Agent as a binary instead of a container.

1. Download the latest release for your platform.
2. Place the binary on the target host.
3. Create a `.env` file.

Direct Agent `.env` example:

```env
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

<Snippet text="ENVIRONMENT=production PORT=3553 LISTEN=127.0.0.1 AGENT_MODE=true EDGE_TRANSPORT=poll AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX MANAGER_API_URL=http://10.1.1.4:3552 ./arcane-agent" class="mt-2 mb-2 w-full" />
