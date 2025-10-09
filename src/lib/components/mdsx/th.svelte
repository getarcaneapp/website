<script lang="ts">
import type { HTMLThAttributes } from 'svelte/elements';
import { cn } from '$lib/utils.js';

let { class: className, children, ...restProps }: HTMLThAttributes = $props();
</script>

<th
	class={cn('px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right', className)}
	{...restProps}
>
	{@render children?.()}
</th>
