<script lang="ts">
	import { page } from '$app/state';
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

<nav class="{className} flex items-center gap-5 text-sm">
	{#each items as item (item.href)}
		<a
			href={item.href}
			class={cn(
				'transition-colors duration-200',
				isActive(item.href)
					? 'font-medium text-foreground'
					: 'text-muted-foreground hover:text-foreground'
			)}
		>
			{item.label}
		</a>
	{/each}
</nav>
