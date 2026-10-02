<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger
	bind:ref
	data-slot="dialog-trigger"
	class={cn(
		'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden',
		className
	)}
	{...restProps}
/>
