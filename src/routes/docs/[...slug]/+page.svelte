<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import * as Toc from '$lib/components/ui/toc/index.js';
	import { UseToc } from '$lib/hooks/use-toc.svelte.js';

	let { data } = $props();
	const Markdown = $derived(data.component);
	const doc = $derived(data.metadata);

	const githubEditUrl = $derived(`https://github.com/getarcaneapp/website/edit/main/content/${doc.path}.md`);

	const toc = new UseToc();
</script>

<svelte:head>
	<title>{doc.title}</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<div class="flex min-w-0 flex-1">
	<div bind:this={toc.ref} class="flex min-w-0 flex-1 flex-col">
		<div class="mx-auto flex w-full max-w-5xl min-w-0 flex-1 flex-col gap-8 px-6 py-6 md:px-8 lg:py-8">
			<div class="flex flex-col gap-2">
				<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight">
					{doc.title}
				</h1>
				{#if doc.description}
					<p class="text-muted-foreground text-lg text-balance">
						{doc.description}
					</p>
				{/if}
			</div>

			<div class="w-full flex-1">
				<Markdown />
			</div>

			<div class="mt-8 border-t pt-6">
				<div class="flex items-center justify-between">
					<div class="text-muted-foreground text-sm">Help improve this page</div>
					<a
						href={githubEditUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
					>
						Edit this page on GitHub
						<ExternalLink class="text-muted-foreground mb-1 size-4 align-text-bottom" />
					</a>
				</div>
			</div>
		</div>
	</div>

	{#if toc.current.length > 0}
		<aside class="hidden w-56 shrink-0 xl:block">
			<div class="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-4">
				<p class="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">On this page</p>
				<Toc.Root toc={toc.current} />
			</div>
		</aside>
	{/if}
</div>
