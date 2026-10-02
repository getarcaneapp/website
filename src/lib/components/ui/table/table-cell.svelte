<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		inset = false,
		children,
		...restProps
	}: WithElementRef<HTMLTdAttributes> & {
		/** Pads the first and last columns away from the table edge. */
		inset?: boolean;
	} = $props();
</script>

<td
	bind:this={ref}
	data-slot="table-cell"
	class={cn(
		'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
		inset && 'first:pl-4 last:pr-4',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</td>
