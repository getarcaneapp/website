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

1. Open **Swarm → Configs**.
2. Enter a name.
3. Enter the config content.
4. Click **Create Config**.

Delete configs from the same page when they're no longer used.

## Create a secret

1. Open **Swarm → Secrets**.
2. Enter a name.
3. Enter the secret value.
4. Click **Create Secret**.

Delete secrets from the same page when they're no longer used.

## Change a config or secret

Docker doesn't allow editing configs or secrets, and Arcane has no update action. To change one, create a replacement and update the workload that uses it.

Join tokens and the manager unlock key are not Swarm secrets. They're cluster credentials, managed on the Cluster page.
