<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils.js';

	let { items, class: className = '' } = $props<{
		items: { href: string; label: string }[];
		class?: string;
	}>();
</script>

<nav class="{className} flex items-center gap-1 text-sm">
	{#each items as item}
		<Button
			href={item.href}
			variant="ghost"
			size="sm"
			class={cn(
				'transition-all duration-200 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400',
				page.url.pathname === item.href && 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
			)}
		>
			{item.label}
		</Button>
	{/each}
</nav>
