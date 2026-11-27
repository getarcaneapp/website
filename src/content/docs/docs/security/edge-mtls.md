---
title: "Agent mTLS"
description: "Add mutual TLS authentication between the Arcane Manager and its agents."
---

With mTLS, each agent also proves its identity with a client certificate, so a leaked agent key alone can't connect. Use it when agents cross networks you don't control. It builds on the agent setup in [Remote Agents](/docs/remote/agents).

## Turn on mTLS

1. Serve the Manager over HTTPS. Any valid certificate works, including self-signed or Let's Encrypt. See [TLS and HTTP/2](/docs/networking/tls).
2. On the Manager, set:

   ```bash
   ARCANE_AGENT_MTLS_MODE=required
   ```

3. On the agent, set:

   ```bash
   ARCANE_AGENT=true
   ARCANE_MANAGER_API_URL=https://manager.example.com
   ARCANE_AGENT_TOKEN=arc_etkn_xxxxxxxxxxxxxxxx
   ARCANE_AGENT_MTLS_MODE=required
   ARCANE_AGENT_MTLS_ASSETS_DIR=/app/data/agent-mtls-client
   ARCANE_AGENT_MTLS_CA_FILE=/etc/ssl/manager-ca.crt
   ```

4. Mount the agent's `ARCANE_AGENT_MTLS_ASSETS_DIR` on a persistent volume, otherwise it'll re-enroll on every restart.
5. If a reverse proxy terminates HTTPS, configure it to require client certificates on the agent tunnel routes.

Arcane creates the CA and signs each agent's certificate. Each agent generates its own private key, which never leaves the agent host, and renews its certificate automatically.

| Where   | Variable                       | Meaning                                                                                                                                                                                       |
| ------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent   | `ARCANE_MANAGER_API_URL`       | Must use `https://`.                                                                                                                                                                          |
| Agent   | `ARCANE_AGENT_MTLS_CA_FILE`    | Certificate trusted for the Manager. Unset uses the system store.                                                                                                                             |
| Agent   | `ARCANE_AGENT_MTLS_ASSETS_DIR` | Where the agent stores its certificate. Default `/app/data/agent-mtls-client`.                                                                                                                |
| Manager | `ARCANE_AGENT_MTLS_ASSETS_DIR` | Holds the CA and issued certificates. Default `/app/data/agent-mtls`. Without `ARCANE_AGENT_MTLS_CA_FILE`, Arcane creates `ca.crt` and `ca.key` here, encrypted with `ARCANE_ENCRYPTION_KEY`. |

> [!TIP]
> To roll mTLS out to existing agents, use `optional` until every agent has enrolled, then switch to `required`.

> [!IMPORTANT]
> Upgrade the Manager and its agents together. An agent that sends no certificate signing request can't enroll with a current Manager, and a current agent rejects a certificate from a Manager that generated the key itself.

## Modes

| `ARCANE_AGENT_MTLS_MODE` | Behaviour                                                                        |
| ------------------------ | -------------------------------------------------------------------------------- |
| `disabled`               | No mTLS. Agents authenticate with their agent key only. This is the default.     |
| `optional`               | The Manager accepts both mTLS and token-only connections.                        |
| `required`               | A valid client certificate is required. A TLS-terminating proxy must enforce it. |

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

Because the Manager never holds agent private keys, you can only download public certificates:

- **Agent certificates:** Open the **Connection & Agent** tab and look under **Certificate files** for **Download mTLS Bundle** (the agent CA plus the agent's certificate once enrolled) and **Download certificate**.
- **Manager CA:** Click **Download Agent CA** on the **Agents** page.

Downloading certificates requires the `environments:pair` permission, and each download logs an `environment.mtls.download` event with the user and file name. If you want to provision an agent by hand, see [Use your own certificates](#use-your-own-certificates).

## Renew or cut off an agent

- **Renew now:** delete `agent.crt` and `agent.key` on the agent and restart it. Otherwise certificates last about a year and renew automatically before expiry.
- **Cut off an agent:** turn off the agent's **Enabled** switch, or delete the agent. Generating a new enrollment token also replaces the agent key once the new agent enrolls. Arcane has no certificate revocation list.

## Troubleshooting

| Error or symptom                                                      | Fix                                                                                                                                                         |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ARCANE_AGENT_MTLS_MODE requires ARCANE_MANAGER_API_URL to use https` | Serve the Manager over HTTPS and use an `https://` URL.                                                                                                     |
| `x509: certificate signed by unknown authority`                       | Set `ARCANE_AGENT_MTLS_CA_FILE` on the agent to the Manager's certificate.                                                                                  |
| Enrollment fails                                                      | Unset `ARCANE_AGENT_MTLS_CERT_FILE` and `_KEY_FILE`. Check the enrollment token and Manager mTLS mode.                                                      |
| `agent mTLS enrollment requires a valid certificate signing request`  | The agent is older than the Manager. Update the agent.                                                                                                      |
| `certificate that was not issued for this agent's key`                | The Manager is older than the agent. Update the Manager.                                                                                                    |
| Agent enrolls again after every restart                               | Put `ARCANE_AGENT_MTLS_ASSETS_DIR` on a persistent volume.                                                                                                  |
| Agent returns `unsupported agent command`                             | The agent rejected a request outside its command allowlist. Update the agent to the Manager's version. If it persists, file a bug with the method and path. |

## How it works

The enrollment token is traded once for the agent key, which the agent then uses to request a client certificate. Because the Manager only signs the public key in the request, the private key never leaves the agent host, and a leaked agent key alone can't produce a usable certificate.

When Arcane terminates TLS directly, the client certificate authenticates every subsequent request and must match the agent key. When a reverse proxy terminates TLS, the proxy validates the certificate before forwarding tunnel traffic, and Arcane uses the agent key to identify the agent. Either way, whichever layer terminates TLS rejects missing, invalid, or mismatched certificates.

### Enrollment

1. The agent generates a private key and a certificate signing request (CSR).
2. The agent calls `POST /api/tunnel/mtls/enroll` over HTTPS with the CSR, presenting its agent key.
3. The Manager signs the CSR's public key into a client certificate valid for about a year and returns it with the agent CA.
4. The agent verifies that the certificate matches its key, then saves `agent.crt`, `agent.key`, and `ca.crt` in `ARCANE_AGENT_MTLS_ASSETS_DIR`.
5. The agent reconnects using those files and reuses them on later restarts.
6. When the certificate expires or gets close to expiry, the agent enrolls again with a new key.

For 15 minutes after an enrollment, the Manager will only re-send the same certificate to the same key; any request with a different key is refused until that window ends.

### Key types

New CAs and agent keys use **ML-DSA-87**, a post-quantum signature algorithm. Existing ECDSA P-384 CAs still work: enrolled agents keep their P-384 certificates until renewal, then switch to an ML-DSA-87 key. Note that ML-DSA certificates require **TLS 1.3** on every hop, so TLS 1.2-only proxies will break them.
