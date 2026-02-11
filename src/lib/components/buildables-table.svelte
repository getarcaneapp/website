<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
  import { Link } from "$lib/components/ui/link/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { buildables } from "$lib/config/pages/buildables.js";

  const communityHref = "https://discord.gg/WyXYpdyV3Z";
</script>

<div class="mt-4 rounded-xl border border-border bg-muted/20 p-4 shadow-sm">
  <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
    <div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current buildables</div>
    <Badge variant="secondary" class="text-[11px] font-semibold">
      {buildables.length} available
    </Badge>
  </div>
  <Table.Root class="mb-0">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-40">Feature</Table.Head>
        <Table.Head>Description</Table.Head>
        <Table.Head class="w-32">Source</Table.Head>
        <Table.Head class="w-36">Docs</Table.Head>
        <Table.Head class="w-60">Config</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each buildables as buildable (buildable.feature)}
        <Table.Row>
          <Table.Cell class="font-medium">
            <code class="bg-muted rounded px-1 py-0.5">{buildable.feature}</code>
          </Table.Cell>
          <Table.Cell>{buildable.description}</Table.Cell>
          <Table.Cell>
            {#if buildable.source === "Community"}
              <Badge
                variant="outline"
                href={buildable.sourceHref ?? communityHref}
                target="_blank"
                rel="noreferrer"
                class="text-xs"
                title="Provided by the community">
                Community
              </Badge>
            {:else}
              <Badge variant="secondary" class="text-xs" title="Maintained by the Arcane team">Official</Badge>
            {/if}
          </Table.Cell>
          <Table.Cell>
            <Link href={buildable.docsHref}>Full docs</Link>
          </Table.Cell>
          <Table.Cell>
            {#if buildable.envVars?.length}
              <div class="flex flex-col gap-1">
                {#each buildable.envVars as envVar (envVar)}
                  <code class="bg-muted rounded px-1 py-0.5">{envVar}</code>
                {/each}
              </div>
            {:else}
              <span class="text-muted-foreground">—</span>
            {/if}
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
