---
title: 'Swarm Configs and Secrets'
description: 'Manage Docker Swarm configs and secrets in Arcane.'
---

Swarm **configs** and **secrets** pass runtime data to services and stacks without including it in your images.

## Configs vs. secrets

| Use a **config** for       | Use a **secret** for |
| -------------------------- | -------------------- |
| application config files   | API tokens           |
| feature flags              | passwords            |
| non-sensitive env defaults | private keys         |
|                            | registry credentials |

If a value is sensitive, use a secret. Otherwise a config is fine.

## Create a config

1. Open **Swarm → Configs** and click **Create Config**.
2. Enter a name and the config content.
3. Optionally, add labels.
4. Click **Create Config**.

## Create a secret

1. Open **Swarm → Secrets** and click **Create Secret**.
2. Enter a name and the secret value.
3. Optionally, add labels.
4. Click **Create Secret**.

Secret values can't be viewed after they're saved.

## Change a config or secret

Click a config or secret, or choose **Edit** from its row menu, to change its labels. Docker doesn't allow changing the name, the config content, or the secret value. To change those, create a replacement and update the services that use it, then delete the old one from its row menu.

If someone else changes the same config or secret while you're editing it, Docker rejects your save. Open it again to load the current version.

Join tokens and the manager unlock key are not Swarm secrets. They're cluster credentials, managed on the Cluster page.
