<script lang="ts">
	// Define a prop to receive the navigation data
	let { nav } = $props<{
		nav: {
			heading?: string;
			items: { label: string; href: string }[];
		}[];
	}>();
</script>

<!-- Sidebar -->
<aside class="bg-sidebar hidden w-64 overflow-y-auto p-6 md:block">
	<nav class="space-y-8 text-sm">
		{#each nav as section}
			<div>
				{#if section.heading}
					<div class="text-muted-foreground mb-2 text-xs font-semibold uppercase">
						{section.heading}
					</div>
				{/if}
				<div class="space-y-1">
					{#each section.items as item}
						<a
							href={item.href}
							class="hover:bg-accent hover:text-accent-foreground block rounded px-2 py-1 transition-colors"
						>
							{item.label}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</nav>
</aside>
