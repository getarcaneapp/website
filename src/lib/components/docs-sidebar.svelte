<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import type { ComponentProps } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { SidebarNavItem } from '$lib/config/docs.js';

	let { navItems, ...restProps }: { navItems: SidebarNavItem[] } & ComponentProps<typeof Sidebar.Root> = $props();

	const pathname = $derived(page.url.pathname);
</script>

<Sidebar.Root
	class="sticky top-24 z-30 hidden h-auto bg-transparent px-2 lg:flex lg:h-[calc(100vh-6rem)] lg:flex-col lg:self-start lg:overflow-hidden lg:px-3 lg:pb-6"
	collapsible="none"
	{...restProps}
>
	<Sidebar.Content class="no-scrollbar min-h-0 flex-1 overflow-y-auto rounded-3xl border border-sidebar-border/60 bg-sidebar/70 px-3 py-4 shadow-[0_20px_45px_-35px_oklch(0_0_0/0.45)] backdrop-blur">
		{#each navItems as item (item.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="text-muted-foreground/80 text-[0.6rem] font-extrabold tracking-[0.26em] uppercase">
					{item.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					{#if item.items.length}
						<Sidebar.Menu class="gap-1">
							{#each item.items as subItem (subItem.href)}
								{#if subItem.items.length === 0}
									<Sidebar.MenuItem>
									<Sidebar.MenuButton
										isActive={subItem.href === pathname}
										class="group relative h-8 w-full justify-start rounded-xl border border-transparent pl-6 pr-2.5 text-[0.8rem] font-medium text-muted-foreground transition-all duration-200 hover:border-border/80 hover:bg-accent/50 hover:text-foreground data-[active=true]:border-primary/30 data-[active=true]:bg-primary/10 data-[active=true]:text-foreground after:absolute after:left-3 after:top-1/2 after:h-2.5 after:w-0.5 after:-translate-y-1/2 after:rounded-full after:bg-primary after:opacity-0 data-[active=true]:after:opacity-100"
									>
										{#snippet child({ props })}
											{@const href = subItem.href}
											{#if href}
												{#if subItem.external}
													<a
														href={`https://${href.replace(/^https?:\/\//, '')}`}
														{...props}
														target="_blank"
														rel="noopener noreferrer"
													>
														{subItem.title}
														<ExternalLink class="text-muted-foreground mb-1 inline size-3 align-text-bottom" />
													</a>
												{:else}
													<a href={resolve(href as Pathname)} {...props}>{subItem.title}</a>
												{/if}
											{:else}
												<span {...props}>{subItem.title}</span>
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
