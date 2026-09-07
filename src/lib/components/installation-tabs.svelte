<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { tick, type Snippet } from 'svelte';
	import * as Tabs from '#lib/components/ui/tabs/index.js';

	let { children }: { children: Snippet } = $props();
	let method = $state('docker');
	let root: HTMLDivElement | null = $state(null);

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

		const panel = target.closest<HTMLElement>('[data-install-method]');
		if (!panel?.dataset.installMethod) return;

		method = panel.dataset.installMethod;
		await tick();
		target.scrollIntoView();
	}

	afterNavigate(revealLinkedSection);
</script>

<svelte:window onhashchange={revealLinkedSection} />

<Tabs.Root bind:ref={root} bind:value={method} class="mt-6 min-w-0 gap-6">
	<div class="overflow-x-auto">
		<Tabs.List variant="arcane" aria-label="Installation method">
			<Tabs.Trigger variant="arcane" value="docker">Docker</Tabs.Trigger>
			<Tabs.Trigger variant="arcane" value="script">Convenience script</Tabs.Trigger>
		</Tabs.List>
	</div>
	{@render children()}
</Tabs.Root>
