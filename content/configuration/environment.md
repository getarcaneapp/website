---
title: 'Environment Variables'
description: 'Configure Arcane using environment variables or the settings interface.'
---

<script lang="ts">
import * as Table from '$lib/components/ui/table/index.js';
import { Window } from '$lib/components/ui/window/index.js';
import { envConfig } from '$lib/config/pages/env-config.js';
import { Snippet } from '$lib/components/ui/snippet/index.js';
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
