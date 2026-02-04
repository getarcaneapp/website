<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	const Markdown = $derived(data.component);
	const doc = $derived(data.metadata);

</script>

<svelte:head>
	<title>{doc.title}</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<div class="docs-theme relative isolate">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
	<div class="container mx-auto flex min-w-0 flex-1 px-4 py-6 lg:py-8">
		<div class="mx-auto w-full max-w-[1600px]">
			<header
				class="relative overflow-hidden rounded-3xl border border-border/70 bg-background/80 p-6 shadow-[0_18px_50px_-40px_oklch(0_0_0/0.35)] backdrop-blur md:p-8"
			>
				<h1 class="font-heading scroll-m-20 text-4xl font-semibold tracking-tight">
					{doc.title}
				</h1>
				{#if doc.description}
					<p class="text-muted-foreground mt-3 text-lg leading-relaxed text-balance">
						{doc.description}
					</p>
				{/if}
			</header>

			<div class="mt-8 w-full rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur md:p-8">
				<Markdown />
			</div>

			<footer class="mt-8 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="text-muted-foreground text-sm">Help improve this page</div>
					<a
						href={`https://github.com/getarcaneapp/website/edit/main/content/${doc.path}.md`}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-foreground"
					>
						Edit this page on GitHub
						<ExternalLink class="size-4" />
					</a>
				</div>
			</footer>
		</div>
	</div>
</div>
