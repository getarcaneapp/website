<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h6
	class={cn(
		'mt-6 scroll-m-20 text-sm font-semibold tracking-wide text-muted-foreground uppercase',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</h6>
