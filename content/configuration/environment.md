---
title: 'Environment Variables'
description: 'Configure Arcane using environment variables or the settings interface.'
order: 2
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import EnvTable from '$lib/components/env-table.svelte';
import EnvOverridesTable from '$lib/components/env-overrides-table.svelte';
import { Link } from '$lib/components/ui/link/index.js';
</script>

Most settings in Arcane can be changed via the Settings UI. Below are the settings that can be set via environment variables.

## Use External Postgres Database

By default, Arcane stores its data in a local SQLite file. This works well for most setups:

<Snippet text="file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate" class="mt-2 mb-2 w-full" />

If you want to use an external Postgres database instead, set the `DATABASE_URL` environment variable to something like this:

<Snippet text="postgres://<db_username>:<db_password>@<postgres_url>:<postgres_port>/<postgres_db_name>" class="mt-2 mb-2 w-full" />

Replace each placeholder with the real value from your database.

- `<db_username>`: your Postgres username
- `<db_password>`: your Postgres password
- `<postgres_url>`: the server address for Postgres
- `<postgres_port>`: the port Postgres uses
- `<postgres_db_name>`: the database name to connect to

## Container runtime user

Official Arcane images set `ARCANE_DEFAULT_NONROOT=true`, so the process drops to the built-in non-root user (`65532:65532`) when `PUID` and `PGID` are not set.

Use `PUID` and `PGID` if mounted files should be owned by a specific host user and group. If you use a custom Unix Docker socket with `DOCKER_HOST`, Arcane uses that socket path when adding the runtime user to the socket group.

## Timezone and scheduled jobs

Arcane runs recurring background jobs — image update polling, auto-updates, vulnerability scans, scheduled pruning, GitOps sync, and environment health checks. Their cron-style schedules are evaluated in the timezone set by `TZ`.

Set `TZ` to an [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) so schedules run at the local times you expect:

<Snippet text="TZ=America/New_York" class="mt-2 mb-2 w-full" />

If `TZ` is unset, Arcane uses the container's local time (`Local`), which is UTC on the official images. Individual job intervals and cron expressions are configured in the Settings UI, or via the environment when `UI_CONFIGURATION_DISABLED=true` or `AGENT_MODE=true` (see [Settings Overrides via Environment](#settings-overrides-via-environment)).

## Environment Variables

<EnvTable />

> [!NOTE]
> For proxy configuration, Arcane also supports lowercase aliases for the standard proxy variables (`http_proxy`, `https_proxy`, `no_proxy`).

## Bootstrapping an Admin API Key

If you want a predictable API key for automation, set `ADMIN_STATIC_API_KEY`.

Arcane will reconcile a protected admin API key at startup so your deployment can depend on a known key value without a manual UI step. See the <Link href="/api-reference">API Reference</Link> page for usage details and webhook examples.

## Downgrading Arcane

If you start an older version of Arcane with a database from a newer version, Arcane will notice at startup.

Arcane needs internet access during the downgrade because it downloads the older database changes it needs.

By default, Arcane blocks downgrades to help protect your data.

To allow a downgrade:

1. Back up your database first.
2. Set:

<Snippet text="ALLOW_DOWNGRADE=true" class="mt-2 mb-2 w-full" />

3. Start the older version of Arcane.
4. Arcane will automatically roll the database back to the version required by that release.
5. After the downgrade succeeds, set:

<Snippet text="ALLOW_DOWNGRADE=false" class="mt-2 mb-2 w-full" />

again.

## Settings Overrides via Environment

If you prefer to configure Arcane via environment variables, below is a list of all configurable variables that can be set if one of the following variables is set:

- `UI_CONFIGURATION_DISABLED=true` or
- `AGENT_MODE=true`

If neither of the above are set, these values are ignored.

<EnvOverridesTable />
