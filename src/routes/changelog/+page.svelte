<script lang="ts">
	import { onMount } from 'svelte';
	import ExternalLink from 'virtual:icons/lucide/external-link';
	import Search from 'virtual:icons/lucide/search';
	import Button from '#lib/components/ui/button/button.svelte';
	import Input from '#lib/components/ui/input/input.svelte';
	import ChangelogToc from '#lib/components/changelog-toc.svelte';
	import ReleaseNoteCard from '#lib/components/release-note-card.svelte';
	import type { PageData } from './$types.js';

	type TocEntry = {
		title: string;
		url: string;
		items: TocEntry[];
	};

	type ReleaseSection = {
		id: string;
		title: string;
		tocTitle: string;
		dateLabel?: string;
		releaseUrl?: string;
		tocItems: TocEntry[];
		contentNodes: Node[];
		searchText: string;
		defaultExpanded: boolean;
	};

	const REPO_URL = 'https://github.com/getarcaneapp/arcane';

	let { data }: { data: PageData } = $props();

	const Markdowns = $derived(data.components);
	const doc = $derived(data.metadata);

	const headingLabel = (heading: HTMLElement) => {
		const clone = heading.cloneNode(true) as HTMLElement;
		clone.querySelectorAll('a[href^="#"]').forEach((el) => el.remove());
		return clone.textContent?.trim() ?? '';
	};

	const isVersionHeading = (title: string) => /^v?\d+\.\d+/i.test(title);

	const parseVersionTitle = (title: string) => {
		const match = title.match(/^(v?\d[\w.-]*)\s*-\s*(\d{4}-\d{2}-\d{2})/i);
		if (!match) {
			const versionOnly = title.match(/^(v?\d[\w.-]*)/i);
			return { version: versionOnly?.[1] ?? title, date: undefined };
		}
		return { version: match[1], date: match[2] };
	};

	const formatDateLabel = (date: string) => {
		const parsed = new Date(`${date}T00:00:00Z`);
		if (Number.isNaN(parsed.getTime())) return date;
		return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
	};

	let sourceRef = $state<HTMLDivElement>();
	let query = $state('');
	let ready = $state(false);
	let sections = $state<ReleaseSection[]>([]);
	let bulkActionKey = $state(0);
	let bulkActionValue = $state<boolean | null>(null);

	const sidebarToc = $derived(
		sections.map((section) => ({
			title: section.tocTitle,
			url: `#${section.id}`,
			items: section.tocItems
		}))
	);

	const searchTerm = $derived(query.trim().toLowerCase());
	const filteredSections = $derived(
		searchTerm ? sections.filter((section) => section.searchText.includes(searchTerm)) : sections
	);

	const visibleCount = $derived(filteredSections.length);
	const totalCount = $derived(sections.length);

	const applyBulkAction = (value: boolean) => {
		if (typeof localStorage !== 'undefined') {
			const state = JSON.parse(localStorage.getItem('collapsible-cards-expanded') || '{}');
			for (const section of sections) {
				state[section.id] = value;
			}
			localStorage.setItem('collapsible-cards-expanded', JSON.stringify(state));
		}
		bulkActionValue = value;
		bulkActionKey += 1;
	};

	const classifySectionHeading = (heading: HTMLHeadingElement) => {
		const label = headingLabel(heading).toLowerCase();
		if (label.includes('feature')) return 'features';
		if (label.includes('fix') || label.includes('bug')) return 'fixes';
		if (label.includes('dependenc')) return 'deps';
		if (label.includes('security')) return 'security';
		if (label.includes('refactor')) return 'refactor';
		if (label.includes('other') || label.includes('performance')) return 'other';
		return 'general';
	};

	const markCategoryHeading = (heading: HTMLHeadingElement, tocItems: TocEntry[]) => {
		heading.dataset.kind = classifySectionHeading(heading);
		if (!heading.id) return;
		tocItems.push({
			title: headingLabel(heading),
			url: `#${heading.id}`,
			items: []
		});
	};

	const createExternalLink = (href: string, text: string) => {
		const link = document.createElement('a');
		link.href = href;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = text;
		return link;
	};

	const enhanceReleaseContent = (nodes: Node[]) => {
		const wrap = document.createElement('div');
		for (const node of nodes) wrap.appendChild(node);

		wrap.querySelectorAll('code').forEach((code) => {
			if (code.closest('a')) return;
			const hash = code.textContent?.trim() ?? '';
			if (!/^[a-f0-9]{7,40}$/i.test(hash)) return;
			const link = createExternalLink(`${REPO_URL}/commit/${hash}`, '');
			code.parentNode?.insertBefore(link, code);
			link.appendChild(code);
		});

		const texts: Text[] = [];
		const walker = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT);
		while (walker.nextNode()) {
			const node = walker.currentNode as Text;
			if (node.parentElement?.closest('a, code, pre')) continue;
			if (!node.textContent || !/\(#\d+\)|\(@/.test(node.textContent)) continue;
			texts.push(node);
		}

		for (const node of texts) {
			const value = node.textContent ?? '';
			const mentionRe = /\(#(\d+)\)|\(@([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\[bot\])?)\)/g;
			const frag = document.createDocumentFragment();
			let last = 0;
			for (const match of value.matchAll(mentionRe)) {
				const index = match.index ?? 0;
				if (index > last) frag.appendChild(document.createTextNode(value.slice(last, index)));
				frag.appendChild(document.createTextNode('('));
				if (match[1]) {
					frag.appendChild(createExternalLink(`${REPO_URL}/pull/${match[1]}`, `#${match[1]}`));
				} else {
					const handle = match[2];
					const user = handle.replace(/\[bot]$/, '');
					frag.appendChild(createExternalLink(`https://github.com/${user}`, `@${handle}`));
				}
				frag.appendChild(document.createTextNode(')'));
				last = index + match[0].length;
			}
			if (last < value.length) frag.appendChild(document.createTextNode(value.slice(last)));
			node.parentNode?.replaceChild(frag, node);
		}

		return Array.from(wrap.childNodes);
	};

	const buildSections = (container: HTMLElement): ReleaseSection[] => {
		const results: ReleaseSection[] = [];
		const headings = Array.from(container.querySelectorAll('h2')).filter((heading) =>
			isVersionHeading(headingLabel(heading))
		);

		headings.forEach((heading, index) => {
			const nodes: Node[] = [];
			let cursor = heading.nextSibling;
			while (cursor) {
				if (
					cursor instanceof HTMLHeadingElement &&
					cursor.tagName.toLowerCase() === 'h2' &&
					isVersionHeading(headingLabel(cursor))
				) {
					break;
				}
				const next = cursor.nextSibling;
				nodes.push(cursor);
				cursor = next;
			}

			const titleText = headingLabel(heading);
			const parsed = parseVersionTitle(titleText);
			const headingId = heading.id || `release-${index + 1}`;

			const releaseParagraph = nodes.find(
				(node) =>
					node instanceof HTMLParagraphElement &&
					node.querySelector('a')?.textContent?.trim().toLowerCase() === 'release'
			) as HTMLParagraphElement | undefined;

			const releaseUrl = releaseParagraph?.querySelector('a')?.getAttribute('href') ?? undefined;

			const contentNodes = enhanceReleaseContent(
				nodes.filter(
					(node) =>
						node !== releaseParagraph &&
						!(node.nodeType === Node.TEXT_NODE && !node.textContent?.trim())
				)
			);
			const tocItems: TocEntry[] = [];
			for (const node of contentNodes) {
				if (
					node instanceof HTMLHeadingElement &&
					(node.tagName.toLowerCase() === 'h2' || node.tagName.toLowerCase() === 'h3')
				) {
					markCategoryHeading(node, tocItems);
				}
				if (node instanceof HTMLElement) {
					node.querySelectorAll('h2, h3').forEach((subheading) => {
						if (subheading instanceof HTMLHeadingElement) {
							markCategoryHeading(subheading, tocItems);
						}
					});
				}
			}

			const searchContent = contentNodes.map((node) => node.textContent ?? '').join(' ');

			results.push({
				id: headingId,
				title: parsed.version,
				tocTitle: titleText,
				dateLabel: parsed.date ? formatDateLabel(parsed.date) : undefined,
				releaseUrl,
				tocItems,
				contentNodes,
				searchText: `${titleText} ${searchContent}`.toLowerCase(),
				defaultExpanded: index === 0
			});
		});

		container.innerHTML = '';
		return results;
	};

	onMount(() => {
		if (!sourceRef) return;
		sections = buildSections(sourceRef);
		ready = true;
	});
</script>

<svelte:head>
	<title>{doc.title}</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<div class="relative isolate">
	<div class="changelog-shell relative overflow-hidden">
		<div
			class="container mx-auto flex min-w-0 flex-1 flex-col gap-10 px-4 pt-12 pb-8 lg:pt-16 lg:pb-12"
		>
			<section class="changelog-hero">
				<div class="changelog-hero__content">
					<h1 class="changelog-title">{doc.title}</h1>
					{#if doc.description}
						<p class="changelog-subtitle">{doc.description}</p>
					{/if}
				</div>
			</section>

			<div class="changelog-layout">
				<ChangelogToc toc={sidebarToc} class="changelog-rail" maxVisibleVersions={12} />

				<div class="changelog-main">
					<div class="changelog-controls">
						<label class="changelog-search">
							<Search class="size-4" />
							<Input
								placeholder="Search releases, issues, or keywords"
								bind:value={query}
								aria-label="Search changelog"
							/>
						</label>
						<div class="changelog-actions">
							<Button size="sm" variant="outline" onclick={() => applyBulkAction(true)}
								>Expand all</Button
							>
							<Button size="sm" variant="ghost" onclick={() => applyBulkAction(false)}
								>Collapse all</Button
							>
						</div>
					</div>

					{#if ready}
						<p class="changelog-count">
							Showing {visibleCount} of {totalCount} releases
						</p>
					{/if}

					<div class="changelog-body" data-ready={ready}>
						<div class="changelog-source" bind:this={sourceRef}>
							{#each Markdowns as Markdown, index (index)}
								<Markdown />
							{/each}
						</div>
						{#if ready}
							{#each filteredSections as section (section.id)}
								{#snippet badge()}
									{#if section.releaseUrl}
										<a
											href={section.releaseUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="changelog-entry__release"
										>
											Release
											<ExternalLink class="size-3.5" />
										</a>
									{/if}
								{/snippet}
								<ReleaseNoteCard
									id={section.id}
									title={section.title}
									description={section.dateLabel}
									defaultExpanded={section.defaultExpanded}
									contentNodes={section.contentNodes}
									{badge}
									{bulkActionKey}
									{bulkActionValue}
								></ReleaseNoteCard>
							{/each}
						{/if}
					</div>

					{#if ready && query && visibleCount === 0}
						<div class="changelog-empty">
							<p>No releases match "{query}".</p>
							<p>Try searching for a version number, issue id, or a keyword like "OIDC".</p>
						</div>
					{/if}

					<div class="mt-10 border-t pt-6">
						<div class="flex flex-wrap items-center justify-between gap-4">
							<div class="text-sm text-muted-foreground">Help improve this page</div>
							<a
								href={`https://github.com/getarcaneapp/website/edit/main/content/${doc.path}.md`}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								Edit this page on GitHub
								<ExternalLink class="mb-1 size-4 align-text-bottom text-muted-foreground" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(:root) {
		scroll-padding-top: 6.5rem;
	}

	.changelog-shell {
		--changelog-stroke: color-mix(in oklab, var(--border) 95%, var(--foreground) 5%);
	}

	.changelog-hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.changelog-hero__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 48rem;
	}

	.changelog-title {
		font-size: clamp(2.5rem, 3.6vw, 3.5rem);
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.changelog-subtitle {
		font-size: 1.1rem;
		color: var(--muted-foreground);
		max-width: 36rem;
	}

	.changelog-layout {
		display: grid;
		gap: 2rem;
		grid-template-columns: minmax(0, 1fr);
	}

	.changelog-main {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.changelog-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		background: var(--background);
	}

	.changelog-search {
		display: flex;
		flex: 1;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		background: var(--background);
	}

	.changelog-search :global(input) {
		width: 100%;
		border: none;
		box-shadow: none;
		padding: 0;
		background: transparent;
		font-size: 0.95rem;
	}

	.changelog-search :global(input:focus) {
		outline: none;
	}

	.changelog-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.changelog-count {
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.changelog-body {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.changelog-body[data-ready='true'] .changelog-source {
		display: none;
	}

	.changelog-empty {
		padding: 1.5rem;
		border-radius: var(--radius);
		background: color-mix(in oklab, var(--background) 96%, var(--muted) 4%);
		border: 1px dashed var(--changelog-stroke);
		color: var(--muted-foreground);
	}

	:global(.changelog-body .markdown) {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	:global(.changelog-entry) {
		position: relative;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		background: var(--background);
		overflow: hidden;
		scroll-margin-top: 8rem;
	}

	:global(.changelog-entry__header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.5rem;
		background: var(--surface);
		transition: background-color 150ms ease;
	}

	:global(.changelog-entry__header:hover) {
		background: color-mix(in oklab, var(--surface) 85%, var(--muted) 15%);
	}

	:global(.changelog-entry:has(.changelog-entry__body) .changelog-entry__header) {
		border-bottom: 1px solid var(--border);
	}

	:global(.changelog-entry__title) {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	:global(.changelog-entry__title h2) {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	:global(.changelog-entry__date) {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: var(--muted-foreground);
	}

	:global(.changelog-entry__release) {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.85rem;
		font-weight: 500;
		text-decoration: none;
		padding: 0.3rem 0.7rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		background: var(--background);
		color: var(--foreground);
	}

	:global(.changelog-entry__toggle) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 600;
		border: 1px solid var(--border);
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
		border-radius: var(--radius-md);
		background: var(--background);
		cursor: pointer;
		transition: background-color 150ms ease;
	}

	:global(.changelog-entry__toggle:hover) {
		background: var(--muted);
	}

	:global(.changelog-entry__chevron) {
		width: 1rem;
		height: 1rem;
		transition: transform 200ms ease;
	}

	:global(.changelog-entry__toggle--expanded .changelog-entry__chevron) {
		transform: rotate(180deg);
	}

	:global(.changelog-entry__body) {
		padding: 1.25rem 1.5rem 1.5rem;
		display: block;
	}

	:global(.changelog-entry__content) {
		display: grid;
		gap: 0.75rem;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	:global(.changelog-entry__content > :first-child) {
		margin-top: 0;
	}

	:global(.changelog-entry__content :is(ul, ol, p)) {
		margin-block: 0;
	}

	:global(.changelog-entry__content :is(p, li, a, code)) {
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	:global(.changelog-entry__content pre) {
		max-width: 100%;
		overflow-x: auto;
	}

	:global(.changelog-entry__body :is(h2, h3)) {
		margin-top: 0.5rem;
		margin-bottom: 0;
		font-size: 0.8rem;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.7rem;
		border-radius: var(--radius-md);
		background: var(--surface);
		border: 1px solid var(--border);
		width: fit-content;
	}

	:global(.changelog-entry__body :is(h2, h3):first-child) {
		margin-top: 0;
	}

	:global(.changelog-entry__body :is(h2, h3) a[href^='#']) {
		display: none;
	}

	:global(.changelog-entry__body :is(h2, h3)[data-kind='features']) {
		background: color-mix(in oklab, var(--primary) 8%, transparent);
	}

	:global(.changelog-entry__body :is(h2, h3)[data-kind='fixes']) {
		background: color-mix(in oklab, var(--chart-2) 8%, transparent);
	}

	:global(.changelog-entry__body :is(h2, h3)[data-kind='deps']) {
		background: color-mix(in oklab, var(--chart-4) 8%, transparent);
	}

	:global(.changelog-entry__body :is(h2, h3)[data-kind='security']) {
		background: color-mix(in oklab, var(--destructive) 8%, transparent);
	}

	:global(.changelog-entry__body :is(h2, h3)[data-kind='refactor']) {
		background: color-mix(in oklab, var(--chart-5, var(--chart-3)) 8%, transparent);
	}

	:global(.changelog-entry__body :is(h2, h3)[data-kind='other']) {
		background: color-mix(in oklab, var(--chart-3) 8%, transparent);
	}

	:global(.changelog-entry__body ul) {
		display: grid;
		gap: 0.4rem;
		padding-left: 1.2rem;
	}

	:global(.changelog-entry__body ul li) {
		line-height: 1.5;
	}

	:global(.changelog-entry:target) {
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary) 40%, transparent);
	}

	@media (min-width: 1024px) {
		.changelog-layout {
			grid-template-columns: minmax(220px, 0.35fr) minmax(0, 1fr);
			align-items: start;
		}

		.changelog-controls {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.changelog-entry__toggle),
		:global(.changelog-entry__body) {
			transition: none;
		}
	}
</style>
