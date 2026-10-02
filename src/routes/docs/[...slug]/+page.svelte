<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon, EditIcon, ExternalLinkIcon } from '#lib/icons/index.js';
	import { page } from '$app/state';
	import * as Toc from '#lib/components/ui/toc/index.js';
	import { findNeighbors } from '#lib/config/docs.js';
	import { UseToc } from '#lib/hooks/use-toc.svelte.js';

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
</script>

<svelte:head>
	<title>{doc.title}</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<div class="flex min-w-0 flex-1">
	<div
		{@attach toc.attach}
		class="grid w-full min-w-0 flex-1 grid-cols-docs justify-center py-8 lg:pl-8 xl:grid-cols-docs-toc xl:justify-normal"
	>
		<article class="w-full min-w-0 xl:col-start-2">
			<nav
				class="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
				aria-label="Breadcrumb"
			>
				<a href="/docs" class="transition-colors hover:text-foreground">Docs</a>
				{#each breadcrumbs as crumb, i (crumb)}
					<ArrowRightIcon class="size-3 text-muted-foreground/50" />
					<span class={i === breadcrumbs.length - 1 ? 'text-foreground' : ''}>{crumb}</span>
				{/each}
			</nav>

			<div data-pagefind-body data-pagefind-meta="section:{breadcrumbs[0] ?? 'Docs'}">
				<header class="border-b border-border pb-6">
					<h1 class="font-heading text-3xl font-semibold tracking-tight" data-pagefind-meta="title">
						{doc.title}
					</h1>
					{#if doc.description}
						<p class="mt-3 text-base leading-relaxed text-balance text-muted-foreground">
							{doc.description}
						</p>
					{/if}
				</header>

				<div class="mt-8">
					<Markdown />
				</div>
			</div>

			{#if neighbors.previous || neighbors.next}
				<nav class="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Pagination">
					{#if neighbors.previous}
						<a
							href={neighbors.previous.href}
							class="group flex flex-col gap-1 docs-surface p-4 transition-colors hover:bg-surface"
						>
							<span class="flex items-center gap-1 text-xs text-muted-foreground">
								<ArrowLeftIcon class="size-3.5" /> Previous
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
								Next <ArrowRightIcon class="size-3.5" />
							</span>
							<span class="font-medium text-foreground transition-colors group-hover:text-primary">
								{neighbors.next.title}
							</span>
						</a>
					{/if}
				</nav>
			{/if}

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
					<EditIcon class="size-3.5" />
					Edit this page on GitHub
					<ExternalLinkIcon class="size-3.5" />
				</a>
			</footer>
		</article>

		{#if toc.current.length > 0}
			<aside class="hidden w-76 pl-12 xl:col-start-3 xl:block xl:justify-self-end">
				<div class="sticky top-docs-toc max-h-docs-toc overflow-y-auto">
					<p class="mb-3 text-sm font-medium text-foreground">On this page</p>
					<div class="border-l border-border pl-4">
						<Toc.Root toc={toc.current} activeIndex={toc.activeIndex} />
					</div>
				</div>
			</aside>
		{/if}
	</div>
</div>
