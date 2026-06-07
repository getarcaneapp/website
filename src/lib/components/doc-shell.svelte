<script lang="ts">
	import type { Component } from 'svelte';
	import ExternalLink from 'virtual:icons/lucide/external-link';
	import Pencil from 'virtual:icons/lucide/pencil';

	interface DocMeta {
		title: string;
		description?: string;
		path: string;
	}

	let {
		component,
		metadata,
		wide = false
	}: {
		component: Component;
		metadata: DocMeta;
		wide?: boolean;
	} = $props();

	const Markdown = $derived(component);
</script>

<svelte:head>
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description ?? ''} />
</svelte:head>

<div class="docs-theme docs-reading relative isolate">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
	<div class="container mx-auto flex min-w-0 flex-1 px-4 py-8 lg:py-10">
		<article class="mx-auto w-full min-w-0 {wide ? 'max-w-5xl' : 'max-w-3xl'}">
			<header class="border-b border-border pb-6">
				<h1 class="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
					{metadata.title}
				</h1>
				{#if metadata.description}
					<p class="mt-3 text-lg leading-relaxed text-balance text-muted-foreground">
						{metadata.description}
					</p>
				{/if}
			</header>

			<div class="mt-8">
				<Markdown />
			</div>

			<footer
				class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
			>
				<span class="text-sm text-muted-foreground">Was this page helpful?</span>
				<a
					href={`https://github.com/getarcaneapp/website/edit/main/content/${metadata.path}.md`}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					<Pencil class="size-3.5" />
					Edit this page on GitHub
					<ExternalLink class="size-3.5" />
				</a>
			</footer>
		</article>
	</div>
</div>
