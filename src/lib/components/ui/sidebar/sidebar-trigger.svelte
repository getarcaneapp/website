<script lang="ts">
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { useSidebar } from './context.svelte.js';

	type Props = Omit<HTMLButtonAttributes, 'type'> & {
		ref?: HTMLButtonElement | null;
		class?: string;
		onclick?: (e: MouseEvent) => void;
	};

	let { ref = $bindable(null), class: className, onclick, ...restProps }: Props = $props();

	const sidebar = useSidebar();
</script>

<Button
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	variant="ghost"
	size="icon"
	class={cn('size-7', className)}
	type="button"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	<PanelLeftIcon />
	<span class="sr-only">Toggle Sidebar</span>
</Button>
