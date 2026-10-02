<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';
	import { ArrowDownIcon } from '#lib/icons/index.js';
	import { h3 as Heading } from '#lib/components/markdown/index.js';

	type CollapsibleProps = {
		title: string;
		id: string;
		description?: string;
		open?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		title,
		id,
		description,
		open = $bindable(false),
		class: className,
		children
	}: CollapsibleProps = $props();

	let details: HTMLDetailsElement | null = $state(null);

	// Expand when a link (TOC, in-page anchor, or deep link) targets this section or something inside it.
	function revealLinkedSection() {
		if (!details || !window.location.hash) return;

		let target: HTMLElement | null;
		try {
			target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
		} catch {
			return;
		}

		if (!target || !details.contains(target)) return;

		open = true;
		requestAnimationFrame(() => target.scrollIntoView());
	}

	$effect(() => {
		revealLinkedSection();
	});
</script>

<svelte:window onhashchange={revealLinkedSection} />

<details
	bind:this={details}
	bind:open
	class={cn(
		'group/collapsible my-4 rounded-lg border border-border bg-card/40 transition-colors open:bg-card/70',
		className
	)}
>
	<summary
		class="flex cursor-pointer list-none items-center gap-3 px-4 py-3 select-none [&::-webkit-details-marker]:hidden"
	>
		<div class="min-w-0 flex-1">
			<Heading {id} class="mt-0 scroll-m-28 text-lg">{title}</Heading>
			{#if description}
				<p class="mt-0.5 text-sm text-muted-foreground">{description}</p>
			{/if}
		</div>
		<ArrowDownIcon
			class="size-5 shrink-0 text-muted-foreground transition-transform group-open/collapsible:rotate-180"
			aria-hidden="true"
		/>
	</summary>
	<div class="border-t border-border px-4 pt-2 pb-4 [&>*:first-child]:mt-2">
		{@render children?.()}
	</div>
</details>
