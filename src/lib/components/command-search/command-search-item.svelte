<script lang="ts">
import type { ComponentProps } from 'svelte';
import * as Command from '$lib/components/ui/command/index.js';
import { useObserver } from '$lib/hooks/observer.svelte.js';
import { cn } from '$lib/utils.js';

let {
	children,
	ref = $bindable(null),
	class: className,
	onHighlight,
	...restProps
}: ComponentProps<typeof Command.Item> & {
	onHighlight?: () => void;
	'data-selected'?: string;
	'aria-selected'?: boolean;
} = $props();

useObserver(
	() => ref,
	(mutations) => {
		for (const mutation of mutations) {
			if (
				mutation.type === 'attributes' &&
				mutation.attributeName === 'aria-selected' &&
				ref?.getAttribute('aria-selected') === 'true'
			) {
				onHighlight?.();
			}
		}
	},
	{
		attributes: true,
	},
);
</script>

<Command.Item
	bind:ref
	class={cn(
		'data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary/10 h-10 rounded-xl border border-transparent !px-3 text-sm font-medium transition-colors',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Command.Item>
