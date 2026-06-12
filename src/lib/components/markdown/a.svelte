<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let { class: className, children, href, ...restProps }: HTMLAnchorAttributes = $props();

	const internal = $derived(href?.startsWith('/') || href?.startsWith('#'));
	const rel = $derived(!internal ? 'noopener noreferrer' : undefined);
	const target = $derived(!internal ? '_blank' : undefined);
</script>

<a
	{href}
	{target}
	{rel}
	class={cn(
		'font-medium underline decoration-primary/40 underline-offset-[0.2em] hover:decoration-primary',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</a>
