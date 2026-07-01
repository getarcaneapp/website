<script lang="ts">
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import { featuredCommunityItems } from '$lib/config/community.js';
	import CommunityGrid from './community-grid.svelte';
</script>

{#if featuredCommunityItems.length}
	<section class="relative pb-20">
		<div class="mb-10 flex flex-col items-center gap-2 text-center">
			<h2 class="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
				Made by the community
			</h2>
			<p class="mt-2 max-w-xl text-sm text-muted-foreground">
				Tutorials, reviews, and write-ups from people using Arcane.
			</p>
		</div>
		<CommunityGrid items={featuredCommunityItems} />
		<div class="mt-10 flex justify-center">
			<Button variant="outline" href="/community" class="group">
				Explore the community
				<ArrowRight class="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
			</Button>
		</div>
	</section>
{/if}
