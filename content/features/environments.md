---
title: 'Remote Environments'
description: 'Connect Arcane to remote Docker hosts using the Arcane Agent.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

Run an **Arcane Agent** on each Docker host you want to manage as a **Remote Environment**. The same agent can also serve its host's Swarm node without changing its token.

<ScreenshotFrame
  src="/img/screenshots/environments-page.jpeg"
  alt="Remote environments page in Arcane"
  caption="Remote environments page in Arcane."
  loading="lazy"
  decoding="async"
/>

## Requirements

- Arcane Manager running and reachable from the Agent host.
- Docker installed on the Agent host with permission to mount `/var/run/docker.sock`.
- The environment must be created in Arcane _before_ you start the Agent.
- For **Direct** mode: the Manager must reach the Agent on port `3553`.
- For **Edge** mode: the Agent must reach the Manager from inside its network.

## Connection mode

- <Link href="/docs/features/environments#add-a-direct-environment">Direct setup</Link> — the Manager connects to the Agent on TCP `3553`. Use this when the remote host can accept connections from the Manager.
- <Link href="/docs/features/environments#add-an-edge-environment">Edge setup</Link> — the Agent connects outbound to the Manager. Use this behind NAT or a firewall; the remote host needs no inbound port.

To run without a container, use the <Link href="/docs/features/environments#standalone-binary">standalone binary</Link> instructions.

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

Select an environment under **Environments**. Click its **name** or **API URL** in the header to edit; both are read-only for the local environment. The header also offers **Test Connection**, API URL copying, and **Regenerate API Key** for non-edge environments.

### Environment tabs

- **Connection & Edge** — edge environments only. Live tunnel, control plane, and heartbeat status, the agent's mTLS certificate status, expiry, and common name, buttons to download the mTLS **bundle**, **certificate**, or **key**, and **Regenerate API Key**. See <Link href="/docs/security/edge-mtls">Edge Agent mTLS</Link>.
- **Storage & Limits** — _Directories & Storage Paths_ (Projects Directory, Templates Directory, Swarm Stack Sources Directory, Disk Usage Path, Follow Project Symlinks) and _Sync & Upload Limits_ (Max Image Upload Size, and Git Sync max files, max total size, and max binary size).
- **Docker** — Docker connection settings, including the **Base Server URL** used to build host links.
- **Security** — Trivy and Lifecycle sub-tabs. See <Link href="/docs/features/vulnerability-scans">Vulnerability Scans</Link> and <Link href="/docs/guides/gitops-lifecycle-hooks">GitOps Lifecycle Hooks</Link>.
- **Automations** — scheduled jobs for this environment, including image polling and auto updates.
- **Git Syncs** — GitOps repository syncs.

An offline or disabled environment shows only **Git Syncs**, and stays on the page so you can fix the connection from the header.

## Update all environments

To upgrade the manager and connected agents together, open **Environments**, click **Update All**, and confirm in the **Update all environments** dialog.

Agents update first, then the manager. The manager restarts only if its image changed. Offline environments are skipped. Each row shows the old and new versions and a status:

- **Pending** — waiting in the queue.
- **Updating** — upgrade in progress.
- **Updated** / **Update triggered** — the new version was applied, or handed off to the agent to finish.
- **Up to Date** / **Offline — skipped** — nothing to do, or unreachable.
- **Failed** — the upgrade didn't complete; the error is shown inline.

> [!NOTE]
> This updates Arcane itself and requires `system:upgrade`. To update containers and projects, use the <Link href="/docs/guides/updates">Updates</Link> page.

## Status meanings

In poll mode, you'll see:

- **Online** — a tunnel is active right now.
- **Standby** — the Agent is checking in successfully and waiting for demand. This is healthy.
- **Pending** — the environment is created but not paired or fully connected yet.
- **Offline / Error** — the Manager can't currently use this environment.

## Transport mode

Choose how the Agent maintains its connection:

- **`EDGE_TRANSPORT=auto`** — keep a continuous tunnel open. Arcane uses gRPC where possible and falls back to WebSocket. Behind Traefik, see <Link href="/docs/networking/traefik">Traefik</Link>.
- **`EDGE_TRANSPORT=poll`** — check in periodically instead of holding a tunnel open. The first action on an idle environment can take a moment while the connection wakes up.

Generated agent snippets default to `EDGE_TRANSPORT=poll`.

The canonical container image is `ghcr.io/getarcaneapp/agent`. The older `ghcr.io/getarcaneapp/arcane-headless` name remains a supported release alias for existing installations.

## Use an environment with Swarm

With an active Swarm manager selected, you can start the same **Easy Join** workflow from:

- **Swarm → Cluster** to join one or more Remote Environments.
- An eligible environment's detail page to join that environment.
- An eligible environment's row menu on the **Environments** page.

Choose a worker or manager role, availability, and optional listen, advertise, or data-path addresses. Arcane handles the manager address and join token.

Targets must be enabled, online, and unbound to a Swarm node. You need the required permissions, and you can't target the selected Swarm manager itself.

After a verified join, the environment is bound to its Swarm node. From the node's Agent dialog you can switch to the environment's Containers, Images, Volumes, or Networks pages when permitted.

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
