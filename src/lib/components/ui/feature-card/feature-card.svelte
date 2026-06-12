<script lang="ts">
	import type { Component } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type IconComponent = Component<{ class?: string }>;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		icon: IconComponent;
		title: string;
		description: string;
	}

	let { icon, title, description, class: className, ...restProps }: Props = $props();

	const Icon = $derived(icon);
</script>

<div
	class={cn(
		'flex h-full flex-col gap-2 bg-background p-6 transition-colors duration-150 hover:bg-surface sm:p-8',
		className
	)}
	{...restProps}
>
	<Icon class="size-5 text-muted-foreground" />
	<h3 class="mt-2 text-sm font-medium text-foreground">
		{title}
	</h3>
	<p class="text-sm leading-relaxed text-muted-foreground">
		{description}
	</p>
</div>
