<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		...restProps
	}: CommandPrimitive.ItemProps & {
		/** `result` is a taller, top-aligned row for search hits with an excerpt; `nested` indents it. */
		variant?: 'default' | 'result' | 'nested';
	} = $props();
</script>

<CommandPrimitive.Item
	bind:ref
	data-slot="command-item"
	class={cn(
		"relative flex h-10 cursor-default items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-medium outline-hidden transition-colors select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary/10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
		variant !== 'default' && 'h-auto items-start gap-3 py-2.5 [&_svg]:mt-0.5',
		variant === 'nested' && 'ml-5 font-normal',
		className
	)}
	{...restProps}
/>
