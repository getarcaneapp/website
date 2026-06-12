<script lang="ts">
	import AlertCircle from 'virtual:icons/lucide/alert-circle';
	import AlertTriangle from 'virtual:icons/lucide/alert-triangle';
	import Info from 'virtual:icons/lucide/info';
	import Lightbulb from 'virtual:icons/lucide/lightbulb';
	import OctagonAlert from 'virtual:icons/lucide/octagon-alert';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

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
			iconClass: 'text-blue-600 dark:text-blue-400'
		},
		tip: {
			icon: Lightbulb,
			label: 'Tip',
			iconClass: 'text-green-600 dark:text-green-400'
		},
		important: {
			icon: AlertCircle,
			label: 'Important',
			iconClass: 'text-primary'
		},
		warning: {
			icon: AlertTriangle,
			label: 'Warning',
			iconClass: 'text-amber-600 dark:text-amber-400'
		},
		caution: {
			icon: OctagonAlert,
			label: 'Caution',
			iconClass: 'text-red-600 dark:text-red-400'
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
		class={cn('mt-6 rounded-md border border-border bg-surface p-4 not-italic', className)}
		{...restProps}
		use:handleMount
	>
		<div class="flex min-w-0 items-start gap-3">
			<Icon class={cn('mt-0.5 size-4 shrink-0', config.iconClass)} />
			<div class="min-w-0 flex-1">
				<div class="mb-1 text-sm font-medium text-foreground">
					{config.label}
				</div>
				<div
					class="min-w-0 text-sm [&_.snippet]:w-full [&_.snippet]:max-w-full [&>p]:mb-2 last:[&>p]:mb-0"
				>
					{@render children?.()}
				</div>
			</div>
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
