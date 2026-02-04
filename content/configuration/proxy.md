---
title: 'HTTP Proxy'
description: 'Configure Arcane to use an outbound HTTP/HTTPS proxy.'
order: 5
---

As of version `1.13.2` Arcane respects the standard proxy environment variables for outbound HTTP(S) traffic. This includes container registry connectivity tests, image digest lookups, update checks, template registry access, and other external HTTP calls.

## Environment variables

Set these on the Arcane container or process:

- `HTTP_PROXY` / `http_proxy`
- `HTTPS_PROXY` / `https_proxy`
- `NO_PROXY` / `no_proxy`

`NO_PROXY` should include local addresses and internal networks so Arcane can still reach Docker, local registries, and in-cluster services.

## Notes

- If your proxy terminates TLS (MITM), install the proxy’s CA certificate in the Arcane container so HTTPS requests can validate.
- Ensure the proxy allows outbound CONNECT to registry endpoints such as `registry-1.docker.io` and `index.docker.io`.
