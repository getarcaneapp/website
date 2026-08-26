<script lang="ts">
	import ArrowLeft from 'virtual:icons/lucide/arrow-left';
	import ChevronLeft from 'virtual:icons/lucide/chevron-left';
	import ChevronRight from 'virtual:icons/lucide/chevron-right';
	import { findPostNeighbors } from '#lib/blog.js';
	import BlogKindBadge from '#lib/components/blog-kind-badge.svelte';
	import RssButton from '#lib/components/rss-button.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	const Markdown = $derived(data.component);
	const post = $derived(data.metadata);
	const neighbors = $derived(findPostNeighbors(post.slug));
</script>

<svelte:head>
	<title>{post.title} — Arcane</title>
	<meta name="description" content={post.description} />
	<link rel="alternate" type="application/rss+xml" title="Arcane Blog" href="/rss.xml" />
</svelte:head>

<div class="relative isolate">
	<div class="h-px w-full bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
	<div class="container mx-auto flex min-w-0 flex-1 px-4 py-8 lg:py-10">
		<article class="mx-auto w-full max-w-3xl min-w-0">
			<div class="mb-8 flex items-center justify-between gap-4">
				<a
					href="/blog"
					class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="size-3.5" />
					Blog
				</a>
				<RssButton />
			</div>

			<header class="border-b border-border pb-6">
				<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
					<BlogKindBadge kind={post.kind} />
					<time datetime={post.date} class="text-sm text-muted-foreground">
						{post.dateLabel}
					</time>
				</div>
				<h1 class="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground">
					{post.title}
				</h1>
				{#if post.description}
					<p class="mt-3 text-base leading-relaxed text-muted-foreground">
						{post.description}
					</p>
				{/if}
			</header>

			<div class="mt-8">
				<Markdown />
			</div>

			{#if neighbors.previous || neighbors.next}
				<nav class="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Pagination">
					{#if neighbors.previous}
						<a
							href={neighbors.previous.href}
							class="group flex flex-col gap-1 docs-surface p-4 transition-colors hover:bg-surface"
						>
							<span class="flex items-center gap-1 text-xs text-muted-foreground">
								<ChevronLeft class="size-3.5" /> Older
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
								Newer <ChevronRight class="size-3.5" />
							</span>
							<span class="font-medium text-foreground transition-colors group-hover:text-primary">
								{neighbors.next.title}
							</span>
						</a>
					{/if}
				</nav>
			{/if}
		</article>
	</div>
</div>
