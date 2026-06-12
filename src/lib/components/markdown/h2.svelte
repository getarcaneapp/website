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

<h2
	{id}
	class={cn(
		'group mt-5 scroll-m-28 border-b border-border pb-2 font-heading text-2xl font-semibold tracking-tight first:mt-0 lg:mt-10 [&+p]:!mt-4',
		className
	)}
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
</h2>
