<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className,
		variant = 'default',
		...restProps
	}: TabsPrimitive.RootProps & { variant?: 'default' | 'arcane' } = $props();
</script>

<TabsPrimitive.Root
	bind:ref
	bind:value
	data-slot="tabs"
	class={cn('flex flex-col gap-2', variant === 'arcane' && 'gap-6', className)}
	{...restProps}
/>
