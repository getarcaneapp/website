<script lang="ts">
	import { trackEvent } from '#lib/analytics.js';
	import { UseClipboard } from '#lib/hooks/use-clipboard.svelte.js';
	import { CheckIcon, CopyIcon } from '#lib/icons/index.js';

	// Rendered by the build-time highlighter (src/lib/markdown/highlighter.ts) for each fenced block.
	let { code, lang }: { code: string; lang?: string } = $props();

	const clipboard = new UseClipboard({ delay: 1500 });

	async function copy() {
		if ((await clipboard.copy(code)) === 'success') {
			trackEvent('Docs Code Copied', { language: lang || 'plain_text' });
		}
	}
</script>

<button
	type="button"
	aria-label="Copy code"
	onclick={copy}
	class="absolute top-1.5 right-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-sm text-muted-foreground opacity-60 transition-colors group-hover/code:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
>
	{#if clipboard.status === 'success'}
		<CheckIcon class="size-4" />
	{:else}
		<CopyIcon class="size-4" />
	{/if}
</button>
