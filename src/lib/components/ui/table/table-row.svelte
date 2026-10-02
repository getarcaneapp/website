<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> & {
		/** `static` rows (headers, embedded tables) don't react to hover; `surface` tints a header row. */
		variant?: 'default' | 'static' | 'surface';
	} = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn(
		'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
		variant === 'static' && 'hover:bg-transparent',
		variant === 'surface' &&
			'bg-surface hover:bg-surface [&>th]:text-xs [&>th]:text-muted-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>
