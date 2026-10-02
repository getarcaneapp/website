---
title: 'Outbound HTTP Proxy'
description: 'Send Arcane outbound HTTP and HTTPS requests through a forward proxy.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

If your network only allows internet access through a forward proxy, point Arcane's outbound requests at it with the standard proxy environment variables. This covers registry checks, image lookups, update checks, template downloads, and other requests Arcane makes to the internet. To put a proxy in front of Arcane for incoming traffic, see <Link href="/docs/networking/reverse-proxy">Reverse Proxy Setup</Link> instead.

## Set the proxy variables

Set these on the Arcane container or process:

| Variable                      | Use                                                   |
| ----------------------------- | ----------------------------------------------------- |
| `HTTP_PROXY` / `http_proxy`   | Proxy for plain HTTP requests.                        |
| `HTTPS_PROXY` / `https_proxy` | Proxy for HTTPS requests.                             |
| `NO_PROXY` / `no_proxy`       | Hosts and networks that Arcane should reach directly. |

Include local addresses and internal networks in `NO_PROXY` so Arcane can still reach Docker, local registries, and other internal services.

## Proxy requirements

- If your proxy inspects HTTPS traffic, install the proxy's CA certificate in the Arcane container so secure requests still work.
- Allow outbound connections to registry hosts such as `registry-1.docker.io` and `index.docker.io`.
