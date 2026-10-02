---
title: 'Remote Environments'
description: 'Connect Arcane to remote Docker hosts using the Arcane Agent.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

A remote environment is another Docker host that you manage from the same Arcane Manager. Each remote host runs a small **Arcane Agent** that talks to its local Docker and relays requests from the Manager.

The agent connects in one of two modes:

| Mode       | Who connects                                          | Use it when                                                                       |
| ---------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Direct** | The Manager connects to the agent on TCP port `3553`. | The Manager can reach the remote host, for example on the same LAN or VPN.        |
| **Edge**   | The agent connects outbound to the Manager.           | The remote host is behind NAT or a firewall and can't accept inbound connections. |

<ScreenshotFrame
  src="/img/screenshots/environments-page.jpeg"
  alt="The remote environment setup dialog with Direct and Edge connection options."
  caption="Choose Direct or Edge mode and configure an agent for another Docker host."
  loading="lazy"
  decoding="async"
/>

## Requirements

- The Arcane Manager is running.
- Docker is installed on the agent host and the agent can mount `/var/run/docker.sock`.
- The environment is created in Arcane before you start the agent.
- **Direct**: the Manager can reach the agent on port `3553`.
- **Edge**: the agent can reach the Manager's URL.

The agent image is `ghcr.io/getarcaneapp/agent`. `ghcr.io/getarcaneapp/arcane-headless` is a supported alias of the same image for existing installations.

## Add a Direct environment

1. Open **Environments → Add Environment**.
2. Enter a name.
3. Enter the Agent API URL, for example `http://my-agent:3553` or `https://10.1.1.5:3553`.
4. Create the environment.
5. Copy the generated `docker run` or Docker Compose snippet and run it on the remote host.

The generated Compose file looks like this:

```yaml
services:
  arcane-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-agent
    ports:
      - '3553:3553'
    environment:
      - AGENT_MODE=true
      - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - MANAGER_API_URL=http://10.1.1.4:3552
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    restart: unless-stopped

volumes:
  arcane-data:
```

Start it with `docker compose up -d`.

## Add an Edge environment

1. Open **Environments → Add Environment**.
2. Switch to the **Edge** tab.
3. Enter a name and click **Generate Agent Configuration**.
4. Copy the generated snippet and run it on the remote host.

The generated Compose file looks like this. No ports are published because the agent connects out to the Manager.

```yaml
services:
  arcane-edge-agent:
    image: ghcr.io/getarcaneapp/agent:latest
    container_name: arcane-edge-agent
    environment:
      - EDGE_AGENT=true
      - EDGE_TRANSPORT=poll
      - AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - MANAGER_API_URL=https://your-manager.example.com
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    restart: unless-stopped

volumes:
  arcane-data:
```

To secure the Edge connection with client certificates, see <Link href="/docs/security/edge-mtls">Edge Agent mTLS</Link>.

### Choose a transport

`EDGE_TRANSPORT` sets how an Edge agent keeps in touch with the Manager. It has no effect on Direct agents.

| Value       | Behaviour                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `poll`      | Checks in periodically instead of holding a tunnel open. The first action on an idle environment can take a moment while the connection wakes up. Generated snippets use this. |
| `auto`      | Keeps a continuous tunnel open, using gRPC where possible and falling back to WebSocket. This is the default when the variable is unset.                                       |
| `websocket` | Keeps a continuous WebSocket tunnel open.                                                                                                                                      |
| `grpc`      | Keeps a continuous gRPC tunnel open, with no WebSocket fallback.                                                                                                               |

Behind Traefik, see <Link href="/docs/networking/reverse-proxy#traefik">Reverse Proxy Setup → Traefik</Link> for the tunnel routes.

### Edge status meanings

In poll mode, an Edge environment shows one of these statuses:

| Status              | Meaning                                                           |
| ------------------- | ----------------------------------------------------------------- |
| **Online**          | A tunnel is active right now.                                     |
| **Standby**         | The agent is checking in and waiting for demand. This is healthy. |
| **Pending**         | The environment is created but not paired or fully connected yet. |
| **Offline / Error** | The Manager can't currently use this environment.                 |

