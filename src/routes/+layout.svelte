<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/state';
	import Footer from '#lib/components/footer.svelte';
	import Header from '#lib/components/header.svelte';

	let { children } = $props();

	let headerHeight = $state(0);
	const isBlogDetail = $derived(/^\/blog\/[^/]+\/?$/.test(page.url.pathname));
</script>

<ModeWatcher disableTransitions={false} />

<svelte:head>
	<title>Arcane Documentation</title>
	<meta name="description" content="Arcane - Docker Management, Designed for Everyone." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div
	class="relative flex min-h-screen flex-col bg-background text-foreground"
	style:--header-height={headerHeight ? `${headerHeight}px` : undefined}
>
	<Header bind:height={headerHeight} />
	<main class="flex-1">
		{@render children()}
	</main>
	{#if !isBlogDetail}
		<Footer />
	{/if}
</div>
