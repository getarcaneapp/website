<script lang="ts">
import { Switch as SwitchPrimitive } from 'bits-ui';
import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

let {
	ref = $bindable(null),
	checked = $bindable(false),
	class: className,
	...restProps
}: WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();
</script>

<!-- The ::after layer widens the hit area to 44px on touch screens and 24px from sm up without changing the visual size. -->
<SwitchPrimitive.Root
	bind:ref
	bind:checked
	data-slot="switch"
	class={cn(
		"peer relative inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border shadow-xs transition-all outline-none after:absolute after:-inset-x-1.5 after:-inset-y-[13px] after:content-[''] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-transparent data-[state=checked]:bg-primary data-[state=unchecked]:border-input-border data-[state=unchecked]:bg-input sm:after:inset-x-0 sm:after:-inset-y-[3px]",
		className
	)}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		data-slot="switch-thumb"
		class="pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=checked]:bg-background data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-muted-foreground dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
	/>
</SwitchPrimitive.Root>
