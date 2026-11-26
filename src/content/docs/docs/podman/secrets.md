---
title: "Podman Secrets"
description: "Create, replace, and delete Podman secrets."
---

These are Podman secrets (mounted with `--secret`), separate from [Swarm secrets](/docs/remote/swarm-configs-secrets).

## Create a secret

1. Open **Podman → Secrets**.
2. Click **Create Secret**.
3. Enter a name and value.
4. Optionally set a driver, driver options, and labels.
5. Click **Save**.

You can't view the value after saving.

## Change or delete a secret

- **Change:** enter a new value and Podman replaces the whole secret.
- **Delete:** use the row menu once nothing is using the secret.
