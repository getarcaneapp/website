<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head>
	<title>Arcane Docs</title>
	<meta name="description" content="Arcane - Docker Management, Designed for Everyone." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="bg-background text-foreground flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
