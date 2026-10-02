<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import {
		SIDEBAR_COOKIE_MAX_AGE,
		SIDEBAR_COOKIE_NAME,
		SIDEBAR_WIDTH,
		SIDEBAR_WIDTH_ICON
	} from './constants.js';
	import { setSidebar } from './context.svelte.js';

	let {
		ref = $bindable(null),
		open = $bindable(true),
		onOpenChange = () => {},
		class: className,
		style,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		/** `docs` lays the sidebar and page out as a two-column grid below the site header. */
		variant?: 'default' | 'docs';
	} = $props();

	const sidebar = setSidebar({
		open: () => open,
		setOpen: (value: boolean) => {
			open = value;
			onOpenChange(value);

			// This sets the cookie to keep the sidebar state.
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		}
	});
</script>

<svelte:window onkeydown={sidebar.handleShortcutKeydown} />

<Tooltip.Provider delayDuration={0}>
	<div
		data-slot="sidebar-wrapper"
		style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style}"
		class={cn(
			'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
			variant === 'docs' &&
				'min-h-[calc(100vh-var(--header-height))] gap-6 px-0 [--sidebar-width:240px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:gap-8 lg:[--sidebar-width:260px] lg:[--top-spacing:calc(var(--spacing)*4)] 2xl:[--sidebar-width:280px] 3xl:fixed:container 3xl:fixed:px-3',
			className
		)}
		bind:this={ref}
		{...restProps}
	>
		{@render children?.()}
	</div>
</Tooltip.Provider>
