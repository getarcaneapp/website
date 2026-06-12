<script lang="ts">
	import ChevronLeft from 'virtual:icons/lucide/chevron-left';
	import ChevronRight from 'virtual:icons/lucide/chevron-right';
	import ExternalLink from 'virtual:icons/lucide/external-link';
	import Pencil from 'virtual:icons/lucide/pencil';
	import { page } from '$app/state';
	import * as Toc from '$lib/components/ui/toc/index.js';
	import { findNeighbors } from '$lib/config/docs.js';
	import { UseToc } from '$lib/hooks/use-toc.svelte.js';

	let { data } = $props();
	const Markdown = $derived(data.component);
	const doc = $derived(data.metadata);

	const toc = new UseToc();

	const formatBreadcrumb = (value: string) =>
		value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

	const breadcrumbs = $derived(
		(doc.path ?? '')
			.split('/')
			.filter((segment) => segment && segment !== 'index')
			.map(formatBreadcrumb)
	);

	const neighbors = $derived(findNeighbors(page.url.pathname));

	const attachToc = (node: HTMLElement) => {
		toc.ref = node;
		return {
			destroy() {
				toc.ref = undefined;
			}
		};
	};
</script>

<svelte:head>
	<title>{doc.title}</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<div class="flex min-w-0 flex-1">
	<div use:attachToc class="mx-auto flex w-full min-w-0 flex-1 justify-center gap-12 py-8 lg:pl-8">
		<article class="w-full max-w-3xl min-w-0">
			<!-- Breadcrumb -->
			<nav
				class="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
				aria-label="Breadcrumb"
			>
				<a href="/docs" class="transition-colors hover:text-foreground">Docs</a>
				{#each breadcrumbs as crumb, i (crumb)}
					<ChevronRight class="size-3 text-muted-foreground/50" />
					<span class={i === breadcrumbs.length - 1 ? 'text-foreground' : ''}>{crumb}</span>
				{/each}
			</nav>

			<!-- Page header -->
			<header class="border-b border-border pb-6">
				<h1 class="font-heading text-3xl font-semibold tracking-tight">
					{doc.title}
				</h1>
				{#if doc.description}
					<p class="mt-3 text-base leading-relaxed text-balance text-muted-foreground">
						{doc.description}
					</p>
				{/if}
			</header>

			<!-- Content -->
			<div class="mt-8">
				<Markdown />
			</div>

			<!-- Prev / next pager -->
			{#if neighbors.previous || neighbors.next}
				<nav class="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Pagination">
					{#if neighbors.previous}
						<a
							href={neighbors.previous.href}
							class="group flex flex-col gap-1 docs-surface p-4 transition-colors hover:bg-surface"
						>
							<span class="flex items-center gap-1 text-xs text-muted-foreground">
								<ChevronLeft class="size-3.5" /> Previous
							</span>
							<span class="font-medium text-foreground transition-colors group-hover:text-primary">
								{neighbors.previous.title}
							</span>
						</a>
					{:else}
						<div></div>
					{/if}
					{#if neighbors.next}
						<a
							href={neighbors.next.href}
							class="group flex flex-col gap-1 docs-surface p-4 text-right transition-colors hover:bg-surface sm:items-end"
						>
							<span class="flex items-center gap-1 text-xs text-muted-foreground">
								Next <ChevronRight class="size-3.5" />
							</span>
							<span class="font-medium text-foreground transition-colors group-hover:text-primary">
								{neighbors.next.title}
							</span>
						</a>
					{/if}
				</nav>
			{/if}

			<!-- Edit on GitHub -->
			<footer
				class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
			>
				<span class="text-sm text-muted-foreground">Was this page helpful?</span>
				<a
					href={`https://github.com/getarcaneapp/website/edit/main/content/${doc.path}.md`}
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

		{#if toc.current.length > 0}
			<aside class="hidden w-56 shrink-0 xl:block">
				<div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
					<p class="mb-3 text-sm font-medium text-foreground">On this page</p>
					<div class="border-l border-border pl-4">
						<Toc.Root toc={toc.current} />
					</div>
				</div>
			</aside>
		{/if}
	</div>
</div>
