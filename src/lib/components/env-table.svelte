<script lang="ts">
  import { onMount } from 'svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import { envConfig, getRuntimeEnvConfig } from '$lib/config/pages/runtime-config.js';

  let tableConfig = $state(envConfig);

  onMount(() => {
    void (async () => {
      tableConfig = await getRuntimeEnvConfig();
    })();
  });
</script>

<div class="env-var-table mt-4">
  <Table.Root class="mb-6 table-fixed">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-72 whitespace-nowrap md:w-80 lg:w-96">Variable</Table.Head>
        <Table.Head class="whitespace-normal">Details</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each tableConfig as env (env.name)}
        <Table.Row>
          <Table.Cell class="align-top font-medium whitespace-nowrap">
            <code
              class="bg-muted inline-block max-w-full overflow-x-auto rounded px-1.5 py-1 text-xs whitespace-nowrap sm:text-sm">
              {env.name}
            </code>
          </Table.Cell>
          <Table.Cell class="align-top whitespace-normal">
            <div class="space-y-2.5">
              <p class="max-w-xl text-sm leading-5 wrap-break-word">{env.description}</p>

              <div class="grid gap-2 sm:grid-cols-[minmax(5rem,auto)_1fr] sm:items-center">
                <span class="text-muted-foreground self-center text-xs font-medium tracking-wide uppercase"> Default </span>
                <code class="bg-muted inline-block rounded px-2 py-1 text-xs break-all whitespace-normal sm:text-sm">
                  {env.defaultValue || '—'}
                </code>

                {#if env.exampleValue}
                  <span class="text-muted-foreground self-center text-xs font-medium tracking-wide uppercase"> Example </span>
                  <code class="bg-muted inline-block rounded px-2 py-1 text-xs break-all whitespace-normal sm:text-sm">
                    {env.exampleValue}
                  </code>
                {/if}
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
