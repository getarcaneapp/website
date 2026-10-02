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
		size = 'default',
		...restProps
	}: TabsPrimitive.TriggerProps & {
		variant?: 'default' | 'arcane' | 'steps';
		size?: 'default' | 'sm';
	} = $props();
</script>

<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	class={cn(
		variant === 'steps' &&
			'group inline-flex h-auto flex-none items-center justify-start gap-2 border-b-2 border-transparent pb-1.5 text-left text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 data-[state=active]:border-primary/70 data-[state=active]:text-foreground',
		variant === 'arcane' &&
			'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:ring-1 data-[state=active]:ring-primary/30 dark:data-[state=active]:text-[color-mix(in_oklch,var(--primary)_55%,white)]',
		variant === 'default' &&
			"inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		size === 'sm' && 'px-3 text-xs',
		className
	)}
	{...restProps}
/>
