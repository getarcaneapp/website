---
title: "Outbound HTTP Proxy"
description: "Send Arcane outbound HTTP and HTTPS requests through a forward proxy."
---

Use this when your network reaches the internet only through a forward proxy. It covers registry checks, image lookups, update checks, template downloads, and other outbound requests. For a proxy in front of Arcane (incoming traffic), see [Reverse Proxy Setup](/docs/networking/reverse-proxy).

## Set up the proxy

1. Set the proxy variables on the Arcane container or process:

   | Variable                      | Use                                              |
   | ----------------------------- | ------------------------------------------------ |
   | `HTTP_PROXY` / `http_proxy`   | Proxy for plain HTTP requests.                   |
   | `HTTPS_PROXY` / `https_proxy` | Proxy for HTTPS requests.                        |
   | `NO_PROXY` / `no_proxy`       | Hosts and networks Arcane should reach directly. |

2. Add local addresses and internal networks to `NO_PROXY`, so Arcane still reaches Docker, local registries, and other internal services.
3. If your proxy inspects HTTPS traffic, install its CA certificate in the Arcane container.
4. Allow outbound connections to registry hosts such as `registry-1.docker.io` and `index.docker.io`.
