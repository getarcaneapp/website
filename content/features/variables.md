---
title: 'Variables'
description: 'Define reusable key/value pairs and secrets available to all your projects.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Variables are key/value pairs that Arcane syncs out to your environments and makes available to every Compose project running there. Use them for values you'd otherwise paste into several `.env` files — a domain name, a timezone, a shared database password.

Manage them under **Customization → Variables**.

## How variables reach your projects

Arcane keeps the variables in its database and materializes the effective set for each environment into a `.env.global` file on that environment. Compose reads it during interpolation, so a variable named `PUID` is available to any project on that environment as `${PUID}`.

Changes sync automatically. On a remote environment, Arcane imports any variables that already existed there once, before it takes over the file, so you don't lose values that were set up outside Arcane.

## What Compose can and cannot see

Compose resolves a `${VAR}` in your project from three places, in increasing order of precedence:

1. A short allowlist of Arcane's own process environment — `TZ`, `LANG`, `LANGUAGE`, and `LC_ALL`, and nothing else.
2. `.env.global`, which is what the Variables page writes.
3. The project's own `.env`.

> [!WARNING]
> Arcane no longer passes the rest of its own environment into Compose interpolation. A `${VAR}` that used to resolve from a variable set on the Arcane container — `PUID`, `HOME`, or anything you added to Arcane's own compose file — now resolves to an empty string unless you define it as a Variable or in the project's `.env`. Pass-through entries written as `environment: - VAR` no longer inherit Arcane's value either.

That leakage was the problem it looked like: Arcane's `PORT` collided with project port mappings, `HOME` and `PUID` carried container-internal values that were wrong for the project, and `JWT_SECRET` and `ENCRYPTION_KEY` were readable from any Compose file on the host.

If a project stopped resolving a value after upgrading, give that value a home of its own — add it as a Variable if several projects need it, or put it in that project's `.env` if only one does.

Because `.env.global` now sits above the allowlist, a `TZ` you set as a Variable overrides the Arcane container's own `TZ` for projects on that environment.

## Add a variable

1. Go to **Customization → Variables**.
2. Select **Add Variable**.
3. Enter a **Key** and a **Value**.
4. Choose the scope — all environments, or specific ones.
5. Mark it as a secret if the value is sensitive.
6. Save.

Keys must be valid POSIX environment names: letters, digits, and underscores, not starting with a digit. `DB_PASSWORD` and `_INTERNAL` are fine; `db-password` and `2FAST` are rejected.

## Environment scoping

Each variable applies either to **all environments** or to a list you pick. This lets one key hold different values per environment — point `API_HOST` at a staging host on one environment and production on another, using the same Compose file.

The Variables table shows the scope for each row, so you can see at a glance which are fleet-wide.

## Secrets

Mark a variable as a **Secret** and Arcane encrypts the value at rest and stops returning it to the browser. The table shows a **Secret** badge and masks the value, and search won't match against it.

> [!IMPORTANT]
> Because Arcane never sends a secret value back, converting a secret to a readable variable requires entering a new value. There's no way to reveal the stored one — that's the point. If you've lost it, set a fresh value.

Secrets still land in `.env.global` in plaintext on the target environment, because Compose has to read them. Treat the environment's data directory as sensitive; the encryption protects the value in Arcane's database and in transit, not on the destination host.

## Related

- <Link href="/docs/features/projects">Projects</Link> — how Compose files and per-project `.env` files are managed.
- <Link href="/docs/templates">Templates</Link> — variables pair well with templates for parameterized deployments.
