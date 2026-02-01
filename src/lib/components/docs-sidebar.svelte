<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { SidebarNavItem } from '$lib/config/docs.js';

	let { navItems, ...restProps }: { navItems: SidebarNavItem[] } & ComponentProps<typeof Sidebar.Root> = $props();

	const pathname = $derived(page.url.pathname);
</script>

<Sidebar.Root
	class="sticky top-16 z-30 hidden h-auto max-h-[calc(100vh-4rem)] bg-transparent lg:flex"
	collapsible="none"
	{...restProps}
>
	<Sidebar.Content class="no-scrollbar h-full min-h-0 overflow-y-auto pr-2 pb-6">
		{#each navItems as item (item.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
					{item.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					{#if item.items.length}
						<Sidebar.Menu class="gap-0.5">
							{#each item.items as subItem (subItem.href)}
								{#if subItem.items.length === 0}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={subItem.href === pathname}
											class="3xl:fixed:w-full 3xl:fixed:max-w-48 hover:bg-accent/50 relative h-8 w-fit overflow-visible rounded-lg border border-transparent text-[0.8rem] font-medium transition-all duration-200 after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md hover:translate-x-0.5 data-[active=true]:border-purple-500/30 data-[active=true]:bg-purple-500/10 data-[active=true]:font-medium data-[active=true]:text-purple-600 dark:data-[active=true]:text-purple-400"
										>
											{#snippet child({ props })}
												{#if subItem.external}
													<a href={subItem.href} {...props} target="_blank" rel="noopener noreferrer">
														{subItem.title}
														<ExternalLink class="text-muted-foreground mb-1 inline size-3 align-text-bottom" />
													</a>
												{:else}
													<a href={subItem.href} {...props}>{subItem.title}</a>
												{/if}
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/if}
							{/each}
						</Sidebar.Menu>
					{/if}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
