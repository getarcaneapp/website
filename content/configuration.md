---
title: 'Arcane Configuration'
description: 'Learn how to configure Arcane using environment variables and the settings interface.'
---

<script lang="ts">
import * as Table from '$lib/components/ui/table/index.js';
import { Window } from '$lib/components/ui/window/index.js';
import { envConfig } from '$lib/config/pages/env-config.js';
</script>

## How to Change Settings

1. Open Arcane in your browser
2. Expand the **Settings** section in the sidebar.
3. Choose the section of settings you want to change.
4. Make your changes and Save

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
