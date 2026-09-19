<script lang="ts">
	import AlertCircle from 'virtual:icons/lucide/alert-circle';
	import AlertTriangle from 'virtual:icons/lucide/alert-triangle';
	import Info from 'virtual:icons/lucide/info';
	import Lightbulb from 'virtual:icons/lucide/lightbulb';
	import OctagonAlert from 'virtual:icons/lucide/octagon-alert';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();

	// Extract text content to detect callout type
	let textContent = $state('');

	function getCalloutType(content: string): keyof typeof calloutConfig | null {
		const lower = content.toLowerCase();
		if (lower.includes('[!note]')) return 'note';
		if (lower.includes('[!tip]')) return 'tip';
		if (lower.includes('[!important]')) return 'important';
		if (lower.includes('[!warning]')) return 'warning';
		if (lower.includes('[!caution]')) return 'caution';
		return null;
	}

	const calloutConfig = {
		note: {
			icon: Info,
			label: 'Note',
			borderClass: 'border-l-[#0969da] dark:border-l-[#4493f8]',
			titleClass: 'text-[#0969da] dark:text-[#4493f8]'
		},
		tip: {
			icon: Lightbulb,
			label: 'Tip',
			borderClass: 'border-l-[#1a7f37] dark:border-l-[#3fb950]',
			titleClass: 'text-[#1a7f37] dark:text-[#3fb950]'
		},
		important: {
			icon: AlertCircle,
			label: 'Important',
			borderClass: 'border-l-[#8250df] dark:border-l-[#ab7df8]',
			titleClass: 'text-[#8250df] dark:text-[#ab7df8]'
		},
		warning: {
			icon: AlertTriangle,
			label: 'Warning',
			borderClass: 'border-l-[#9a6700] dark:border-l-[#d29922]',
			titleClass: 'text-[#9a6700] dark:text-[#d29922]'
		},
		caution: {
			icon: OctagonAlert,
			label: 'Caution',
			borderClass: 'border-l-[#cf222e] dark:border-l-[#f85149]',
			titleClass: 'text-[#cf222e] dark:text-[#f85149]'
		}
	};

	let type = $state<keyof typeof calloutConfig | null>(null);
	let config = $state<(typeof calloutConfig)[keyof typeof calloutConfig] | null>(null);

	function cleanContent(element: HTMLElement) {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

		let node;
		while ((node = walker.nextNode())) {
			if (node.textContent) {
				node.textContent = node.textContent.replace(
					/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i,
					''
				);
			}
		}
	}

	function handleMount(element: HTMLElement) {
		textContent = element.textContent || '';
		type = getCalloutType(textContent);
		config = type ? calloutConfig[type] : null;

		if (type) {
			cleanContent(element);
		}
	}
</script>

{#if type && config}
	{@const Icon = config.icon}
	<div
		class={cn(
			'mt-6 border-l-4 py-2 pr-2 pl-4 text-foreground not-italic',
			config.borderClass,
			className
		)}
		{...restProps}
		use:handleMount
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
		use:handleMount
	>
		{@render children?.()}
	</blockquote>
{/if}

<!-- Usage Examples -->

<!-- 
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action. 
 -->
