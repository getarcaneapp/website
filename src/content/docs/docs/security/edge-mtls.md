---
title: 'Agent mTLS'
description: 'Add mutual TLS authentication between the Arcane Manager and its agents.'
---

With mTLS, each agent also proves its identity with a client certificate, so a leaked token alone can't connect. Use it when agents cross networks you don't control. It builds on the agent setup in [Remote Environments](/docs/remote/environments).

## Turn on mTLS

1. Serve the Manager over HTTPS. Any valid certificate works, including self-signed or Let's Encrypt. See [TLS and HTTP/2](/docs/networking/tls).
2. On the Manager, set:

   ```bash
   ARCANE_AGENT_MTLS_MODE=required
   ARCANE_AGENT_MTLS_ASSETS_DIR=/app/data/edge-mtls
   ```

3. On the agent, set:

   ```bash
   ARCANE_AGENT=true
   ARCANE_MANAGER_API_URL=https://manager.example.com
   ARCANE_AGENT_TOKEN=arc_xxxxxxxxxxxxxxxx
   ARCANE_AGENT_MTLS_MODE=required
   ARCANE_AGENT_MTLS_ASSETS_DIR=/app/data/agent-mtls-client
   ARCANE_AGENT_MTLS_CA_FILE=/etc/ssl/manager-ca.crt
   ```

4. Mount the agent's `ARCANE_AGENT_MTLS_ASSETS_DIR` on a persistent volume. Otherwise the agent enrolls again on every restart.
5. If a reverse proxy terminates HTTPS, make it require client certificates on the agent tunnel routes.

Arcane creates the CA and agent certificates for you and renews them automatically.

| Where | Variable | Meaning |
| --- | --- | --- |
| Agent | `ARCANE_MANAGER_API_URL` | Must use `https://`. |
| Agent | `ARCANE_AGENT_MTLS_CA_FILE` | Certificate trusted for the Manager. Unset uses the system store. |
| Manager | `ARCANE_AGENT_MTLS_ASSETS_DIR` | Holds the CA and issued certificates. Without `ARCANE_AGENT_MTLS_CA_FILE`, Arcane creates `ca.crt` and `ca.key` here, encrypted with `ARCANE_ENCRYPTION_KEY`. |

> [!TIP]
> To roll mTLS out to existing agents, use `optional` until every agent has enrolled, then switch to `required`.

## Modes

| `ARCANE_AGENT_MTLS_MODE` | Behaviour |
| --- | --- |
| `disabled` | No mTLS. Agents authenticate with their token only. This is the default. |
| `optional` | The Manager accepts both mTLS and token-only connections. |
| `required` | A valid client certificate is required. A TLS-terminating proxy must enforce it. |

## Use your own certificates

1. On the Manager, set:

   ```bash
   ARCANE_AGENT_MTLS_MODE=required
   ARCANE_AGENT_MTLS_CA_FILE=/etc/arcane/edge-ca.crt
   ```

2. On the agent, set:

   ```bash
   ARCANE_AGENT_MTLS_MODE=required
   ARCANE_AGENT_MTLS_CERT_FILE=/etc/arcane/agent.crt
   ARCANE_AGENT_MTLS_KEY_FILE=/etc/arcane/agent.key
   ARCANE_AGENT_MTLS_CA_FILE=/etc/arcane/manager-ca.crt
   ```

When both `ARCANE_AGENT_MTLS_CERT_FILE` and `ARCANE_AGENT_MTLS_KEY_FILE` are set, the agent skips enrollment. Arcane still signs new agent certificates with its own internal key unless you issue them yourself.

## Download certificates from the UI

After creating a remote environment, download its certificate files from the **New environment** sheet or its detail page.

| File | Access |
| --- | --- |
| `ca.crt` | Public. Shown in the deployment snippet and downloadable by any signed-in user. |
| `agent.crt` | Public. Same as `ca.crt`. |
| `agent.key` | Private. Never shown inline. Download it with the admin-only **Download certificate** link, so the key stays out of browser history and logs. |

The `.zip` of all three is also admin-only. Each download logs an `environment.mtls.download` audit event with the admin's username, file name, and whether the file is sensitive.

## Renew or cut off an agent

- **Renew now:** delete `agent.crt` and `agent.key` on the agent and restart it. Otherwise certificates last about a year and renew automatically before expiry.
- **Cut off an agent:** delete or regenerate its environment's API key in the UI. Arcane has no revocation list.

## Troubleshooting

| Error or symptom | Fix |
| --- | --- |
| `ARCANE_AGENT_MTLS_MODE requires ARCANE_MANAGER_API_URL to use https` | Serve the Manager over HTTPS and use an `https://` URL. |
| `x509: certificate signed by unknown authority` | Set `ARCANE_AGENT_MTLS_CA_FILE` on the agent to the Manager's certificate. |
| Enrollment fails | Unset `ARCANE_AGENT_MTLS_CERT_FILE` and `_KEY_FILE`. Check the token and Manager mTLS mode. |
| Agent enrolls again after every restart | Put `ARCANE_AGENT_MTLS_ASSETS_DIR` on a persistent volume. |
| Agent returns `unsupported agent command` | The action has no tunnel handler. File a bug with the method and path. |

## How it works

- The agent token is used once, to enroll and get a client certificate.
- If Arcane terminates TLS, the certificate authenticates every later request. Its environment must match the agent token's.
- If a reverse proxy terminates TLS, the proxy checks the certificate before forwarding agent tunnel traffic. Arcane uses the token to find the environment.
- Whichever layer terminates TLS rejects a missing, invalid, or wrong-environment certificate.

### Enrollment

1. The agent calls `POST /api/tunnel/mtls/enroll` over HTTPS, presenting only its `ARCANE_AGENT_TOKEN`.
2. The Manager issues a client certificate valid for about a year and returns it with the agent CA.
3. The agent saves `agent.crt`, `agent.key`, and `ca.crt` in `ARCANE_AGENT_MTLS_ASSETS_DIR`.
4. The agent reconnects with them. Later starts reuse the files.
5. The agent enrolls again when the certificate is expired or close to expiry.

### Key types

- New CAs use **ML-DSA-87**, a post-quantum signature algorithm.
- An existing ECDSA P-384 CA keeps working and issuing P-384 certificates. Enrolled agents don't re-enroll.
- ML-DSA certificates need **TLS 1.3** on every hop. TLS 1.2-only proxies break them.
