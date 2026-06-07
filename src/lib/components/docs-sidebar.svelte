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
	class="sticky top-24 z-30 hidden h-auto bg-transparent px-2 lg:flex lg:h-[calc(100vh-6rem)] lg:flex-col lg:self-start lg:overflow-hidden lg:px-3 lg:pb-6"
	collapsible="none"
	{...restProps}
>
	<Sidebar.Content
		class="no-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-card/85 px-2 py-4 shadow-sm backdrop-blur-md"
	>
		{#each navItems as item (item.title)}
			<Sidebar.Group class="mt-5 first:mt-0 px-0 py-0">
				<Sidebar.GroupLabel
					class="px-2 font-mono text-xs font-medium tracking-[0.12em] text-foreground/70 uppercase"
				>
					{item.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					{#if item.items.length}
						<Sidebar.Menu class="gap-0.5">
							{#each item.items as subItem (subItem.href)}
								{#if subItem.items.length === 0}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={isItemActive(subItem)}
											class="group relative h-7 w-full justify-start rounded-md border-l-2 border-transparent pr-2.5 pl-4 text-sm font-normal text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground data-[active=true]:border-primary data-[active=true]:bg-primary/5 data-[active=true]:font-medium data-[active=true]:text-primary"
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
											class="group relative h-7 w-full justify-start rounded-md border-l-2 border-transparent pr-9 pl-4 text-sm font-normal text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground data-[active=true]:border-primary data-[active=true]:bg-primary/5 data-[active=true]:font-medium data-[active=true]:text-primary"
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
