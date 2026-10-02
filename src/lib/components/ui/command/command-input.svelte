<script lang="ts">
	import { SearchIcon } from '#lib/icons/index.js';
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(''),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div
	class="flex h-10 items-center gap-2 rounded-md border border-border bg-background px-2"
	data-slot="command-input-wrapper"
>
	<SearchIcon class="size-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		data-slot="command-input"
		class={cn(
			'flex h-10 w-full rounded-md bg-transparent py-0 text-sm outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
