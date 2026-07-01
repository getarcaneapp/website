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
		'group relative flex h-full flex-col gap-2 bg-background p-6 transition-all duration-300 hover:bg-gradient-to-b hover:from-primary/[0.02] hover:to-transparent sm:p-8',
		className
	)}
	{...restProps}
>
	<!-- Purple accent line on hover -->
	<div
		class="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-linear-to-r from-transparent via-primary/40 to-transparent transition-transform duration-300 group-hover:scale-x-100"
	></div>

	<div class="flex items-center gap-3">
		<div
			class="flex size-10 items-center justify-center rounded-lg border border-border bg-surface/50 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5"
		>
			<Icon
				class="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary"
			/>
		</div>
	</div>

	<h3
		class="-mt-1 text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary/90"
	>
		{title}
	</h3>
	<p class="text-sm leading-relaxed text-muted-foreground">
		{description}
	</p>
</div>
