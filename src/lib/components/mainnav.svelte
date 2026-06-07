<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils.js';

	let { items, class: className = '' } = $props<{
		items: { href: string; label: string }[];
		class?: string;
	}>();

	const isActive = (href: string) => {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		return path === href || path.startsWith(`${href}/`);
	};
</script>

<nav class="{className} flex items-center gap-1 text-sm">
	{#each items as item (item.href)}
		<Button
			href={item.href}
			variant="ghost"
			size="sm"
			class={cn(
				'text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground',
				isActive(item.href) && 'bg-accent text-primary'
			)}
		>
			{item.label}
		</Button>
	{/each}
</nav>
