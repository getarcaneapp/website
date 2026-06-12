<script lang="ts">
	import ExternalLink from 'virtual:icons/lucide/external-link';
	import ChevronRight from 'virtual:icons/lucide/chevron-right';
	import type { ComponentProps } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { SidebarNavItem } from '$lib/config/docs.js';

	let {
		navItems,
		...restProps
	}: { navItems: SidebarNavItem[] } & ComponentProps<typeof Sidebar.Root> = $props();

	const pathname = $derived(page.url.pathname);
	let openGroups = $state<Record<string, boolean>>({});

	const itemKey = (item: SidebarNavItem) => item.href ?? item.title;

	const isBranchActive = (item: SidebarNavItem): boolean =>
		item.href === pathname || item.items.some((child) => isBranchActive(child));

	const isItemActive = (item: SidebarNavItem): boolean => item.href === pathname;

	const isExpanded = (item: SidebarNavItem): boolean =>
		openGroups[itemKey(item)] ?? isBranchActive(item);

	const toggleGroup = (item: SidebarNavItem) => {
		const key = itemKey(item);
		openGroups[key] = !isExpanded(item);
	};
</script>

<Sidebar.Root
	class="sticky top-14 z-30 hidden h-auto border-r border-border bg-transparent px-2 lg:flex lg:h-[calc(100vh-3.5rem)] lg:flex-col lg:self-start lg:overflow-hidden lg:pr-4 lg:pb-6"
	collapsible="none"
	{...restProps}
>
	<Sidebar.Content class="no-scrollbar min-h-0 flex-1 overflow-y-auto bg-transparent py-6">
		{#each navItems as item (item.title)}
			<Sidebar.Group class="mt-6 px-0 py-0 first:mt-0">
				<Sidebar.GroupLabel class="px-0 text-sm font-medium text-foreground">
					{item.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					{#if item.items.length}
						<Sidebar.Menu class="mt-1 gap-0.5 border-l border-border pl-0">
							{#each item.items as subItem (subItem.href)}
								{#if subItem.items.length === 0}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={isItemActive(subItem)}
											class="group relative -ml-px h-8 w-full justify-start rounded-none border-l border-transparent pr-2.5 pl-3 text-sm font-normal text-muted-foreground transition-colors duration-150 hover:bg-transparent hover:text-foreground data-[active=true]:border-primary data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-foreground"
										>
											{#snippet child(snippetProps: { props: Record<string, unknown> })}
												{@const href = subItem.href}
												{#if href}
													{#if subItem.external}
														<a
															href={`https://${href.replace(/^https?:\/\//, '')}`}
															{...snippetProps.props}
															target="_blank"
															rel="noopener noreferrer"
														>
															{subItem.title}
															<ExternalLink
																class="mb-1 inline size-3 align-text-bottom text-muted-foreground"
															/>
														</a>
													{:else}
														<a href={resolve(href as Pathname)} {...snippetProps.props}
															>{subItem.title}</a
														>
													{/if}
												{:else}
													<span {...snippetProps.props}>{subItem.title}</span>
												{/if}
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{:else}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={isItemActive(subItem)}
											class="group relative -ml-px h-8 w-full justify-start rounded-none border-l border-transparent pr-9 pl-3 text-sm font-normal text-muted-foreground transition-colors duration-150 hover:bg-transparent hover:text-foreground data-[active=true]:border-primary data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-foreground"
										>
											{#snippet child(snippetProps: { props: Record<string, unknown> })}
												{@const href = subItem.href}
												{#if href}
													<a href={resolve(href as Pathname)} {...snippetProps.props}
														>{subItem.title}</a
													>
												{:else}
													<span {...snippetProps.props}>{subItem.title}</span>
												{/if}
											{/snippet}
										</Sidebar.MenuButton>
										<Sidebar.MenuAction
											type="button"
											onclick={() => toggleGroup(subItem)}
											aria-label={isExpanded(subItem)
												? `Collapse ${subItem.title}`
												: `Expand ${subItem.title}`}
											aria-expanded={isExpanded(subItem)}
											class="top-1.5"
										>
											<ChevronRight
												class={`transition-transform duration-150 ${isExpanded(subItem) ? 'rotate-90' : ''}`}
											/>
										</Sidebar.MenuAction>

										{#if isExpanded(subItem)}
											<Sidebar.MenuSub class="mt-1">
												{#each subItem.items as childItem (childItem.href)}
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton isActive={childItem.href === pathname}>
															{#snippet child(snippetProps: { props: Record<string, unknown> })}
																{@const href = childItem.href}
																{#if href}
																	<a href={resolve(href as Pathname)} {...snippetProps.props}
																		>{childItem.title}</a
																	>
																{:else}
																	<span {...snippetProps.props}>{childItem.title}</span>
																{/if}
															{/snippet}
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
												{/each}
											</Sidebar.MenuSub>
										{/if}
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
