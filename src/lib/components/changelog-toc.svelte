<script lang="ts" module>
	// Velite TocEntry type structure
	type TocEntry = {
		title: string;
		url: string;
		items: TocEntry[];
	};

	function flattenToc(items: TocEntry[] = [], depth = 0) {
		const out: Array<{ title: string; url: string; depth: number }> = [];
		for (const item of items) {
			out.push({ title: item.title, url: item.url, depth });
			if (item.items && item.items.length) {
				out.push(...flattenToc(item.items, depth + 1));
			}
		}
		return out;
	}

	function parseVersionTitle(title: string) {
		const match = title.match(/^(v?\d[\w.-]*)\s*-\s*(\d{4}-\d{2}-\d{2})/i);
		if (!match) return { version: title, date: undefined };
		return { version: match[1], date: match[2] };
	}

	function formatDateLabel(date?: string) {
		if (!date) return '';
		const parsed = new Date(`${date}T00:00:00Z`);
		if (Number.isNaN(parsed.getTime())) return date;
		return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
	}

	function useActiveItem(getItemIds: () => string[]) {
		let activeId = $state<string | null>(null);
		const itemIds = $derived(getItemIds().map((id) => id.replace('#', '')));

		$effect(() => {
			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							activeId = entry.target.id;
						}
					}
				},
				{ rootMargin: '0px 0px -70% 0px', threshold: 0 }
			);

			for (const id of itemIds ?? []) {
				const el = document.getElementById(id);
				if (el) observer.observe(el);
			}

			return () => {
				for (const id of itemIds ?? []) {
					const el = document.getElementById(id);
					if (el) observer.unobserve(el);
				}
			};
		});

		return {
			get current() {
				return activeId;
			}
		};
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		toc,
		class: className,
		maxVisibleVersions = 10
	}: { toc: TocEntry[]; class?: string; maxVisibleVersions?: number } = $props();

	const flattened = $derived(flattenToc(toc ?? []));
	const itemUrls = $derived(flattened.map((i) => i.url));
	const active = useActiveItem(() => itemUrls);

	const versions = $derived(flattened.filter((item) => item.depth === 0 && /^v?\d/.test(item.title)));

	let collapsed = $state(true);
	const visibleVersions = $derived(collapsed ? versions.slice(0, maxVisibleVersions) : versions);
	const hasMore = $derived(versions.length > maxVisibleVersions);
</script>

{#if versions.length}
	<aside class={cn('hidden w-56 shrink-0 lg:block', className)}>
		<div class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
			<div class="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur-md">
				<p class="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">Versions</p>
				<nav class="relative flex flex-col gap-1">
					<div class={cn('flex flex-col gap-1', collapsed && hasMore && 'pb-10')}>
						{#each visibleVersions as item (item.url)}
							{@const isActive = item.url === `#${active.current}`}
							{@const parsed = parseVersionTitle(item.title)}
							<a
								href={item.url}
								class={cn(
									'group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-all',
									'hover:bg-muted/60 hover:text-foreground',
									isActive ? 'bg-muted text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
								)}
								data-active={isActive}
							>
								<span class="flex flex-col gap-1">
									<span class="truncate">{parsed.version}</span>
									{#if parsed.date}
										<span class="text-muted-foreground text-[0.7rem] uppercase tracking-[0.14em]">
											{formatDateLabel(parsed.date)}
										</span>
									{/if}
								</span>
								<span
									class={cn(
										'flex h-2 w-2 shrink-0 rounded-full transition-all',
										isActive ? 'bg-primary' : 'bg-muted-foreground/40 group-hover:bg-muted-foreground'
									)}
								></span>
							</a>
						{/each}
					</div>
					{#if collapsed && hasMore}
						<div
							class="from-background pointer-events-none absolute bottom-0 left-0 z-10 h-20 w-full bg-linear-to-t"
						></div>
						<Button
							variant="secondary"
							size="sm"
							class="absolute bottom-0 left-1/2 z-20 w-fit -translate-x-1/2"
							onclick={() => (collapsed = false)}
						>
							Show all ({versions.length})
						</Button>
					{/if}
					{#if !collapsed && hasMore}
						<Button variant="ghost" size="sm" class="mt-1 w-full" onclick={() => (collapsed = true)}>
							Show less
						</Button>
					{/if}
				</nav>
			</div>
		</div>
	</aside>
{/if}
