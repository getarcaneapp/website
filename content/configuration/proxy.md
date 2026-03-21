---
title: 'HTTP Proxy'
description: 'Configure Arcane to use an outbound HTTP/HTTPS proxy.'
order: 5
---

Starting with version `1.13.2`, Arcane respects the usual proxy environment variables for outbound HTTP(S) traffic. That includes registry checks, image lookups, update checks, template downloads, and other internet requests.

## Environment variables

Set these on the Arcane container or process:

- `HTTP_PROXY` / `http_proxy`
- `HTTPS_PROXY` / `https_proxy`
- `NO_PROXY` / `no_proxy`

`NO_PROXY` should include local addresses and internal networks so Arcane can still reach Docker, local registries, and other internal services.

## Notes

- If your proxy checks HTTPS traffic, install the proxy's CA certificate in the Arcane container so secure requests still work.
- Make sure the proxy allows outbound connections to registry sites such as `registry-1.docker.io` and `index.docker.io`.
