<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
  import { envConfig } from "$lib/config/pages/env-config.js";
</script>

<div class="env-var-table mt-4">
  <Table.Root class="mb-6">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-55">Variable</Table.Head>
        <Table.Head>Description</Table.Head>
        <Table.Head>Value</Table.Head>
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
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-1">
                <span class="text-muted-foreground w-14 text-xs">Default:</span>
                <code class="bg-muted rounded px-1 py-0.5">{env.defaultValue || "—"}</code>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-muted-foreground w-14 text-xs">Example:</span>
                <code class="bg-muted rounded px-1 py-0.5">{env.exampleValue || "—"}</code>
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
