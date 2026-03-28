---
title: 'Swarm Configs and Secrets'
description: 'Manage Docker Swarm configs and secrets in Arcane'
order: 4
---

Swarm configs and secrets let you provide runtime data to services and stacks without baking everything into your images.

## When to Use Configs

Swarm configs are for non-sensitive data that services can mount at runtime.

Common examples:

- application config files
- feature flags
- non-secret environment defaults

To create a config:

1. Open **Swarm > Configs**.
2. Enter a name.
3. Enter the config content.
4. Click **Create Config**.

Delete configs from the Configs page when they are no longer needed.

## When to Use Secrets

Swarm secrets are for sensitive values.

Common examples:

- API tokens
- passwords
- private keys
- registry credentials

To create a secret:

1. Open **Swarm > Secrets**.
2. Enter a name.
3. Enter the secret value.
4. Click **Create Secret**.

Delete secrets from the Secrets page when they are no longer needed.

## Operational Notes

- Treat configs and secrets as versioned inputs to workloads rather than mutable live files.
- If a running workload depends on an older config or secret, create a replacement and update the workload deliberately.
- Join tokens and unlock keys belong to cluster management, not the Secrets page; see the Swarm Cluster page for those workflows.
