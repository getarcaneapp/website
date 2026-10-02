<script lang="ts">
	import { ArrowRightIcon, ExternalLinkIcon } from '#lib/icons/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import type { SidebarNavItem } from '#lib/config/docs.js';
	import { resolveInternalPath } from '#lib/utils.js';

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
	class="sticky top-(--header-height) z-30 hidden h-auto lg:flex lg:flex-col lg:self-start lg:overflow-hidden"
	collapsible="none"
	{...restProps}
>
	<Sidebar.Content class="min-h-0 flex-1 overflow-y-auto">
		{#each navItems as item (item.title)}
			<Sidebar.Group class="mt-6 first:mt-0">
				<Sidebar.GroupLabel>
					{item.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					{#if item.items.length}
						<Sidebar.Menu class="mt-1">
							{#each item.items as subItem (subItem.href)}
								{#if subItem.items.length === 0}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={isItemActive(subItem)}
											variant="docs"
											class="group relative -ml-px h-8 w-full justify-start"
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
															<ExternalLinkIcon
																class="mb-1 inline size-3 align-text-bottom text-muted-foreground"
															/>
														</a>
													{:else}
														<a href={resolveInternalPath(href)} {...snippetProps.props}
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
											variant="docs"
											class="group relative -ml-px h-8 w-full justify-start"
										>
											{#snippet child(snippetProps: { props: Record<string, unknown> })}
												{@const href = subItem.href}
												{#if href}
													<a href={resolveInternalPath(href)} {...snippetProps.props}
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
											<ArrowRightIcon
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
																	<a href={resolveInternalPath(href)} {...snippetProps.props}
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
