<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import { box } from 'svelte-toolbelt';
	import { cn } from '#lib/utils.js';
	import { useCode } from './code-state.svelte.js';
	import { codeVariants, type CodeRootProps } from './types.js';

	let {
		ref = $bindable(null),
		variant = 'default',
		lang = 'typescript',
		code,
		class: className,
		hideLines = false,
		highlight = [],
		children,
		...rest
	}: CodeRootProps = $props();

	const codeState = useCode({
		code: box.with(() => code),
		hideLines: box.with(() => hideLines),
		highlight: box.with(() => highlight),
		lang: box.with(() => lang)
	});
</script>

<div {...rest} bind:this={ref} data-slot="code" class={cn(codeVariants({ variant }), className)}>
	{@html codeState.highlighted}
	{@render children?.()}
</div>
