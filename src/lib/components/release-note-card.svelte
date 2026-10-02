<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { ArrowDownIcon } from '#lib/icons/index.js';
	import Button from '#lib/components/ui/button/button.svelte';
	import { cn } from '#lib/utils.js';

	let {
		id,
		title,
		description,
		expanded,
		onToggle,
		class: className,
		contentNodes,
		badge,
		children
	}: {
		id: string;
		title: string;
		description?: string;
		expanded: boolean;
		onToggle: () => void;
		class?: string;
		/** Pre-rendered release notes moved in from the page's markdown. */
		contentNodes?: Node[];
		badge?: Snippet;
		children?: Snippet;
	} = $props();

	function onHeaderClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const interactive = target.closest('button, a, [onclick], [role="button"]');
		if (interactive && interactive !== e.currentTarget) return;
		onToggle();
	}

	function onHeaderKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onToggle();
		}
	}

	const mountContent = (node: HTMLElement) => {
		node.append(...(contentNodes ?? []));
	};
</script>

<article
	{id}
	class={cn(
		'relative scroll-mt-32 overflow-hidden rounded-lg border border-border bg-background target:ring-2 target:ring-primary/40',
		className
	)}
>
	<div
		class={cn(
			'flex cursor-pointer items-center justify-between gap-4 bg-surface px-6 py-4.5 transition-colors select-none hover:bg-muted/40',
			expanded && 'border-b border-border'
		)}
		role="button"
		tabindex={0}
		aria-expanded={expanded}
		onclick={onHeaderClick}
		onkeydown={onHeaderKeydown}
	>
		<div class="flex flex-col gap-1">
			<div class="flex flex-wrap items-center gap-2">
				<h2 class="text-xl font-semibold tracking-tight">{title}</h2>
				{@render badge?.()}
			</div>
			{#if description}
				<p class="font-mono text-xs text-muted-foreground">{description}</p>
			{/if}
		</div>
		<Button
			variant="outline"
			size="icon"
			class="ml-auto size-9 shrink-0"
			onclick={onToggle}
			aria-label={expanded ? 'Collapse section' : 'Expand section'}
		>
			<ArrowDownIcon
				class={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')}
			/>
		</Button>
	</div>
	{#if expanded}
		<div transition:slide={{ duration: 200 }}>
			<div class="release-notes px-6 pt-5 pb-6">
				{#if contentNodes?.length}
					<div class="grid gap-3" {@attach mountContent}></div>
				{:else}
					{@render children?.()}
				{/if}
			</div>
		</div>
	{/if}
</article>
