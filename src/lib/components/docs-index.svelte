<script lang="ts">
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import FileText from '@lucide/svelte/icons/file-text';
  import { resolve } from '$app/paths';
  import { SidebarNavItems } from '$lib/config/docs.js';

  // Show the same groups as the sidebar, in the same order, minus Community.
  const sections = SidebarNavItems
    .filter((s) => s.title !== 'Community')
    .map((s) => ({
      title: s.title,
      docs: s.items.flatMap((item) => {
        const own = item.href ? [{ title: item.title, href: item.href }] : [];
        const children = item.items.map((c) => ({ title: c.title, href: c.href ?? '' }));
        return [...own, ...children];
      })
    }));
</script>

<div class="not-prose grid gap-10">
  {#each sections as section (section.title)}
    {#if section.docs.length > 0}
      <section class="grid gap-4">
        <div class="flex items-center justify-between gap-4">
          <h3 class="text-xl font-bold tracking-tight text-foreground">{section.title}</h3>
        </div>
        <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {#each section.docs as d (d.href)}
            <a
              class="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-black/5 bg-zinc-50/30 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-white hover:shadow-md hover:shadow-purple-500/5 dark:border-white/5 dark:bg-white/[0.015] dark:hover:bg-white/[0.03]"
              href={d.href}>
              <div
                class="pointer-events-none absolute inset-0 transition-colors duration-500 group-hover:bg-gradient-to-r group-hover:from-purple-500/5 group-hover:to-transparent">
              </div>

              <div class="relative flex items-center gap-3">
                <FileText
                  class="size-[1.125rem] shrink-0 text-muted-foreground/50 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                <span
                  class="text-[0.925rem] font-medium leading-tight tracking-tight text-foreground/90 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-300"
                  >{d.title}</span>
              </div>
              <ChevronRight
                class="relative size-[1.125rem] shrink-0 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
            </a>
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>
