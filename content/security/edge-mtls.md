---
title: "Edge Agent mTLS"
description: "Add mutual TLS authentication between the Arcane Manager and its edge agents."
order: 2
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

Edge agents connect outbound to the Arcane Manager over HTTPS. By default they authenticate with an agent token. Enabling mTLS adds a second factor: the Manager issues each agent a client certificate, and the TLS handshake proves the agent holds the matching private key. Certificates are much harder to leak than tokens - they never appear in logs, environment variables, or API responses.

> [!NOTE]
> See <Link href="/docs/features/environments">Remote Environments</Link> for how edge agents are created and connected. mTLS is a layer on top of that flow.

## What it does

With mTLS enabled:

- The agent token still bootstraps the first enrollment.
- When Arcane terminates mTLS directly, the client certificate authenticates every request after that, and the Manager checks its SPIFFE URI SAN against the environment resolved from the agent token.
- When mTLS is terminated by a reverse proxy, the proxy enforces client certificate authentication before forwarding edge tunnel traffic to Arcane. Arcane still uses the agent token to resolve the environment.
- Traffic is rejected if the certificate is missing, invalid, or belongs to a different environment at the layer responsible for terminating mTLS.

## Quick start

Arcane can generate all required agent certificates for you. You only need to:

1. Serve the Manager behind HTTPS so agents can verify the Manager.
2. Set `EDGE_MTLS_MODE=required` on both sides.
3. Provide the agent with an `AGENT_TOKEN` from the environment you want to manage.

No cert/key files need to exist on disk up front. Arcane will:

- Generate its own edge CA on first Manager start.
- Issue an agent certificate automatically the first time an agent enrolls.
- Re-use existing certificates on subsequent starts until they are expired or near expiry.

### Manager

