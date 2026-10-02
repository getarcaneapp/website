<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { page } from '$app/state';
	import * as Popover from '#lib/components/ui/popover/index.js';
	import { mainNavItems, SidebarNavItems } from '#lib/config/docs.js';
	import { cn } from '#lib/utils.js';

	type MobileLinkProps = HTMLAnchorAttributes & {
		content?: string;
	};

	let { class: className, ...restProps }: HTMLButtonAttributes = $props();

	let open = $state(false);

	const isActive = (href?: string | null) => {
		if (!href) return false;
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		return path === href || path.startsWith(`${href}/`);
	};
</script>

{#snippet MobileLink({ href, content, class: className, ...props }: MobileLinkProps)}
	<a
		{href}
		onclick={() => {
			open = false;
		}}
		class={cn(
			'text-2xl font-medium transition-colors',
			isActive(href) ? 'text-primary' : 'text-foreground hover:text-primary',
			className
		)}
		{...props}
	>
		{content}
	</a>
{/snippet}

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child(snippetProps: { props: Record<string, unknown> })}
			<button
				type="button"
				{...snippetProps.props}
				{...restProps}
				class={cn(
					'extend-touch-target inline-flex h-8 touch-manipulation items-center justify-start gap-2.5 rounded-xl outline-hidden select-none focus-visible:ring-0',
					className
				)}
			>
				<div class="relative flex h-8 w-4 items-center justify-center">
					<div class="relative size-4">
						<span
							class={cn(
								'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
								open ? 'top-1.75 -rotate-45' : 'top-1'
							)}
						></span>
						<span
							class={cn(
								'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
								open ? 'top-1.75 rotate-45' : 'top-2.5'
							)}
						></span>
					</div>
					<span class="sr-only">Toggle Menu</span>
				</div>
				<span class="flex h-8 items-center text-lg leading-none font-medium"> Menu </span>
			</button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		variant="fullscreen"
		align="start"
		side="bottom"
		alignOffset={-16}
		sideOffset={14}
		preventScroll
	>
		<div class="flex flex-col gap-12 overflow-auto px-6 py-6">
			<div class="flex flex-col gap-4">
				<div class="font-mono text-xs font-medium tracking-label text-muted-foreground uppercase">
					Menu
				</div>
				<div class="flex flex-col gap-3">
					{@render MobileLink({ href: '/', content: 'Home' })}
					{#each mainNavItems as item, i (i)}
						{@render MobileLink({ href: item.href, content: item.label })}
					{/each}
				</div>
			</div>
			<div class="flex flex-col gap-8">
				{#each SidebarNavItems as group (group.title)}
					<div class="flex flex-col gap-4">
						<div
							class="font-mono text-xs font-medium tracking-label text-muted-foreground uppercase"
						>
							{group.title}
						</div>
						<div class="flex flex-col gap-3">
							{#each group.items as item, i (i)}
								{@render MobileLink({ href: item.href, content: item.title })}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
