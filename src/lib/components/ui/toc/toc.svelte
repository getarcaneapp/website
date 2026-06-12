<script lang="ts" module>
	export type TocProps = {
		toc: Heading[];
		class?: string;
		/** Indicates whether this is a child component or root component */
		isChild?: boolean;
	};
</script>

<script lang="ts">
	import type { Heading } from '$lib/hooks/use-toc.svelte';
	import { cn } from '$lib/utils.js';
	import Self from './toc.svelte';

	let { toc, isChild = false, class: className }: TocProps = $props();
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
						'font-medium text-foreground': heading.active
					})}
				>
					{heading.label}
				</a>
			{:else}
				<span class="block text-muted-foreground">{heading.label}</span>
			{/if}
		</li>
		{#if heading.children.length > 0}
			<Self class={className} toc={heading.children} isChild={true} />
		{/if}
	{/each}
</ul>
