<script lang="ts">
	import type { CommunityItem } from '$lib/types/community.type.js';
	import CommunityCard from './community-card.svelte';

	let {
		items,
		emptyMessage = 'Nothing here yet — check back soon.'
	}: { items: CommunityItem[]; emptyMessage?: string } = $props();
</script>

{#if items.length}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each items as item (item.url)}
			<CommunityCard {item} />
		{/each}
	</div>
{:else}
	<div
		class="flex flex-col items-center gap-2 rounded-md border border-dashed border-border py-16 text-center"
	>
		<p class="text-sm text-muted-foreground">{emptyMessage}</p>
	</div>
{/if}
