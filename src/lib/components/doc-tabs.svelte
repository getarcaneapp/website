<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { tick, type Snippet } from 'svelte';
	import * as Tabs from '#lib/components/ui/tabs/index.js';

	let {
		tabs,
		label,
		children
	}: { tabs: { value: string; label: string }[]; label: string; children: Snippet } = $props();

	let active = $state<string>();
	let root: HTMLDivElement | null = $state(null);

	const value = $derived(active ?? tabs[0]?.value ?? '');

	async function revealLinkedSection() {
		if (!window.location.hash) return;

		let id: string;
		try {
			id = decodeURIComponent(window.location.hash.slice(1));
		} catch {
			return;
		}

		const target = document.getElementById(id);
		if (!target || !root?.contains(target)) return;

		const panel = target.closest<HTMLElement>('[data-tab]');
		if (!panel?.dataset.tab) return;

		active = panel.dataset.tab;
		await tick();
		target.scrollIntoView();
	}

	afterNavigate(revealLinkedSection);
</script>

<svelte:window onhashchange={revealLinkedSection} />

<Tabs.Root
	bind:ref={root}
	bind:value={() => value, (v) => (active = v)}
	variant="arcane"
	class="mt-6 min-w-0"
>
	<div class="overflow-x-auto">
		<Tabs.List variant="arcane" aria-label={label}>
			{#each tabs as tab (tab.value)}
				<Tabs.Trigger variant="arcane" value={tab.value}>{tab.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</div>
	{@render children()}
</Tabs.Root>
