---
title: "Podman Secrets"
description: "Create, replace, and delete Podman secrets."
---

These are Podman secrets (mounted with `--secret`), separate from [Swarm secrets](/docs/remote/swarm-configs-secrets).

## Create a secret

1. Open **Podman → Secrets**.
2. Click **Create Secret**.
3. Enter a name and value.
4. Optional: set a driver, driver options, and labels.
5. Save.

You can't view the value after saving.

## Change or delete a secret

- **Change:** enter a new value. Podman replaces the whole secret.
- **Delete:** use the row menu, once nothing uses the secret.
