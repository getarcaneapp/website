<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		...restProps
	}: TabsPrimitive.ListProps & { variant?: 'default' | 'arcane' } = $props();
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	class={cn(
		variant === 'arcane'
			? 'inline-flex max-w-full flex-wrap items-center justify-start gap-1 rounded-lg border border-border/60 bg-muted/40 p-1 text-muted-foreground'
			: 'inline-flex h-9 w-fit items-center justify-center rounded-xl bg-muted p-[3px] text-muted-foreground',
		className
	)}
	{...restProps}
/>
