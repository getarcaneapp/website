<script lang="ts">
	import DocsSidebar from '$lib/components/docs-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { SidebarNavItems } from '$lib/config/docs.js';

	let { children } = $props();
</script>

<div class="container-wrapper flex flex-1 flex-col px-2">
	<Sidebar.Provider
		class="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]"
	>
		<DocsSidebar navItems={SidebarNavItems} />
		<div class="relative h-full w-full">
			<!-- Subtle gradient accent for content area -->
			<div
				class="pointer-events-none absolute top-0 right-0 -z-10 h-[300px] w-[300px] bg-[radial-gradient(circle,oklch(0.606_0.25_292.717/0.03),transparent_70%)] blur-2xl"
				aria-hidden="true"
			></div>
			{@render children()}
		</div>
	</Sidebar.Provider>
</div>
