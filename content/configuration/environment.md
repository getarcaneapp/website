---
title: 'Environment Variables'
description: 'Configure Arcane using environment variables or the settings interface.'
order: 2
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import EnvTable from '$lib/components/env-table.svelte';
import EnvOverridesTable from '$lib/components/env-overrides-table.svelte';
</script>

Most of the settings in Arcane can be changed via the Settings UI. Below are a the settings that can be set via the Environment.

## Use External Postgres Database

By default Arcane will use a SQLite database with the following connection string:

<Snippet text="file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate" class="mt-2 mb-2 w-full" />

If you would like to change to a external postgres database, change the `DATABASE_URL` Env variable to something similar to below:

<Snippet text="postgres://<db_username>:<db_password>@<postgres_url>:<postgres_port>/<postgres_db_name>" class="mt-2 mb-2 w-full" />

Make sure to replace the placeholder values with the real values for your environment.

- `<db_username>`: The username to use to connect to the postgres Database
- `<db_password>`: The password to use to connect to the postgres Database
- `<postgres_url>`: The server where the postgres instance is (can be a dns name or ip address)
- `<postgres_port>`: The port to use to connect to the postgres server
- `<postgres_db_name>`: The name of the database to use on the postgres server

## Environment Variables

<EnvTable />

## Settings Overrides via Environment

If you prefer to configure Arcane via environment variables, below is a list of all configurable variables that can be set if one of the following variables is set:
- `UI_CONFIGURATION_DISABLED=true` or
- `AGENT_MODE=true`

If neither of the above are set, these values are ignored.

<EnvOverridesTable />
