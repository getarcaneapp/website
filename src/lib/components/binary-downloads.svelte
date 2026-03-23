<script lang="ts">
  import Download from '@lucide/svelte/icons/download';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Table from '$lib/components/ui/table/index.js';

  type FileEntry = { key: string; size: number; modified: string };

  const PREFIXES = [
    { id: 'bin/arcane-next/', label: 'Arcane' },
    { id: 'bin/cli-next/', label: 'CLI' },
  ] as const;

  let activeTab = $state<string>(PREFIXES[0].id);
  let cache = $state<Record<string, FileEntry[]>>({});
  let loading = $state<Record<string, boolean>>({});
  let errors = $state<Record<string, string>>({});

  async function loadFiles(prefix: string) {
    if (cache[prefix] !== undefined || loading[prefix]) return;
    loading[prefix] = true;
    errors[prefix] = '';
    try {
      const res = await fetch(`/api/r2/list?prefix=${encodeURIComponent(prefix)}`);
      if (!res.ok) throw new Error(`Failed to load files (${res.status})`);
      const data: { files: FileEntry[] } = await res.json();
      cache[prefix] = data.files;
    } catch (e) {
      errors[prefix] = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading[prefix] = false;
    }
  }

  $effect(() => {
    loadFiles(activeTab);
  });

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function fileName(key: string): string {
    return key.split('/').pop() ?? key;
  }

  function downloadUrl(key: string): string {
    return `/api/r2/get?key=${encodeURIComponent(key)}`;
  }
</script>

<div class="my-4 overflow-hidden rounded-lg border">
  <Tabs.Root bind:value={activeTab}>
    <div class="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
      <span class="text-sm font-medium text-muted-foreground">Next Binaries</span>
      <Tabs.List class="h-7">
        {#each PREFIXES as p (p.id)}
          <Tabs.Trigger value={p.id} class="h-6 px-3 text-xs">{p.label}</Tabs.Trigger>
        {/each}
      </Tabs.List>
    </div>

    {#each PREFIXES as p (p.id)}
      <Tabs.Content value={p.id} class="m-0">
        {#if loading[p.id]}
          <div class="px-4 py-10 text-center text-sm text-muted-foreground">Loading…</div>
        {:else if errors[p.id]}
          <div class="px-4 py-10 text-center text-sm text-destructive">
            {errors[p.id]}
          </div>
        {:else if cache[p.id] !== undefined && !cache[p.id].length}
          <div class="px-4 py-10 text-center text-sm text-muted-foreground">No files available.</div>
        {:else if cache[p.id] !== undefined}
          <Table.Root>
            <Table.Header>
              <Table.Row class="hover:bg-transparent">
                <Table.Head class="pl-4">File</Table.Head>
                <Table.Head class="w-24 text-right">Size</Table.Head>
                <Table.Head class="w-36">Modified</Table.Head>
                <Table.Head class="w-12 pr-4"></Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each cache[p.id] as file (file.key)}
                <Table.Row>
                  <Table.Cell class="pl-4 font-mono text-xs">{fileName(file.key)}</Table.Cell>
                  <Table.Cell class="text-right font-mono text-xs tabular-nums text-muted-foreground">
                    {formatSize(file.size)}
                  </Table.Cell>
                  <Table.Cell class="text-xs text-muted-foreground">
                    {formatDate(file.modified)}
                  </Table.Cell>
                  <Table.Cell class="pr-4 text-right">
                    <a
                      data-sveltekit-reload
                      href={downloadUrl(file.key)}
                      title="Download {fileName(file.key)}"
                      class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Download class="size-3.5" />
                      <span class="sr-only">Download {fileName(file.key)}</span>
                    </a>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        {/if}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>
