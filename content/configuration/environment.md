---
title: 'Environment Variables'
description: 'Configure Arcane using environment variables or the settings interface.'
---

<script lang="ts">
import * as Table from '$lib/components/ui/table/index.js';
import { Window } from '$lib/components/ui/window/index.js';
import { envConfig } from '$lib/config/pages/env-config.js';
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { envSettingsOverrides } from '$lib/config/pages/env-settings-overrides.js';
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

<Window class="mt-4">
  <Table.Root class="mb-8">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[220px]">Variable</Table.Head>
        <Table.Head>Purpose</Table.Head>
        <Table.Head>Default/Examples</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each envConfig as env}
        <Table.Row>
          <Table.Cell class="font-medium">
            <code class="bg-muted rounded px-1 py-0.5">{env.name}</code>
          </Table.Cell>
          <Table.Cell>{env.description}</Table.Cell>
          <Table.Cell>
            <code class="bg-muted rounded px-1 py-0.5">{env.value}</code>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</Window>

## Settings Overrides via Environment

If you prefer to configure Arcane via Environment Varibles bewlow is a list of all configurable variables that can set if one of the follwing variables is set:
- `UI_CONFIGURATION_DISABLED=true` or
- `AGENT_MODE=true`

If neither of the above are set these values are ignored.

<Window class="mt-4">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[220px]">Env Var</Table.Head>
        <Table.Head>Maps To Setting</Table.Head>
        <Table.Head>Description / Notes</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each envSettingsOverrides as item}
        <Table.Row>
          <Table.Cell>
            <code class="bg-muted rounded px-1 py-0.5">{item.env}</code>
          </Table.Cell>
          <Table.Cell>
            <code class="bg-muted rounded px-1 py-0.5">{item.settingKey}</code>
          </Table.Cell>
            <Table.Cell>
              {item.description}
              {#if item.requires}
                <div class="text-xs text-muted-foreground mt-1">Requires: {item.requires}</div>
              {/if}
              {#if item.note}
                <div class="text-xs text-muted-foreground mt-1">{item.note}</div>
              {/if}
              {#if item.sensitive}
                <div class="text-xs text-amber-500 mt-1">Sensitive</div>
              {/if}
              {#if item.deprecated}
                <div class="text-xs text-red-500 mt-1">Deprecated</div>
              {/if}
            </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</Window>
