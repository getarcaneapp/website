<script lang="ts">
	import { ArrowRightIcon, FileTextIcon, HashIcon } from '#lib/icons/index.js';
	import type { Component } from 'svelte';
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { SidebarNavItems } from '#lib/config/docs.js';
	import { useIsMac } from '#lib/hooks/is-mac.svelte.js';
	import { loadPagefind, search, type SearchResult } from '#lib/search/pagefind.js';
	import { cn, resolveInternalPath } from '#lib/utils.js';

	type KbdProps = HTMLAttributes<HTMLElement> & { content: string | Component };

	const isMac = useIsMac();

	let open = $state(false);
	let query = $state('');
	let results = $state.raw<SearchResult[]>([]);
	let searching = $state(false);
	let error = $state('');

	const openExternal = (href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer');
	};

	function setOpen(value: boolean) {
		open = value;
		if (value) {
			// Warm the index so the first keystroke doesn't wait for it.
			loadPagefind().catch(() => {});
			return;
		}
		query = '';
		results = [];
		error = '';
		searching = false;
	}

	async function onQueryChange() {
		const term = query.trim();
		if (!term) {
			results = [];
			searching = false;
			error = '';
			return;
		}

		searching = true;
		try {
			const found = await search(term);
			if (found === null) return; // superseded by a newer keystroke
			results = found;
			error = '';
			searching = false;
		} catch {
			results = [];
			searching = false;
			error = import.meta.env.DEV
				? 'The search index is built by `pnpm build`; it isn’t available in dev mode.'
				: 'Search is temporarily unavailable.';
		}
	}

	async function runCommand(command: () => unknown) {
		setOpen(false);
		await tick();
		command();
	}

	const isEditableTarget = (target: EventTarget | null) =>
		(target instanceof HTMLElement && target.isContentEditable) ||
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement;

	// ⌘K / Ctrl+K toggles search, and "/" opens it. Any other combination — including
	// modifiers on their own — is left to the browser.
	function handleKeydown(e: KeyboardEvent) {
		if (e.repeat || e.isComposing) return;

		const key = e.key.toLowerCase();
		const isModK = key === 'k' && e.metaKey !== e.ctrlKey && !e.altKey && !e.shiftKey;
		// "/" may need Shift or AltGr (reported as Ctrl+Alt) on some keyboard layouts.
		const isSlash = key === '/' && !e.metaKey && (!e.ctrlKey || e.altKey);
		if (!isModK && !isSlash) return;

		// Let "/" be typed into fields.
		if (isSlash && isEditableTarget(e.target)) return;

		e.preventDefault();
		setOpen(!open);
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#snippet searchHit(href: string, title: string, excerpt: string, section?: string, nested = false)}
	<Command.Item
		value={href}
		variant={nested ? 'nested' : 'result'}
		onSelect={() => runCommand(() => goto(resolveInternalPath(href)))}
	>
		{#if nested}
			<HashIcon />
		{:else}
			<FileTextIcon />
		{/if}
		<div class="flex min-w-0 flex-1 flex-col gap-0.5">
			<div class="flex min-w-0 items-baseline gap-2">
				<span class="truncate">{title}</span>
				{#if section}
					<span class="ml-auto shrink-0 font-mono text-xs font-normal text-muted-foreground">
						{section}
					</span>
				{/if}
			</div>
			{#if excerpt}
				<!-- Pagefind escapes page text; the only markup is its <mark> highlights. -->
				<p
					class="line-clamp-2 text-xs font-normal text-muted-foreground [&_mark]:rounded-sm [&_mark]:bg-primary/15 [&_mark]:text-foreground"
				>
					{@html excerpt}
				</p>
			{/if}
		</div>
	</Command.Item>
{/snippet}

{#snippet CommandMenuKbd({ class: className, content, ...restProps }: KbdProps)}
	{@const Content = content}
	<kbd
		class={cn(
			"pointer-events-none flex h-5 items-center justify-center gap-1 rounded border border-border bg-muted px-1 font-sans text-2xs font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
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

<Dialog.Root bind:open={() => open, setOpen}>
	<Dialog.Trigger>
		{#snippet child(snippetProps: { props: Record<string, unknown> })}
			<Button
				{...snippetProps.props}
				variant="search"
				class="relative h-8 w-full justify-start md:w-40 lg:w-56 xl:w-64"
				onclick={() => setOpen(true)}
			>
				<span class="hidden lg:inline-flex">Search documentation...</span>
				<span class="inline-flex lg:hidden">Search...</span>
				<div class="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
					{@render CommandMenuKbd({ content: isMac.current ? '⌘' : 'Ctrl' })}
					{@render CommandMenuKbd({ content: 'K', class: 'aspect-square' })}
				</div>
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content showCloseButton={false} variant="command">
		<Dialog.Header class="sr-only">
			<Dialog.Title>Search documentation...</Dialog.Title>
			<Dialog.Description>Search docs</Dialog.Description>
		</Dialog.Header>

		<Command.Root shouldFilter={false}>
			<Command.Input
				placeholder="Search documentation..."
				bind:value={query}
				oninput={onQueryChange}
			/>
			<Command.List>
				{#if query.trim()}
					{#if error}
						<p class="px-3 py-10 text-center text-sm text-muted-foreground">{error}</p>
					{:else if searching && !results.length}
						<p class="px-3 py-10 text-center text-sm text-muted-foreground">Searching…</p>
					{:else if !results.length}
						<p class="px-3 py-10 text-center text-sm text-muted-foreground">
							No results for “{query.trim()}”.
						</p>
					{:else}
						<Command.Group heading="Search results">
							{#each results as result (result.href)}
								{@render searchHit(result.href, result.title, result.excerpt, result.section)}
								{#each result.headings as heading (heading.href)}
									{@render searchHit(heading.href, heading.title, heading.excerpt, undefined, true)}
								{/each}
							{/each}
						</Command.Group>
					{/if}
				{:else}
					{#each SidebarNavItems as group (group.title)}
						<Command.Group heading={group.title}>
							{#each group.items as item, i (i)}
								<Command.Item
									value={`${group.title} ${item.title}`}
									onSelect={() =>
										runCommand(() => {
											if (!item.href) return;
											if (item.external) {
												openExternal(item.href);
												return;
											}
											goto(resolveInternalPath(item.href));
										})}
								>
									<ArrowRightIcon />
									{item.title}
								</Command.Item>
							{/each}
						</Command.Group>
					{/each}
				{/if}
			</Command.List>
		</Command.Root>
	</Dialog.Content>
</Dialog.Root>
