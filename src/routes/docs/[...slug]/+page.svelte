<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import * as Toc from '$lib/components/ui/toc/index.js';
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
	<div use:attachToc class="mx-auto flex w-full max-w-400 min-w-0 flex-1 gap-10 px-6 py-8 md:px-8 lg:px-10">
		<article class="min-w-0 flex-1">
			<header
				class="border-border/70 bg-background/80 relative overflow-hidden rounded-3xl border p-6 shadow-[0_18px_50px_-40px_oklch(0_0_0/0.35)] backdrop-blur md:p-8"
			>
				<div
					class="text-muted-foreground flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold tracking-[0.24em] uppercase"
				>
					<span class="text-muted-foreground">Docs</span>
					{#each breadcrumbs as crumb, i (crumb)}
						<span class="text-muted-foreground/60">/</span>
						<span class={i === breadcrumbs.length - 1 ? 'text-foreground' : 'text-muted-foreground'}>
							{crumb}
						</span>
					{/each}
				</div>
				<h1 class="font-heading mt-4 scroll-m-20 text-4xl font-semibold tracking-tight md:text-5xl">
					{doc.title}
				</h1>
				{#if doc.description}
					<p class="text-muted-foreground mt-3 text-lg leading-relaxed text-balance">
						{doc.description}
					</p>
				{/if}
			</header>

			<div class="border-border/70 bg-card/80 mt-8 w-full rounded-3xl border p-6 shadow-sm backdrop-blur md:p-8">
				<Markdown />
			</div>

			<footer class="border-border/70 bg-background/70 mt-8 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<span class="text-muted-foreground text-sm">Help improve this page</span>
					<a
						href={`https://github.com/getarcaneapp/website/edit/main/content/${doc.path}.md`}
						target="_blank"
						rel="noopener noreferrer"
						class="border-border/70 bg-background/80 text-foreground/80 hover:border-primary/40 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
					>
						Edit this page on GitHub
						<ExternalLink class="size-4" />
					</a>
				</div>
			</footer>
		</article>

		{#if toc.current.length > 0}
			<aside class="hidden w-60 shrink-0 xl:block">
				<div class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6">
					<div class="border-border/70 bg-background/80 rounded-2xl border p-5 shadow-sm backdrop-blur">
						<p class="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.25em] uppercase">On this page</p>
						<Toc.Root toc={toc.current} />
					</div>
				</div>
			</aside>
		{/if}
	</div>
</div>
