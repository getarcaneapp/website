<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** `panel` is a flatter, rounder surface for stacked form sections. */
		variant?: 'default' | 'panel';
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		'flex flex-col gap-6 py-6 text-card-foreground backdrop-blur-sm transition-all duration-300',
		variant === 'default' &&
			'rounded-xl border border-border/50 bg-card/80 shadow-[0_2px_8px_-2px_oklch(0_0_0/0.08),0_8px_24px_-4px_oklch(0_0_0/0.06)] hover:shadow-[0_4px_12px_-2px_oklch(0_0_0/0.1),0_12px_32px_-4px_oklch(0_0_0/0.08)] dark:shadow-[0_2px_8px_-2px_oklch(0_0_0/0.3),0_8px_24px_-4px_oklch(0_0_0/0.2)] dark:hover:shadow-[0_4px_12px_-2px_oklch(0_0_0/0.35),0_12px_32px_-4px_oklch(0_0_0/0.25)]',
		variant === 'panel' &&
			'rounded-[1.4rem] border border-border/40 bg-card/70 shadow-[0_12px_32px_-32px_oklch(0_0_0/0.35)] *:data-[slot=card-content]:grid *:data-[slot=card-content]:gap-4 *:data-[slot=card-header]:pb-2 [&_[data-slot=card-title]]:text-lg',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
