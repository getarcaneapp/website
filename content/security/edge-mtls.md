---
title: 'Edge Agent mTLS'
description: 'Add mutual TLS authentication between the Arcane Manager and its edge agents.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

Edge mTLS (mutual TLS) makes each Edge agent prove its identity with a client certificate, on top of its token, when it connects to the Manager over HTTPS. Use it when Edge agents reach the Manager over networks you don't control, so a leaked token alone isn't enough to connect.

> [!NOTE]
> It builds on the Edge setup in <Link href="/docs/remote/environments">Remote Environments</Link>.

## What it does

- The agent token is used once, to enroll and get a client certificate.
- When Arcane terminates TLS itself, the client certificate authenticates every request after that. The Manager checks that the environment identity in the certificate matches the environment of the agent token.
- When a reverse proxy terminates TLS, the proxy checks the client certificate before forwarding edge tunnel traffic, and Arcane uses the agent token to find the environment.
- Connections with a missing, invalid, or wrong-environment certificate are rejected by whichever layer terminates TLS.

## Quick start

Arcane can create the certificate authority (CA) and agent certificates for you and renew agent certificates automatically.

1. Serve the Manager over HTTPS so agents can verify it. Any valid certificate works, including self-signed or Let's Encrypt.

   > [!NOTE]
   > See <Link href="/docs/networking/tls">TLS and HTTP/2</Link> to have Arcane serve HTTPS itself or to put a reverse proxy in front.

2. On the Manager, set:

   <Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
   <Snippet text="EDGE_MTLS_ASSETS_DIR=/app/data/edge-mtls" class="mt-2 mb-2 w-full" />

3. On the agent, set:

   <Snippet text="EDGE_AGENT=true" class="mt-2 mb-2 w-full" />
   <Snippet text="MANAGER_API_URL=https://manager.example.com" class="mt-2 mb-2 w-full" />
   <Snippet text="AGENT_TOKEN=arc_xxxxxxxxxxxxxxxx" class="mt-2 mb-2 w-full" />
   <Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
   <Snippet text="EDGE_MTLS_ASSETS_DIR=/app/data/edge-mtls-agent" class="mt-2 mb-2 w-full" />
   <Snippet text="EDGE_MTLS_CA_FILE=/etc/ssl/manager-ca.crt" class="mt-2 mb-2 w-full" />

4. Mount the agent's `EDGE_MTLS_ASSETS_DIR` on a persistent volume, so the certificate survives restarts. Otherwise the agent enrolls again on every restart.

`MANAGER_API_URL` must use `https://`. `EDGE_MTLS_CA_FILE` on the agent is the certificate the agent trusts for the Manager's HTTPS. Point it at the Manager's certificate if that is self-signed; leave it unset for a public CA such as Let's Encrypt to use the system trust store.

If a reverse proxy terminates HTTPS, Arcane can receive plain HTTP from that trusted proxy, but the proxy must then require client certificates on the edge tunnel routes.

### Where certificates are stored

`EDGE_MTLS_ASSETS_DIR` on the Manager holds the CA and issued certificates. If `EDGE_MTLS_CA_FILE` is not set on the Manager, Arcane creates the edge CA there as `ca.crt` and `ca.key`, with the private key encrypted using your `ENCRYPTION_KEY`.

### How enrollment works

On first start:

1. The agent calls `POST /api/tunnel/mtls/enroll` over HTTPS, presenting only its `AGENT_TOKEN`.
2. The Manager issues a client certificate valid for about a year and returns it with the edge CA.
3. The agent saves them in `EDGE_MTLS_ASSETS_DIR` as `agent.crt`, `agent.key`, and `ca.crt`, and reconnects using them.

On later starts, the agent reuses the saved files. If the certificate has expired or is close to expiry, it enrolls again.

### Key types

Edge CAs that Arcane creates use **ML-DSA-87** keys, a post-quantum signature algorithm. An existing ECDSA P-384 CA keeps working, the Manager keeps issuing P-384 client certificates for it, and enrolled agents don't need to enroll again.

An ML-DSA client certificate needs **TLS 1.3** on every hop of the edge connection. A proxy that only allows TLS 1.2 will break it.

## Modes

| `EDGE_MTLS_MODE` | Behaviour                                                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled`       | No mTLS; agents authenticate with their token only. This is the default.                                                                                                           |
| `optional`       | The Manager accepts both mTLS and token-only connections.                                                                                                                          |
| `required`       | When Arcane terminates TLS, it requires a valid client certificate. When a proxy terminates TLS, the proxy must require client certificates before forwarding edge tunnel traffic. |

> [!TIP]
> To roll mTLS out to existing agents, use `optional` until every agent has enrolled, then switch to `required`.

## Use your own certificates

To use certificates from your own certificate authority, set the paths explicitly. Arcane uses them instead of generating its own.

Manager:

<Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CA_FILE=/etc/arcane/edge-ca.crt" class="mt-2 mb-2 w-full" />

Arcane still signs new agent certificates with its own internal key unless you also issue agent certificates yourself.

Agent:

<Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CERT_FILE=/etc/arcane/agent.crt" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_KEY_FILE=/etc/arcane/agent.key" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CA_FILE=/etc/arcane/manager-ca.crt" class="mt-2 mb-2 w-full" />

When both `EDGE_MTLS_CERT_FILE` and `EDGE_MTLS_KEY_FILE` are set, the agent skips enrollment.

## Download certificates from the UI

After you create an Edge environment, you can download its certificate files from the **New environment** sheet or the environment's detail page:

| File        | Access                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ca.crt`    | Public. Shown in the deployment snippet and downloadable by any signed-in user.                                                                         |
| `agent.crt` | Public. Same as `ca.crt`.                                                                                                                               |
| `agent.key` | Private. Never shown inline; download it with the **Download certificate** link, which is admin-only, so the key stays out of browser history and logs. |

Downloading all three as a `.zip` is also admin-only. Every download is recorded as an `environment.mtls.download` audit event with the admin's username, the file name, and whether the file is sensitive.

## Rotate and revoke certificates

- Agent certificates last about a year, and agents renew them automatically before they expire.
- To renew right away, delete `agent.crt` and `agent.key` on the agent and restart it.
- Arcane has no certificate revocation list. To cut off an agent, delete or regenerate its environment's API key in the UI.

## Troubleshooting

| Error or symptom                                                   | Fix                                                                                                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `EDGE_MTLS_MODE requires MANAGER_API_URL to use https`             | The agent won't enroll or connect over plain HTTP. Serve the Manager over HTTPS and use an `https://` URL.                                  |
| `x509: certificate signed by unknown authority`                    | The agent doesn't trust the Manager's certificate. For a self-signed certificate, set `EDGE_MTLS_CA_FILE` on the agent to that certificate. |
| Enrollment fails                                                   | Check that `EDGE_MTLS_CERT_FILE` and `EDGE_MTLS_KEY_FILE` are unset on the agent, the agent token is valid, and mTLS is on for the Manager. |
| Agent enrolls again after every restart                            | `EDGE_MTLS_ASSETS_DIR` on the agent isn't on a persistent volume.                                                                           |
| Manager logs `tunnel request failed: unsupported edge command ...` | That UI action has no handler on the edge tunnel. File a bug with the HTTP method and path from the error.                                  |
