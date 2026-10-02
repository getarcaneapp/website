<script lang="ts">
	import {
		AlertIcon,
		AlertTriangleIcon,
		DangerIcon,
		InfoIcon,
		LightbulbIcon
	} from '#lib/icons/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	const calloutConfig = {
		note: {
			icon: InfoIcon,
			label: 'Note',
			borderClass: 'border-l-[#0969da] dark:border-l-[#4493f8]',
			titleClass: 'text-[#0969da] dark:text-[#4493f8]'
		},
		tip: {
			icon: LightbulbIcon,
			label: 'Tip',
			borderClass: 'border-l-[#1a7f37] dark:border-l-[#3fb950]',
			titleClass: 'text-[#1a7f37] dark:text-[#3fb950]'
		},
		important: {
			icon: AlertIcon,
			label: 'Important',
			borderClass: 'border-l-[#8250df] dark:border-l-[#ab7df8]',
			titleClass: 'text-[#8250df] dark:text-[#ab7df8]'
		},
		warning: {
			icon: AlertTriangleIcon,
			label: 'Warning',
			borderClass: 'border-l-[#9a6700] dark:border-l-[#d29922]',
			titleClass: 'text-[#9a6700] dark:text-[#d29922]'
		},
		caution: {
			icon: DangerIcon,
			label: 'Caution',
			borderClass: 'border-l-[#cf222e] dark:border-l-[#f85149]',
			titleClass: 'text-[#cf222e] dark:text-[#f85149]'
		}
	};

	type CalloutType = keyof typeof calloutConfig;

	// `data-callout` is set at build time by the remarkCallouts plugin (src/lib/markdown/callouts.js).
	let {
		class: className,
		children,
		'data-callout': callout,
		...restProps
	}: HTMLAttributes<HTMLElement> & { 'data-callout'?: string } = $props();

	const config = $derived(
		callout && callout in calloutConfig ? calloutConfig[callout as CalloutType] : null
	);
</script>

{#if config}
	{@const Icon = config.icon}
	<div
		class={cn(
			'mt-6 border-l-4 py-2 pr-2 pl-4 text-foreground not-italic',
			config.borderClass,
			className
		)}
		{...restProps}
	>
		<div class={cn('mb-2 flex items-center gap-2 leading-none font-medium', config.titleClass)}>
			<Icon class="size-4 shrink-0" />
			<span>{config.label}</span>
		</div>
		<div class="min-w-0 [&_.snippet]:w-full [&_.snippet]:max-w-full [&>p]:mb-3 last:[&>p]:mb-0">
			{@render children?.()}
		</div>
	</div>
{:else}
	<blockquote
		class={cn('mt-6 border-l-2 border-border pl-4 text-muted-foreground italic', className)}
		{...restProps}
	>
		{@render children?.()}
	</blockquote>
{/if}
