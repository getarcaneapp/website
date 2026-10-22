---
title: "Swarm Configs and Secrets"
description: "Manage Docker Swarm configs and secrets in Arcane."
---

Swarm **configs** and **secrets** pass runtime data to services and stacks without including it in your images.

## Configs vs. secrets

If a value is sensitive, use a secret; otherwise a config is fine.

- **Config:** application config files, feature flags, non-sensitive env defaults.
- **Secret:** API tokens, passwords, private keys, registry credentials.

## Create a config

1. Open **Swarm → Configs** and click **Create Config**.
2. Enter a name, the config content, and optional labels.
3. Click **Create Config**.

## Create a secret

1. Open **Swarm → Secrets** and click **Create Secret**.
2. Enter a name, the secret value, and optional labels.
3. Click **Create Secret**. You can't view the value after saving.

## Change a config or secret

To change labels, click the config or secret, or choose **Edit** from its row menu.

Docker doesn't allow changing the name, config content, or secret value. To change those:

1. Create a replacement.
2. Update the services that use it.
3. Delete the old one from its row menu.

If someone else changes it while you edit, Docker rejects your save. Open it again to load the current version.

Join tokens and the manager unlock key are not Swarm secrets. They're cluster credentials, managed on the Cluster page.
