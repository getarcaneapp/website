<script lang="ts">
	import BlogKindBadge from '#lib/components/blog-kind-badge.svelte';
	import ContentWrapper from '#lib/components/content-wrapper.svelte';
	import RssButton from '#lib/components/rss-button.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Blog — Arcane</title>
	<meta
		name="description"
		content="A home for deprecations, migrations, and other notable changes."
	/>
	<link rel="alternate" type="application/rss+xml" title="Arcane Blog" href="/rss.xml" />
</svelte:head>

<ContentWrapper>
	<section class="relative pt-10 pb-12 md:pt-14">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div class="max-w-2xl">
				<h1 class="font-heading text-3xl font-semibold tracking-tight md:text-4xl">Blog</h1>
				<p class="mt-3 text-base leading-relaxed text-muted-foreground">
					A home for deprecations, migrations, and other notable changes.
				</p>
			</div>
			<RssButton />
		</div>
	</section>

	<section class="relative pb-20">
		{#if data.posts.length === 0}
			<p class="text-sm text-muted-foreground">No posts yet.</p>
		{:else}
			<ol class="divide-y divide-border border-y border-border">
				{#each data.posts as post (post.slug)}
					<li>
						<a
							href={post.href}
							class="group grid gap-3 py-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
						>
							<time datetime={post.date} class="pt-1 text-sm text-muted-foreground">
								{post.dateLabel}
							</time>
							<div class="min-w-0">
								<BlogKindBadge kind={post.kind} />
								<h2
									class="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary"
								>
									{post.title}
								</h2>
								<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
									{post.description}
								</p>
							</div>
						</a>
					</li>
				{/each}
			</ol>
		{/if}
	</section>
</ContentWrapper>
