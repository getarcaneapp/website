<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLTableRowElement> = $props();
</script>

<tr class={cn('m-0 border-b last:border-b-0', className)} {...restProps}>
	{@render children?.()}
</tr>
