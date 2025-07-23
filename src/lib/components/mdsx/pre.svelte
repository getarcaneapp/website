<script lang="ts">
	import { onMount } from 'svelte';
	import * as Code from '$lib/components/ui/code/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type SupportedLang = 'bash' | 'diff' | 'javascript' | 'json' | 'svelte' | 'typescript' | 'yaml';

	let {
		class: className,
		children,
		lang = 'bash', // Default to a supported language
		...restProps
	}: HTMLAttributes<HTMLPreElement> & {
		lang?: SupportedLang;
	} = $props();

	let preNode = $state<HTMLPreElement>();
	let code = $state('');

	onMount(() => {
		if (preNode) {
			code = preNode.innerText.trim().replaceAll('  ', ' ');
		}
	});

	// Filter out HTML attributes that Code.Root doesn't accept
	const { accesskey, autocapitalize, autofocus, ...codeProps } = restProps;
</script>

<!-- Hidden pre element to extract text content -->
<pre bind:this={preNode} style="display: none;">{@render children?.()}</pre>

{#if code}
	<Code.Root {lang} class={cn('m-0 w-full', className)} {code}>
		<Code.CopyButton size="sm" variant="ghost" />
	</Code.Root>
{:else}
	<!-- Fallback while code is loading -->
	<pre class={cn('no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none', className)} {...restProps}>
		{@render children?.()}
	</pre>
{/if}
