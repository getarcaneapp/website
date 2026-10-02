<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.ListProps = $props();
</script>

<CommandPrimitive.List
	bind:ref
	data-slot="command-list"
	class={cn(
		'no-scrollbar max-h-[300px] min-h-28 scroll-pt-2 scroll-pb-1.5 overflow-x-hidden overflow-y-auto',
		className
	)}
	{...restProps}
/>
