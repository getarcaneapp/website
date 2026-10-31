---
title: 'Outbound HTTP Proxy'
description: 'Send Arcane outbound HTTP and HTTPS requests through a forward proxy.'
---

If your network reaches the internet only through a forward proxy, point Arcane at it with the standard proxy variables. This covers registry checks, image lookups, update checks, template downloads, and other outbound requests. For a proxy in front of Arcane (incoming traffic), see [Reverse Proxy Setup](/docs/networking/reverse-proxy).

## Set the proxy variables

Set these on the Arcane container or process. Include local addresses and internal networks in `NO_PROXY` so Arcane still reaches Docker, local registries, and other internal services.

| Variable                      | Use                                                   |
| ----------------------------- | ----------------------------------------------------- |
| `HTTP_PROXY` / `http_proxy`   | Proxy for plain HTTP requests.                        |
| `HTTPS_PROXY` / `https_proxy` | Proxy for HTTPS requests.                             |
| `NO_PROXY` / `no_proxy`       | Hosts and networks that Arcane should reach directly. |

## Proxy requirements

- If your proxy inspects HTTPS traffic, install its CA certificate in the Arcane container.
- Allow outbound connections to registry hosts such as `registry-1.docker.io` and `index.docker.io`.
