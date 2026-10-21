---
title: 'Podman Secrets'
description: 'Create, replace, and delete Podman secrets.'
---

**Podman → Secrets** manages Podman secrets, which containers mount with `--secret`. Podman secrets are separate from [Swarm secrets](/docs/remote/swarm-configs-secrets).

To create one, click **Create Secret**, enter a name and value, and optionally a driver, driver options, and labels. The value can't be viewed after it's saved. To change it, open the secret and enter a new value; Podman replaces the whole secret. Delete secrets from the row menu once nothing uses them.
