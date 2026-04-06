<script lang="ts">
  import { onMount } from 'svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import { envSettingsOverrides, getRuntimeEnvSettingsOverrides } from '$lib/config/pages/runtime-config.js';

  let tableOverrides = $state(envSettingsOverrides);

  onMount(() => {
    void (async () => {
      tableOverrides = await getRuntimeEnvSettingsOverrides();
    })();
  });
</script>

<div class="env-var-table mt-4">
  <Table.Root class="mb-6 table-fixed">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-72 whitespace-nowrap md:w-80 lg:w-96">Env Var</Table.Head>
        <Table.Head class="whitespace-normal">Details</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each tableOverrides as item (item.env)}
        <Table.Row>
          <Table.Cell class="align-top font-medium whitespace-nowrap">
            <code
              class="bg-muted inline-block max-w-full overflow-x-auto rounded px-1.5 py-1 text-xs whitespace-nowrap sm:text-sm">
              {item.env}
            </code>
          </Table.Cell>
          <Table.Cell class="align-top whitespace-normal">
            <div class="space-y-2.5">
              <div class="grid gap-2 sm:grid-cols-[minmax(5rem,auto)_1fr] sm:items-center">
                <span class="text-muted-foreground self-center text-xs font-medium tracking-wide uppercase"> Setting </span>
                <code
                  class="bg-muted inline-block max-w-full overflow-x-auto rounded px-2 py-1 text-xs whitespace-nowrap sm:text-sm">
                  {item.settingKey}
                </code>
              </div>

              <p class="max-w-xl text-sm leading-5 wrap-break-word">{item.description}</p>

              {#if item.requires}
                <div class="text-muted-foreground text-xs leading-5 wrap-break-word">
                  <span class="font-medium uppercase tracking-wide">Requires:</span>
                  {item.requires}
                </div>
              {/if}

              {#if item.note}
                <div class="text-muted-foreground text-xs leading-5 wrap-break-word">{item.note}</div>
              {/if}

              {#if item.sensitive || item.deprecated}
                <div class="flex flex-wrap gap-2">
                  {#if item.sensitive}
                    <span class="rounded-full bg-amber-500/12 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      Sensitive
                    </span>
                  {/if}
                  {#if item.deprecated}
                    <span class="rounded-full bg-red-500/12 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                      Deprecated
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
