<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/header.svelte';
	import DocsSidebar from '$lib/components/docs-sidebar.svelte';
	import { SidebarNavItems } from '$lib/config/docs';

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
	<div class="flex flex-1">
		<aside
			class="hidden h-[calc(100vh-4rem)] w-64 max-w-64 min-w-64 overflow-y-auto lg:block"
			style="position:fixed; top:4rem; left:0; z-index:30;"
		>
			<DocsSidebar navItems={SidebarNavItems} />
		</aside>

		<main class="flex-1 overflow-y-auto" style="margin-left: 16rem;">
			{@render children?.()}
		</main>
	</div>
</div>
