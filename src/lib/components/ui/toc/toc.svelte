<script lang="ts" module>
	export type TocProps = {
		toc: Heading[];
		/** `index` of the heading to highlight as the current section */
		activeIndex?: number;
		class?: string;
		/** Indicates whether this is a child component or root component */
		isChild?: boolean;
	};
</script>

<script lang="ts">
	import type { Heading } from '#lib/hooks/use-toc.svelte.js';
	import { cn } from '#lib/utils.js';
	import Self from './toc.svelte';

	let { toc, activeIndex, isChild = false, class: className }: TocProps = $props();
</script>

<ul
	class={cn('m-0 list-none space-y-2 text-[0.8125rem] leading-snug', className, {
		'pl-3': isChild
	})}
>
	{#each toc as heading, i (i)}
		<li class="relative">
			{#if heading.id}
				<a
					href="#{heading.id}"
					class={cn('block text-muted-foreground transition-colors hover:text-foreground', {
						'font-medium text-foreground': heading.index === activeIndex
					})}
				>
					{heading.label}
				</a>
			{:else}
				<span class="block text-muted-foreground">{heading.label}</span>
			{/if}
		</li>
		{#if heading.children.length > 0}
			<Self class={className} toc={heading.children} {activeIndex} isChild={true} />
		{/if}
	{/each}
</ul>
