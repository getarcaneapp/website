---
title: 'Podman Secrets'
description: 'Create, replace, and delete Podman secrets.'
---

**Podman → Secrets** manages Podman secrets (mounted with `--secret`), separate from [Swarm secrets](/docs/remote/swarm-configs-secrets). Click **Create Secret**, enter a name, value, and optionally a driver, driver options, and labels. The value can't be viewed after saving; to change it, enter a new value and Podman replaces the whole secret. Delete secrets from the row menu once nothing uses them.
