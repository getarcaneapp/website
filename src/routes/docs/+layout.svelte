<script lang="ts">
	import DocsSidebar from '$lib/components/docs-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { SidebarNavItems } from '$lib/config/docs.js';

	let { children } = $props();
</script>

<div class="docs-theme container-wrapper relative isolate flex flex-1 flex-col px-2">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
	<Sidebar.Provider
		class="3xl:fixed:container 3xl:fixed:px-3 min-h-[calc(100vh-var(--header-height))] flex-1 items-start gap-6 px-0 [--sidebar-width:240px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:gap-8 lg:[--sidebar-width:260px] lg:[--top-spacing:calc(var(--spacing)*4)] 2xl:[--sidebar-width:280px]"
	>
		<DocsSidebar navItems={SidebarNavItems} />
		<div class="relative h-full w-full">
			{@render children()}
		</div>
	</Sidebar.Provider>
</div>
