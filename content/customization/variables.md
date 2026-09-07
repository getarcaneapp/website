---
title: 'Variables'
description: 'Define reusable key/value pairs and secrets available to all your projects.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Use **Customization → Variables** for values shared by Compose projects, such as a domain name, timezone, or database password.

## How variables reach your projects

Arcane syncs variables from its database to each environment's `.env.global`. Projects reference them as `${PUID}`, for example. On first sync, Arcane imports the remote environment's existing variables before managing the file.

## What Compose can and cannot see

Compose resolves a `${VAR}` in your project from three places, in increasing order of precedence:

1. A short allowlist of Arcane's own process environment — `TZ`, `LANG`, `LANGUAGE`, and `LC_ALL`, and nothing else.
2. `.env.global`, which is what the Variables page writes.
3. The project's own `.env`.

> [!WARNING]
> Projects no longer inherit Arcane's other environment variables, including through `environment: - VAR`. If `${VAR}` becomes empty after upgrading, define it here or in the project's `.env`. This prevents container-specific values and Arcane secrets from leaking into projects.

## Add a variable

1. Go to **Customization → Variables**.
2. Select **Add Variable**.
3. Enter a **Key** and a **Value**.
4. Choose the scope — all environments, or specific ones.
5. Mark it as a secret if the value is sensitive.
6. Save.

Keys must be valid POSIX environment names: letters, digits, and underscores, not starting with a digit. `DB_PASSWORD` and `_INTERNAL` are fine; `db-password` and `2FAST` are rejected.

## Environment scoping

Choose **all environments** or specific environments. The same key can have different values in staging and production; each row shows its scope.

## Secrets

Mark a value as a **Secret** to encrypt it in the database. Arcane masks it in the table, excludes it from search, and never returns it to the browser.

> [!IMPORTANT]
> Arcane doesn't return stored secret values. To convert a secret to a readable variable, enter a new value. If you've lost the original, you'll need to replace it.

Secrets are encrypted in the database and in transit, but written as plaintext in `.env.global` for Compose. Protect that directory on the destination host.

## Related

- <Link href="/docs/features/projects">Projects</Link> — how Compose files and per-project `.env` files are managed.
- <Link href="/docs/customization/templates">Templates</Link> — variables pair well with templates for parameterized deployments.
