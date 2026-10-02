<script lang="ts">
	import { CloseIcon } from '#lib/icons/index.js';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
	import Overlay from './dialog-overlay.svelte';

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		showCloseButton = true,
		variant = 'default',
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
		portalProps?: DialogPrimitive.PortalProps;
		children: Snippet;
		showCloseButton?: boolean;
		/** `command` is a compact palette, `wide` a tall code viewer, `lightbox` a frameless full-screen view. */
		variant?: 'default' | 'command' | 'wide' | 'lightbox';
	} = $props();
</script>

<DialogPrimitive.Portal {...portalProps}>
	<Overlay />
	<DialogPrimitive.Content
		bind:ref
		data-slot="dialog-content"
		class={cn(
			'fixed top-[50%] left-[50%] z-[80] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
			variant === 'command' && 'border-border bg-popover p-2',
			variant === 'wide' &&
				'flex h-[90vh] max-h-[90vh] w-[95vw] max-w-full flex-col sm:h-auto sm:max-h-[80vh] sm:max-w-[600px] lg:min-h-[70vh] lg:max-w-[1500px]',
			variant === 'lightbox' &&
				'top-0 left-0 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center border-0 bg-transparent p-2 shadow-none sm:max-w-none',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		{#if showCloseButton}
			<DialogPrimitive.Close
				class="absolute end-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
			>
				<CloseIcon />
				<span class="sr-only">Close</span>
			</DialogPrimitive.Close>
		{/if}
	</DialogPrimitive.Content>
</DialogPrimitive.Portal>
