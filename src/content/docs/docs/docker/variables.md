---
title: "Variables"
description: "Define reusable key/value pairs and secrets available to all your projects."
---

Use variables for values that several Compose projects share, such as a domain name, timezone, or database password.

## Add a variable

1. Go to **Projects → Variables**.
2. Select **Add Variable**.
3. Enter a **Key** and a **Value**. To add several at once, switch to **Paste .env** and paste `KEY=VALUE` lines.
4. Choose the scope: all agents, or specific ones.
5. If the value is sensitive, turn on **Secret**.
6. Optional: turn on **Inject into all containers**. See [Substitution or injection](#substitution-or-injection).
7. Click **Add Variable**.

Reference it in a project like any Compose variable, for example `${DOMAIN}`.

Keys must be valid POSIX environment names: letters, digits, and underscores, not starting with a digit.

- Allowed: `DB_PASSWORD`, `_INTERNAL`
- Rejected: `db-password`, `2FAST`

## Substitution or injection

By default, a variable is only used for `${VAR}` substitution in Compose files. Containers don't see it unless a service passes it on, for example `environment: - DOMAIN=${DOMAIN}`.

Turn on **Inject into all containers** to also add the variable to every container's environment in every project. A service's own `environment` value for the same key wins. Injected variables show an **Injected** badge in the table.

> [!NOTE]
> Variables created before this option existed keep their old behavior: they are injected into all containers. Edit a variable and turn the option off to make it substitution-only.

From the CLI, pass `--inject` to `arcane-cli variables create` or `update`.

## Agent scoping

Each variable applies to **all agents** or to specific ones. The same key can have different values in staging and production. Each row shows its scope.

## Secrets

A **Secret** is encrypted in the database. Arcane masks it in the table, leaves it out of search, and never returns it to the browser.

> [!IMPORTANT]
> You can't read a stored secret back. To turn a secret into a readable variable, enter a new value. If you've lost the original, replace it.

Secrets are encrypted in the database and in transit, but written as plaintext to `.env.global` so Compose can read them. Protect that directory on the destination host.

## What Compose can see

Arcane syncs variables from its database to each environment's `.env.global`. On first sync, it imports the remote environment's existing variables before managing the file.

Compose resolves `${VAR}` from three places. Later ones win:

1. Arcane's own process environment, but only `TZ`, `LANG`, `LANGUAGE`, and `LC_ALL`.
2. `.env.global`, which the Variables page writes.
3. The project's own `.env`.

> [!WARNING]
> Projects don't inherit any other variables from the Arcane container, including through `environment: - VAR`. This keeps container-specific values and Arcane secrets out of projects. If `${VAR}` resolves empty, define it here or in the project's `.env`.

## Related

- [Projects](/docs/docker/projects): Compose files and per-project `.env` files.
- [Templates](/docs/docker/templates): start projects from ready-made Compose files.
