<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: HTMLThAttributes = $props();
</script>

<th
	class={cn(
		'bg-surface px-4 py-2 text-left text-xs font-medium text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
