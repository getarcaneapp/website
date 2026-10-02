<script lang="ts">
	import DocsSidebar from '#lib/components/docs-sidebar.svelte';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import { SidebarNavItems } from '#lib/config/docs.js';

	let { children } = $props();
</script>

<div class="relative isolate flex w-full flex-1 flex-col px-4 lg:px-6">
	<Sidebar.Provider variant="docs" class="flex-1 items-start">
		<DocsSidebar navItems={SidebarNavItems} />
		<div class="relative h-full w-full">
			{@render children()}
		</div>
	</Sidebar.Provider>
</div>
