<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		'bg-card/80 text-card-foreground border-border/50 flex flex-col gap-6 rounded-2xl border py-6 shadow-[0_2px_8px_-2px_oklch(0_0_0/0.08),0_8px_24px_-4px_oklch(0_0_0/0.06)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_12px_-2px_oklch(0_0_0/0.1),0_12px_32px_-4px_oklch(0_0_0/0.08)] dark:shadow-[0_2px_8px_-2px_oklch(0_0_0/0.3),0_8px_24px_-4px_oklch(0_0_0/0.2)] dark:hover:shadow-[0_4px_12px_-2px_oklch(0_0_0/0.35),0_12px_32px_-4px_oklch(0_0_0/0.25)]',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
