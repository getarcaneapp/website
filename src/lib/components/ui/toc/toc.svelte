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
	class={cn('m-0 list-none space-y-2 text-[0.82rem] leading-snug', className, {
		'border-l border-border/60 pl-4': isChild
	})}
>
	{#each toc as heading, i (i)}
		<li class="relative">
			<span
				class={cn(
					'absolute top-[0.45rem] left-0 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 transition',
					{
						'bg-primary shadow-[0_0_0_4px_oklch(0.63_0.13_200/0.15)]': heading.active
					}
				)}
			></span>
			{#if heading.id}
				<a
					href="#{heading.id}"
					class={cn('block pl-3 text-muted-foreground transition-colors hover:text-foreground', {
						'font-semibold text-foreground': heading.active
					})}
				>
					{heading.label}
				</a>
			{:else}
				<span class="block pl-3 text-muted-foreground">{heading.label}</span>
			{/if}
		</li>
		{#if heading.children.length > 0}
			<Self class={className} toc={heading.children} isChild={true} />
		{/if}
	{/each}
</ul>
