---
title: 'Edge Agent mTLS'
description: 'Add mutual TLS authentication between the Arcane Manager and its edge agents.'
---

Edge mTLS (mutual TLS) makes each Edge agent prove its identity with a client certificate, on top of its token. Use it when agents reach the Manager over networks you don't control, so a leaked token alone can't connect. Arcane can create the certificate authority (CA) and agent certificates, and renews agent certificates automatically.

> [!NOTE]
> It builds on the Edge setup in [Remote Environments](/docs/remote/environments).

## What it does

- The agent token is used once, to enroll and get a client certificate.
- If Arcane terminates TLS, the certificate authenticates every later request. Its environment must match the agent token's.
- If a reverse proxy terminates TLS, the proxy checks the certificate before forwarding edge tunnel traffic. Arcane uses the token to find the environment.
- Whichever layer terminates TLS rejects a missing, invalid, or wrong-environment certificate.

## Quick start

1. Serve the Manager over HTTPS. Any valid certificate works, including self-signed or Let's Encrypt.

   > [!NOTE]
   > See [TLS and HTTP/2](/docs/networking/tls) to have Arcane serve HTTPS itself or to put a reverse proxy in front.

2. On the Manager, set:

   ```bash
   ARCANE_EDGE_MTLS_MODE=required
   ```

   ```bash
   ARCANE_EDGE_MTLS_ASSETS_DIR=/app/data/edge-mtls
   ```

3. On the agent, set:

   ```bash
   ARCANE_EDGE_AGENT=true
   ```

   ```bash
   ARCANE_MANAGER_API_URL=https://manager.example.com
   ```

   ```bash
   ARCANE_AGENT_TOKEN=arc_xxxxxxxxxxxxxxxx
   ```

   ```bash
   ARCANE_EDGE_MTLS_MODE=required
   ```

   ```bash
   ARCANE_EDGE_MTLS_ASSETS_DIR=/app/data/edge-mtls-agent
   ```

   ```bash
   ARCANE_EDGE_MTLS_CA_FILE=/etc/ssl/manager-ca.crt
   ```

4. Mount the agent's `ARCANE_EDGE_MTLS_ASSETS_DIR` on a persistent volume. Otherwise the agent enrolls again on every restart.

`ARCANE_MANAGER_API_URL` must use `https://`. On the agent, `ARCANE_EDGE_MTLS_CA_FILE` is the certificate it trusts for the Manager's HTTPS: point it at a self-signed Manager certificate, or leave it unset to use the system trust store (e.g. Let's Encrypt). If a trusted reverse proxy terminates HTTPS and sends Arcane plain HTTP, the proxy must require client certificates on the edge tunnel routes. On the Manager, `ARCANE_EDGE_MTLS_ASSETS_DIR` holds the CA and issued certificates. Without `ARCANE_EDGE_MTLS_CA_FILE` on the Manager, Arcane creates the edge CA there as `ca.crt` and `ca.key`, encrypting the key with your `ARCANE_ENCRYPTION_KEY`.

### How enrollment works

1. The agent calls `POST /api/tunnel/mtls/enroll` over HTTPS, presenting only its `ARCANE_AGENT_TOKEN`.
2. The Manager issues a client certificate valid for about a year and returns it with the edge CA.
3. The agent saves them in `ARCANE_EDGE_MTLS_ASSETS_DIR` as `agent.crt`, `agent.key`, and `ca.crt`, and reconnects using them. Later starts reuse the saved files, and the agent enrolls again if the certificate has expired or is close to expiry.

### Key types

Edge CAs that Arcane creates use **ML-DSA-87**, a post-quantum signature algorithm. An existing ECDSA P-384 CA keeps working and keeps issuing P-384 client certificates; enrolled agents don't re-enroll. ML-DSA client certificates need **TLS 1.3** on every hop, so a TLS 1.2-only proxy breaks them.

## Modes

| `ARCANE_EDGE_MTLS_MODE` | Behaviour                                                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled`       | No mTLS; agents authenticate with their token only. This is the default.                                                                                                           |
| `optional`       | The Manager accepts both mTLS and token-only connections.                                                                                                                          |
| `required`       | When Arcane terminates TLS, it requires a valid client certificate. When a proxy terminates TLS, the proxy must require client certificates before forwarding edge tunnel traffic. |

> [!TIP]
> To roll mTLS out to existing agents, use `optional` until every agent has enrolled, then switch to `required`.

## Use your own certificates

Set the paths explicitly to use your own CA instead of generated certificates. Manager:

```bash
ARCANE_EDGE_MTLS_MODE=required
```

```bash
ARCANE_EDGE_MTLS_CA_FILE=/etc/arcane/edge-ca.crt
```

Arcane still signs new agent certificates with its own internal key unless you issue them yourself. Agent:

```bash
ARCANE_EDGE_MTLS_MODE=required
```

```bash
ARCANE_EDGE_MTLS_CERT_FILE=/etc/arcane/agent.crt
```

```bash
ARCANE_EDGE_MTLS_KEY_FILE=/etc/arcane/agent.key
```

```bash
ARCANE_EDGE_MTLS_CA_FILE=/etc/arcane/manager-ca.crt
```

When both `ARCANE_EDGE_MTLS_CERT_FILE` and `ARCANE_EDGE_MTLS_KEY_FILE` are set, the agent skips enrollment.

## Download certificates from the UI

After creating an Edge environment, download its certificate files from the **New environment** sheet or its detail page:

| File        | Access                                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ca.crt`    | Public. Shown in the deployment snippet and downloadable by any signed-in user.                                                                         |
| `agent.crt` | Public. Same as `ca.crt`.                                                                                                                               |
| `agent.key` | Private. Never shown inline; download it with the admin-only **Download certificate** link, so the key stays out of browser history and logs. |

The `.zip` of all three is also admin-only. Each download logs an `environment.mtls.download` audit event with the admin's username, file name, and whether the file is sensitive.

## Rotate and revoke certificates

Agent certificates last about a year and renew automatically before expiry. To renew now, delete `agent.crt` and `agent.key` on the agent and restart it. Arcane has no revocation list: to cut off an agent, delete or regenerate its environment's API key in the UI.

## Troubleshooting

| Error or symptom                                                   | Fix                                                                                                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ARCANE_EDGE_MTLS_MODE requires ARCANE_MANAGER_API_URL to use https`             | The agent won't enroll or connect over plain HTTP. Serve the Manager over HTTPS and use an `https://` URL.                                  |
| `x509: certificate signed by unknown authority`                    | The agent doesn't trust the Manager's certificate. For a self-signed certificate, set `ARCANE_EDGE_MTLS_CA_FILE` on the agent to that certificate. |
| Enrollment fails                                                   | Check that `ARCANE_EDGE_MTLS_CERT_FILE` and `ARCANE_EDGE_MTLS_KEY_FILE` are unset on the agent, the agent token is valid, and mTLS is on for the Manager. |
| Agent enrolls again after every restart                            | `ARCANE_EDGE_MTLS_ASSETS_DIR` on the agent isn't on a persistent volume.                                                                           |
| Manager logs `tunnel request failed: unsupported edge command ...` | That UI action has no handler on the edge tunnel. File a bug with the HTTP method and path from the error.                                  |
