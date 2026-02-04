<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		id,
		title,
		description,
		defaultExpanded = false,
		bulkActionKey = 0,
		bulkActionValue = null,
		class: className,
		contentNodes,
		badge,
		children
	}: {
		id: string;
		title: string;
		description?: string;
		defaultExpanded?: boolean;
		bulkActionKey?: number;
		bulkActionValue?: boolean | null;
		class?: string;
		contentNodes?: Node[];
		badge?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	} = $props();

	let expanded = $state(false);
	let initialized = $state(false);
	let bodyRef = $state<HTMLDivElement>();

	function loadExpandedState() {
		const state = JSON.parse(localStorage.getItem('collapsible-cards-expanded') || '{}');
		expanded = state[id] || false;
	}

	function saveExpandedState() {
		const state = JSON.parse(localStorage.getItem('collapsible-cards-expanded') || '{}');
		state[id] = expanded;
		localStorage.setItem('collapsible-cards-expanded', JSON.stringify(state));
	}

	function toggleExpanded() {
		expanded = !expanded;
		saveExpandedState();
	}

	function onHeaderClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const interactive = target.closest('button, a, [onclick], [role="button"]');
		if (interactive && interactive !== e.currentTarget) return;
		toggleExpanded();
	}

	function onHeaderKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleExpanded();
		}
	}

	onMount(() => {
		if (!initialized) {
			expanded = defaultExpanded;
			if (defaultExpanded) {
				saveExpandedState();
			}
			loadExpandedState();
			initialized = true;
		}
	});

	$effect(() => {
		if (!initialized || bulkActionKey === undefined) return;
		if (bulkActionValue === null || bulkActionValue === undefined) return;
		expanded = bulkActionValue;
		saveExpandedState();
	});

	$effect(() => {
		if (!expanded) return;
		if (!bodyRef || !contentNodes?.length) return;
		for (const node of contentNodes) {
			if (node.parentNode !== bodyRef) {
				bodyRef.appendChild(node);
			}
		}
	});
</script>

<Card.Root {id} class={cn('changelog-entry', className)}>
	<Card.Header
		class="changelog-entry__header cursor-pointer select-none"
		role="button"
		tabindex={0}
		aria-expanded={expanded}
		onclick={onHeaderClick}
		onkeydown={onHeaderKeydown}
	>
		<div class="changelog-entry__title">
			<div class="flex flex-wrap items-center gap-2">
				<Card.Title>
					<h2>{title}</h2>
				</Card.Title>
				{#if badge}
					{@render badge()}
				{/if}
			</div>
			{#if description}
				<Card.Description class="changelog-entry__date">{description}</Card.Description>
			{/if}
		</div>
		<Card.Action class="ml-auto">
			<Button
				variant="ghost"
				size="icon"
				class={cn(
					'changelog-entry__toggle',
					expanded && 'changelog-entry__toggle--expanded'
				)}
				onclick={() => toggleExpanded()}
				aria-label={expanded ? 'Collapse section' : 'Expand section'}
			>
				<ChevronDown class="changelog-entry__chevron" />
			</Button>
		</Card.Action>
	</Card.Header>
	{#if expanded}
		<div transition:slide={{ duration: 200 }}>
			<Card.Content class="changelog-entry__body">
				{#if contentNodes?.length}
					<div bind:this={bodyRef} class="changelog-entry__content"></div>
				{:else}
					{@render children?.()}
				{/if}
			</Card.Content>
		</div>
	{/if}
</Card.Root>
