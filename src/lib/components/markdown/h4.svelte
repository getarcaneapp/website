<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		children,
		id,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h4
	{id}
	class={cn('group mt-8 scroll-m-20 font-heading text-lg font-semibold tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
	{#if id}
		<a
			href="#{id}"
			class="ml-1 font-normal text-muted-foreground no-underline opacity-0 transition-opacity group-hover:opacity-100 before:content-['#']"
			aria-label="Link to this section"
		></a>
	{/if}
</h4>