If Arcane terminates HTTPS directly, serve HTTPS using any valid cert (self-signed, Let's Encrypt, etc.):

<Snippet text="TLS_ENABLED=true" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_CERT_FILE=/etc/arcane/tls.crt" class="mt-2 mb-2 w-full" />
<Snippet text="TLS_KEY_FILE=/etc/arcane/tls.key" class="mt-2 mb-2 w-full" />

If a reverse proxy terminates HTTPS and mTLS, Arcane can receive proxied HTTP from that trusted proxy. In that setup, configure mTLS enforcement on the proxy for the edge tunnel routes.

Then enable edge mTLS:

<Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_ASSETS_DIR=/app/data/edge-mtls" class="mt-2 mb-2 w-full" />

`EDGE_MTLS_ASSETS_DIR` is where Arcane stores the CA and issued certs. With no `EDGE_MTLS_CA_FILE` set, Arcane generates the edge CA into `EDGE_MTLS_ASSETS_DIR/ca.crt` and `ca.key` - the private key is encrypted at rest with your `ENCRYPTION_KEY`.

> [!NOTE]
> See <Link href="/docs/configuration/tls">TLS and HTTP/2</Link> if you want Arcane itself to terminate HTTPS, or terminate at a reverse proxy in front of it.

### Agent

<Snippet text="EDGE_AGENT=true" class="mt-2 mb-2 w-full" />
<Snippet text="MANAGER_API_URL=https://manager.example.com" class="mt-2 mb-2 w-full" />
<Snippet text="AGENT_TOKEN=arc_xxxxxxxxxxxxxxxx" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_ASSETS_DIR=/app/data/edge-mtls-agent" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CA_FILE=/etc/ssl/manager-ca.crt" class="mt-2 mb-2 w-full" />

`MANAGER_API_URL` must use `https://`. `EDGE_MTLS_CA_FILE` is the trust root for the Manager's HTTPS certificate.

On first start:

1. The agent calls `POST /api/tunnel/mtls/enroll` over plain HTTPS, presenting only the `AGENT_TOKEN`.
2. The Manager issues a client certificate (valid ~1 year) and returns it along with the edge CA.
3. The agent writes them atomically into `EDGE_MTLS_ASSETS_DIR` as `agent.crt`, `agent.key`, and `ca.crt`, records enrollment completion, and reconnects using them.

On subsequent starts, the agent reuses valid assets on disk. If the local certificate is expired or inside the renewal window, it enrolls again.

## Modes

`EDGE_MTLS_MODE` accepts:

| Value      | Behavior                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `disabled` | No mTLS. Token-only auth. Default when the env var is not set.                                                                                                           |
| `optional` | Manager accepts both mTLS and token-only connections.                                                                                                                    |
| `required` | Direct Arcane TLS requires a valid client certificate. Proxy-terminated deployments must enforce client certificates at the proxy before forwarding edge tunnel traffic. |

> [!TIP]
> Use `optional` while rolling mTLS out across existing agents, then switch to `required` once all agents are enrolled.

## Using your own certificates

If you already have a PKI and want Arcane to use it instead of generating one, set the explicit paths - they always take precedence over auto-generation.

Manager:

<Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CA_FILE=/etc/arcane/edge-ca.crt" class="mt-2 mb-2 w-full" />

Arcane still signs new agent certs using its own internal key unless you also pre-provision agent certs out-of-band.

Agent:

<Snippet text="EDGE_MTLS_MODE=required" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CERT_FILE=/etc/arcane/agent.crt" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_KEY_FILE=/etc/arcane/agent.key" class="mt-2 mb-2 w-full" />
<Snippet text="EDGE_MTLS_CA_FILE=/etc/arcane/manager-ca.crt" class="mt-2 mb-2 w-full" />

When `EDGE_MTLS_CERT_FILE` and `EDGE_MTLS_KEY_FILE` are both set, the agent skips enrollment entirely.

## Downloading certificates from the UI

After you create an edge environment, the **New environment** sheet and the environment detail page expose the generated assets:

- `ca.crt` (public) - inline in the deployment snippet and downloadable by any authenticated user.
- `agent.crt` (public) - same.
- `agent.key` (private) - **not** returned inline. Use the **Download certificate** link, which hits an admin-only endpoint. This prevents the private key from landing in browser history, logs, or the query cache.

Bulk download (`.zip` of all three files) is also admin-only.

Every download emits an `environment.mtls.download` audit event with the admin's username, filename, and whether the file is sensitive.

## Local development

The repo ships helper recipes for running a local Manager and agent over HTTPS.

Generate a self-signed cert for the local Manager's HTTPS listener (covers `localhost`, `127.0.0.1`, `::1`, `arcane-local`):

<Snippet text="just dev-tls" class="mt-2 mb-2 w-full" />
<Snippet text="just dev-tls force=true" class="mt-2 mb-2 w-full" />

The first writes `backend/local-manager.{crt,key}`; the second regenerates them.

Start the backend with HTTPS enabled:

<Snippet text="TLS_ENABLED=true TLS_CERT_FILE=./backend/local-manager.crt TLS_KEY_FILE=./backend/local-manager.key just dev backend" class="mt-2 mb-2 w-full" />

Start a local edge agent. It auto-enrolls against the Manager and pins `./backend/local-manager.crt` as the trust root:

<Snippet text="AGENT_TOKEN=<edge-environment-token> just dev agent" class="mt-2 mb-2 w-full" />

Agent state (issued cert, key, CA) lives in `.tmp/edge-test-agent/edge-mtls-agent/`. Delete that directory to force a re-enrollment.

## Troubleshooting

**Agent enrollment fails when `EDGE_MTLS_MODE=required` is set.**
If `EDGE_MTLS_CERT_FILE` and `EDGE_MTLS_KEY_FILE` are unset, the agent enrolls
with the manager automatically. Check that `MANAGER_API_URL` is `https://`, the
agent token is valid, and the manager has mTLS enabled.

**Agent fails with `EDGE_MTLS_MODE requires MANAGER_API_URL to use https`.**
The agent refuses to enroll or connect over plain HTTP. Put the Manager behind HTTPS.

**Agent fails with `x509: certificate signed by unknown authority` when talking to the Manager.**
`EDGE_MTLS_CA_FILE` on the agent is the trust root for the Manager's HTTPS certificate. If you're using a self-signed Manager cert, point `EDGE_MTLS_CA_FILE` at it. If you're using a public CA (Let's Encrypt, etc.), you can leave `EDGE_MTLS_CA_FILE` unset and Arcane will fall back to the system trust store.

**Manager logs `tunnel request failed: unsupported edge command ...`.**
The route the UI is calling doesn't have a command mapping registered on the edge tunnel. File a bug including the HTTP method and path from the error.

**Agent repeatedly re-enrolls on every restart.**
`EDGE_MTLS_ASSETS_DIR` isn't persistent. Mount it on a volume so `agent.crt` and `agent.key` survive restarts.

## Rotation and revocation

- Agent certificates are valid for ~1 year.
- Agents re-enroll automatically when the local certificate is expired or close to expiry. Manually delete `agent.crt` and `agent.key` on the agent and restart to force re-enrollment immediately.
- There is no CRL / OCSP. To disable an agent, delete or regenerate its environment API key in the UI.
