<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		inset = false,
		children,
		...restProps
	}: WithElementRef<HTMLThAttributes> & {
		/** Pads the first and last columns away from the table edge. */
		inset?: boolean;
	} = $props();
</script>

<th
	bind:this={ref}
	data-slot="table-head"
	class={cn(
		'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
		inset && 'first:pl-4 last:pr-4',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
