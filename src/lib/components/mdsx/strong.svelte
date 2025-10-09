<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';
import { cn } from '$lib/utils.js';

let {
	class: className,
	children,
	...restProps
}: HTMLAttributes<HTMLElement> = $props();
</script>

<strong class={cn('font-semibold', className)} {...restProps}>
	{@render children?.()}
</strong>
