<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import type { Component } from 'svelte';
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { SidebarNavItems } from '$lib/config/docs.js';
	import { useIsMac } from '$lib/hooks/is-mac.svelte.js';
	import { cn } from '$lib/utils.js';
	import CommandMenuItem from './command-search-item.svelte';

	type KbdProps = HTMLAttributes<HTMLElement> & { content: string | Component };

	const isMac = useIsMac();
	let open = $state(false);
	const openExternal = (href: string) => {
		if (typeof window !== 'undefined') {
			window.open(href, '_blank', 'noopener,noreferrer');
		}
	};

	type SearchDoc = {
		id: string;
		title: string;
		description: string;
		section: string;
		href: string;
		headings: string[];
		content: string;
		type?: 'page' | 'heading';
		parentTitle?: string;
	};

	let query = $state('');
	let allDocs = $state<SearchDoc[]>([]);
	let results = $state<SearchDoc[]>([]);
	let loading = $state(false);

	async function ensureIndex() {
		if (allDocs.length) return;
		loading = true;
		try {
			const res = await fetch('/api/command');
			const json = (await res.json()) as { docs: SearchDoc[] };
			allDocs = json.docs;
		} finally {
			loading = false;
		}
	}

	function score(doc: SearchDoc, q: string) {
		const ql = q.toLowerCase();
		let s = 0;

		// exact match boost
		if (doc.title.toLowerCase() === ql) s += 10;

		if (doc.title.toLowerCase().includes(ql)) s += 5;
		if (doc.section.toLowerCase().includes(ql)) s += 3;
		if (doc.description.toLowerCase().includes(ql)) s += 2;
		if (doc.headings.join(' ').toLowerCase().includes(ql)) s += 2;
		if (doc.content.toLowerCase().includes(ql)) s += 1;

		// type boost
		if (doc.type === 'page') s += 0.5;

		return s;
	}

	async function onQueryChange() {
		const q = query.trim();
		if (!q) {
			results = [];
			return;
		}
		await ensureIndex();
		results = allDocs
			.map((d) => ({ d, s: score(d, q) }))
			.filter((x) => x.s > 0)
			.sort((a, b) => b.s - a.s)
			.slice(0, 50)
			.map((x) => x.d);
	}

	async function runCommand(command: () => unknown) {
		open = false;
		await tick();
		command();
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.key === 'l' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
			if (
				(e.target instanceof HTMLElement && e.target.isContentEditable) ||
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLSelectElement
			) {
				return;
			}

			e.preventDefault();
			open = !open;
			if (open) ensureIndex();
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#snippet CommandMenuKbd({ class: className, content, ...restProps }: KbdProps)}
	{@const Content = content}
	<kbd
		class={cn(
			"bg-muted/60 text-muted-foreground border-border/60 pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium shadow-[0_2px_6px_-4px_oklch(0_0_0/0.35)] select-none dark:bg-surface/70 dark:text-surface-foreground/70 [&_svg:not([class*='size-'])]:size-3",
			className
		)}
		{...restProps}
	>
		{#if typeof Content === 'string'}
			{Content}
		{:else}
			<Content />
		{/if}
	</kbd>
{/snippet}

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="secondary"
				class={cn(
					'bg-background/80 text-muted-foreground border-border/60 relative h-9 w-full justify-start border pl-3 font-normal shadow-[0_8px_20px_-20px_oklch(0_0_0/0.45)] backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:text-foreground sm:pr-12 md:w-40 lg:w-56 xl:w-64 dark:bg-surface/80 dark:text-surface-foreground/70 dark:border-white/10 dark:hover:border-primary/40'
				)}
				onclick={() => (open = true)}
			>
				<span class="hidden lg:inline-flex">Search documentation...</span>
				<span class="inline-flex lg:hidden">Search...</span>
				<div class="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
					{@render CommandMenuKbd({ content: isMac.current ? '⌘' : 'Ctrl' })}
					{@render CommandMenuKbd({ content: 'L', class: 'aspect-square' })}
				</div>
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content
		showCloseButton={false}
		class="bg-background/95 border-border/60 rounded-3xl border bg-clip-padding p-2 pb-2 shadow-[0_18px_50px_-20px_oklch(0_0_0/0.4)] backdrop-blur-xl dark:bg-surface/95 dark:shadow-[0_20px_60px_-25px_oklch(0_0_0/0.55)]"
	>
		<Dialog.Header class="sr-only">
			<Dialog.Title>Search documentation...</Dialog.Title>
			<Dialog.Description>Search docs</Dialog.Description>
		</Dialog.Header>

		<Command.Root
			class="rounded-none bg-transparent **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-10 **:data-[slot=command-input-wrapper]:rounded-2xl **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-border/60 **:data-[slot=command-input-wrapper]:bg-background/80 **:data-[slot=command-input-wrapper]:px-2 **:data-[slot=command-input-wrapper]:shadow-[inset_0_1px_0_oklch(1_0_0/0.08)] **:data-[slot=command-input]:h-10 **:data-[slot=command-input]:py-0 **:data-[slot=command-input]:text-sm **:data-[slot=command-input]:placeholder:text-muted-foreground/70"
		>
			<Command.Input placeholder="Search documentation..." bind:value={query} oninput={onQueryChange} />
			<Command.List class="no-scrollbar min-h-28 scroll-pt-2 scroll-pb-1.5 overflow-auto">
				<Command.Empty class="text-muted-foreground py-10 text-center text-sm">
					{#if loading}Building search index…{/if}
					{#if !loading}Type to search documentation.{/if}
				</Command.Empty>

				{#if query}
					<Command.Group
						heading="Search results"
						class="!p-0 [&_[data-command-group-heading]]:scroll-mt-16 [&_[data-command-group-heading]]:!p-3 [&_[data-command-group-heading]]:!pb-1 [&_[data-command-group-heading]]:text-[0.65rem] [&_[data-command-group-heading]]:tracking-[0.3em] [&_[data-command-group-heading]]:uppercase"
					>
						{#each results as r (r.id)}
								<CommandMenuItem
									value={`${r.title} ${r.section} ${r.parentTitle ?? ''}`}
									keywords={[r.description, ...r.headings]}
									onSelect={() => runCommand(() => goto(resolve(r.href as Pathname)))}
								>
								<ArrowRightIcon />
								<div class="flex flex-col">
									<span>{r.title}</span>
									{#if r.parentTitle}
										<span class="text-muted-foreground text-[0.65rem] leading-none font-normal">
											{r.parentTitle}
										</span>
									{/if}
								</div>
								<span class="text-muted-foreground ml-auto font-mono text-xs font-normal tabular-nums">
									{r.section}
								</span>
							</CommandMenuItem>
						{/each}
					</Command.Group>
				{:else}
					{#each SidebarNavItems as group (group.title)}
						<Command.Group
							heading={group.title}
							class="!p-0 [&_[data-command-group-heading]]:scroll-mt-16 [&_[data-command-group-heading]]:!p-3 [&_[data-command-group-heading]]:!pb-1 [&_[data-command-group-heading]]:text-[0.65rem] [&_[data-command-group-heading]]:tracking-[0.3em] [&_[data-command-group-heading]]:uppercase"
						>
							{#each group.items as item, i (i)}
								<CommandMenuItem
									value={item.title?.toString() ? `${group.title} ${item.title}` : ''}
									onSelect={() =>
										runCommand(() => {
											if (!item.href) return;
											if (item.external) {
												openExternal(item.href);
												return;
											}
											goto(resolve(item.href as Pathname));
										})
									}
								>
									<ArrowRightIcon />
									{item.title}
								</CommandMenuItem>
							{/each}
						</Command.Group>
					{/each}
				{/if}
			</Command.List>
		</Command.Root>
	</Dialog.Content>
</Dialog.Root>
