<script lang="ts">
	import { onMount } from 'svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Search from '@lucide/svelte/icons/search';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ChangelogToc from '$lib/components/changelog-toc.svelte';
	import ReleaseNoteCard from '$lib/components/release-note-card.svelte';
	import type { PageData } from './$types.js';

	type TocEntry = {
		title: string;
		url: string;
		items: TocEntry[];
	};

	type VersionEntry = {
		title: string;
		url: string;
		version: string;
		date?: string;
	};

	type ReleaseSection = {
		id: string;
		title: string;
		dateLabel?: string;
		releaseUrl?: string;
		contentNodes: Node[];
		searchText: string;
		defaultExpanded: boolean;
	};

	let { data }: { data: PageData } = $props();

	const Markdown = $derived(data.component);
	const doc = $derived(data.metadata);

	const flattenToc = (items: TocEntry[] = [], depth = 0) => {
		const out: Array<{ title: string; url: string; depth: number }> = [];
		for (const item of items) {
			out.push({ title: item.title, url: item.url, depth });
			if (item.items?.length) {
				out.push(...flattenToc(item.items, depth + 1));
			}
		}
		return out;
	};

	const parseVersionTitle = (title: string) => {
		const match = title.match(/^(v?\d[\w.-]*)\s*-\s*(\d{4}-\d{2}-\d{2})/i);
		if (!match) return { version: title, date: undefined };
		return { version: match[1], date: match[2] };
	};

	const formatDateLabel = (date: string) => {
		const parsed = new Date(`${date}T00:00:00Z`);
		if (Number.isNaN(parsed.getTime())) return date;
		return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
	};

	const versionEntries = $derived(
		flattenToc((doc.toc ?? []) as TocEntry[])
			.filter((item) => item.depth === 0 && /^v?\d/i.test(item.title))
			.map((item) => {
				const parsed = parseVersionTitle(item.title);
				return {
					title: item.title,
					url: item.url,
					version: parsed.version,
					date: parsed.date
				} satisfies VersionEntry;
			})
	);

	const latestEntry = $derived(versionEntries[0]);
	const latestDateLabel = $derived(latestEntry?.date ? formatDateLabel(latestEntry.date) : null);

	let sourceRef = $state<HTMLDivElement>();
	let query = $state('');
	let ready = $state(false);
	let sections = $state<ReleaseSection[]>([]);
	let bulkActionKey = $state(0);
	let bulkActionValue = $state<boolean | null>(null);

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
		const label = heading.textContent?.toLowerCase() ?? '';
		if (label.includes('new feature')) return 'features';
		if (label.includes('bug fix')) return 'fixes';
		if (label.includes('dependencies')) return 'deps';
		if (label.includes('security')) return 'security';
		if (label.includes('other')) return 'other';
		return 'general';
	};

	const buildSections = (container: HTMLElement): ReleaseSection[] => {
		const results: ReleaseSection[] = [];
		const headings = Array.from(container.querySelectorAll('h2'));

		headings.forEach((heading, index) => {
			const nodes: Node[] = [];
			let cursor = heading.nextSibling;
			while (cursor && !(cursor instanceof HTMLHeadingElement && cursor.tagName.toLowerCase() === 'h2')) {
				const next = cursor.nextSibling;
				nodes.push(cursor);
				cursor = next;
			}

			const titleText = heading.textContent?.trim() ?? '';
			const parsed = parseVersionTitle(titleText);
			const headingId = heading.id || `release-${index + 1}`;

			const releaseParagraph = nodes.find(
				(node) =>
					node instanceof HTMLParagraphElement &&
					node.querySelector('a')?.textContent?.trim().toLowerCase() === 'release'
			) as HTMLParagraphElement | undefined;

			const releaseUrl = releaseParagraph?.querySelector('a')?.getAttribute('href') ?? undefined;

			const contentNodes = nodes.filter((node) => node !== releaseParagraph);
			for (const node of contentNodes) {
				if (node instanceof HTMLHeadingElement && node.tagName.toLowerCase() === 'h3') {
					node.dataset.kind = classifySectionHeading(node);
				}
				if (node instanceof HTMLElement) {
					node.querySelectorAll('h3').forEach((subheading) => {
						if (subheading instanceof HTMLHeadingElement) {
							subheading.dataset.kind = classifySectionHeading(subheading);
						}
					});
				}
				if (node.parentNode === container) {
					node.parentNode.removeChild(node);
				}
			}

			const searchContent = contentNodes.map((node) => node.textContent ?? '').join(' ');

			results.push({
				id: headingId,
				title: parsed.version,
				dateLabel: parsed.date ? formatDateLabel(parsed.date) : undefined,
				releaseUrl,
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
	<style>
		:root {
			scroll-padding-top: 6.5rem;
		}
	</style>
</svelte:head>

<div class="docs-theme relative isolate">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
		<div class="changelog-shell relative overflow-hidden">
			<div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
				<div class="changelog-grid"></div>
			</div>

		<div class="container mx-auto flex min-w-0 flex-1 flex-col gap-10 px-4 pb-8 pt-24 lg:pb-12 lg:pt-28">
			<section class="changelog-hero">
				<div class="changelog-hero__content">
					<p class="changelog-eyebrow">Release Notes</p>
					<h1 class="changelog-title">{doc.title}</h1>
					{#if doc.description}
						<p class="changelog-subtitle">{doc.description}</p>
					{/if}
				</div>
				<div class="changelog-hero__meta">
					<div class="changelog-meta-card">
						<p class="changelog-meta-label">Latest release</p>
						<p class="changelog-meta-value">{latestEntry?.version ?? '—'}</p>
						<p class="changelog-meta-detail">{latestDateLabel ?? 'No date available'}</p>
					</div>
				</div>
			</section>

			<div class="changelog-layout">
				<ChangelogToc toc={doc.toc} class="changelog-rail" maxVisibleVersions={12} />

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
							<Button size="sm" variant="outline" onclick={() => applyBulkAction(true)}>Expand all</Button>
							<Button size="sm" variant="ghost" onclick={() => applyBulkAction(false)}>Collapse all</Button>
						</div>
					</div>

					{#if ready}
						<p class="changelog-count">
							Showing {visibleCount} of {totalCount} releases
						</p>
					{/if}

					<div class="changelog-body" data-ready={ready}>
						<div class="changelog-source" bind:this={sourceRef}>
							<Markdown />
						</div>
						{#if ready}
							{#each filteredSections as section (section.id)}
								{#snippet badge()}
									{#if section.releaseUrl}
										{@const releasePath = section.releaseUrl.replace(/^https?:\/\//, '')}
										<a
											href={`https://${releasePath}`}
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
								>
								</ReleaseNoteCard>
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
							<div class="text-muted-foreground text-sm">Help improve this page</div>
								<a
									href={`https://github.com/getarcaneapp/website/edit/main/content/${doc.path}.md`}
								target="_blank"
								rel="noopener noreferrer"
								class="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
							>
								Edit this page on GitHub
								<ExternalLink class="text-muted-foreground mb-1 size-4 align-text-bottom" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.changelog-shell {
		--changelog-stroke: color-mix(in oklab, var(--border) 95%, var(--foreground) 5%);
	}

	.changelog-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px),
			linear-gradient(to bottom, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px);
		background-size: 120px 120px;
		opacity: 0.15;
	}

	.changelog-hero {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: flex-start;
	}

	.changelog-hero__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 48rem;
	}

	.changelog-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--muted-foreground);
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

	.changelog-hero__meta {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	.changelog-meta-card {
		padding: 1rem 1.25rem;
		border-radius: 1.25rem;
		background: color-mix(in oklab, var(--background) 92%, var(--muted) 8%);
		border: 1px solid var(--changelog-stroke);
		box-shadow: 0 12px 30px -28px rgba(0, 0, 0, 0.35);
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.changelog-meta-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--muted-foreground);
	}

	.changelog-meta-value {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.changelog-meta-detail {
		font-size: 0.85rem;
		color: var(--muted-foreground);
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
		border-radius: 1.25rem;
		border: 1px solid var(--changelog-stroke);
		background: color-mix(in oklab, var(--background) 94%, var(--muted) 6%);
		backdrop-filter: blur(8px);
	}

	.changelog-search {
		display: flex;
		flex: 1;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 999px;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
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
		border-radius: 1.5rem;
		background: color-mix(in oklab, var(--background) 96%, var(--muted) 4%);
		border: 1px dashed var(--changelog-stroke);
		color: var(--muted-foreground);
	}

	:global(.changelog-body .mdsx) {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	:global(.changelog-entry) {
		position: relative;
		border-radius: 1.5rem;
		border: 1px solid var(--changelog-stroke);
		background: color-mix(in oklab, var(--background) 94%, var(--muted) 6%);
		box-shadow: 0 16px 42px -36px rgba(0, 0, 0, 0.45);
		overflow: hidden;
		scroll-margin-top: 8rem;
	}

	:global(.changelog-entry__header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: color-mix(in oklab, var(--background) 96%, var(--muted) 4%);
		border-bottom: 1px solid color-mix(in oklab, var(--border) 75%, transparent);
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
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--muted-foreground);
	}

	:global(.changelog-entry__release) {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--muted) 70%, transparent);
		color: var(--foreground);
	}

	:global(.changelog-entry__toggle) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 600;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		width: 2.25rem;
		height: 2.25rem;
		padding: 0;
		border-radius: 999px;
		background: var(--background);
		cursor: pointer;
		transition: transform 200ms ease, box-shadow 200ms ease;
	}

	:global(.changelog-entry__toggle:hover) {
		box-shadow: 0 4px 12px -8px rgba(0, 0, 0, 0.5);
		transform: translateY(-1px);
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
		padding: 1.25rem 1.5rem 1.75rem;
		display: block;
	}

	:global(.changelog-entry__content) {
		display: grid;
		gap: 1rem;
	}

	:global(.changelog-entry__body h3) {
		margin-top: 0.75rem;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--background) 92%, var(--muted) 8%);
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		width: fit-content;
	}

	:global(.changelog-entry__body h3[data-kind='features']) {
		background: color-mix(in oklab, var(--primary) 8%, transparent);
	}

	:global(.changelog-entry__body h3[data-kind='fixes']) {
		background: color-mix(in oklab, var(--chart-2) 8%, transparent);
	}

	:global(.changelog-entry__body h3[data-kind='deps']) {
		background: color-mix(in oklab, var(--chart-4) 8%, transparent);
	}

	:global(.changelog-entry__body h3[data-kind='security']) {
		background: color-mix(in oklab, var(--destructive) 8%, transparent);
	}

	:global(.changelog-entry__body h3[data-kind='other']) {
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
		.changelog-hero {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
			grid-template-areas: 'content meta';
			align-items: start;
			gap: 2.5rem;
		}

		.changelog-hero__content {
			grid-area: content;
		}

		.changelog-hero__meta {
			grid-area: meta;
			align-content: start;
		}

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