## Run the agent as a standalone binary

You can run the agent as a binary instead of a container.

1. Download the latest release for your platform.
2. Place the binary on the target host.
3. Create a `.env` file next to it.

Direct agent `.env`:

```env
AGENT_MODE=true
AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MANAGER_API_URL=http://10.1.1.4:3552
ENVIRONMENT=production
PORT=3553
LISTEN=127.0.0.1
```

Edge agent `.env`:

```env
EDGE_AGENT=true
EDGE_TRANSPORT=poll
AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MANAGER_API_URL=http://10.1.1.4:3552
ENVIRONMENT=production
```

`LISTEN` sets the interface the agent binds to. Leave it empty to bind all interfaces.

Start the agent:

<Snippet text="./arcane-agent" class="mt-2 mb-2 w-full" />

Or pass everything inline:

<Snippet text="ENVIRONMENT=production PORT=3553 LISTEN=127.0.0.1 AGENT_MODE=true AGENT_TOKEN=arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX MANAGER_API_URL=http://10.1.1.4:3552 ./arcane-agent" class="mt-2 mb-2 w-full" />

## Edit an environment

Select an environment under **Environments**. Click its **name** or **API URL** in the header to edit them; both are read-only for the local environment. The header also has **Test Connection**, a button to copy the API URL, and **Regenerate API Key** for non-Edge environments.

The environment page has these tabs:

| Tab                   | What it contains                                                                                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Connection & Edge** | Edge environments only. Tunnel, control plane, and heartbeat status; the agent's mTLS certificate status, expiry, and common name; downloads for the mTLS **bundle**, **certificate**, and **key**; and **Regenerate API Key**.                      |
| **Storage & Limits**  | **Directories & Storage Paths** (Projects Directory, Templates Directory, Swarm Stack Sources Directory, Disk Usage Path, Follow Project Symlinks) and **Sync & Upload Limits** (Max Image Upload Size and the Git Sync file count and size limits). |
| **Docker**            | Docker connection settings, including the **Base Server URL** used to build host links.                                                                                                                                                              |
| **Security**          | **Trivy** and **Lifecycle** sub-tabs. See <Link href="/docs/security/vulnerability-scans">Vulnerability Scans</Link> and <Link href="/docs/docker/gitops-hooks">GitOps Lifecycle Hooks</Link>.                                                       |
| **Automations**       | Scheduled jobs for this environment, such as image polling and auto updates.                                                                                                                                                                         |
| **Git Syncs**         | GitOps repository syncs.                                                                                                                                                                                                                             |

An offline or disabled environment shows only **Git Syncs**, and stays open so you can fix the connection from the header.

## Update all environments

To upgrade the Manager and connected agents together, open **Environments**, click **Update All**, and confirm in the **Update all environments** dialog.

> [!NOTE]
> This updates Arcane itself and requires the `system:upgrade` permission. To update containers and projects, use the <Link href="/docs/docker/auto-updates">Updates</Link> page.

Agents update first, then the Manager. The Manager restarts only if its image changed, and offline environments are skipped. Each row shows the old and new versions and a status:

| Status                                 | Meaning                                                            |
| -------------------------------------- | ------------------------------------------------------------------ |
| **Pending**                            | Waiting in the queue.                                              |
| **Updating**                           | Upgrade in progress.                                               |
| **Updated** / **Update triggered**     | The new version was applied, or handed off to the agent to finish. |
| **Up to Date** / **Offline — skipped** | Nothing to do, or the environment was unreachable.                 |
| **Failed**                             | The upgrade didn't complete. The error is shown inline.            |

## Join an environment to a Swarm

An online remote environment can join a Swarm cluster with **Easy Join**, and the same agent then serves its Swarm node without a new token. See <Link href="/docs/remote/swarm-cluster">Swarm Cluster</Link> for the steps.
