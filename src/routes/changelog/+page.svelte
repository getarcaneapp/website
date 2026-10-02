<script lang="ts">
	import { ExternalLinkIcon, SearchIcon } from '#lib/icons/index.js';
	import Button from '#lib/components/ui/button/button.svelte';
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
	};

	const REPO_URL = 'https://github.com/getarcaneapp/arcane';
	const EXPANDED_STORAGE_KEY = 'collapsible-cards-expanded';

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

	let query = $state('');
	let ready = $state(false);
	let sections = $state.raw<ReleaseSection[]>([]);
	let expanded = $state<Record<string, boolean>>({});

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

	const saveExpanded = () => {
		localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify(expanded));
	};

	const toggleSection = (id: string) => {
		expanded[id] = !expanded[id];
		saveExpanded();
	};

	const applyBulkAction = (value: boolean) => {
		for (const section of sections) {
			expanded[section.id] = value;
		}
		saveExpanded();
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
				searchText: `${titleText} ${searchContent}`.toLowerCase()
			});
		});

		container.innerHTML = '';
		return results;
	};

	// The changelog markdown renders into a hidden container; this splits it into one card per
	// release (moving the rendered nodes) and restores which cards were left expanded.
	// Only writes state (never reads it), so the attachment runs once per mount.
	const extractSections = (container: HTMLElement) => {
		const built = buildSections(container);

		const stored: Record<string, boolean> = JSON.parse(
			localStorage.getItem(EXPANDED_STORAGE_KEY) || '{}'
		);
		// The latest release always starts expanded.
		if (built[0]) stored[built[0].id] = true;
		localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify(stored));

		sections = built;
		expanded = stored;
		ready = true;
	};
</script>

<svelte:head>
	<title>{doc.title}</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<div class="relative isolate">
	<div class="relative overflow-hidden">
		<div
			class="container mx-auto flex min-w-0 flex-1 flex-col gap-10 px-4 pt-12 pb-8 lg:pt-16 lg:pb-12"
		>
			<section class="flex flex-col items-start">
				<div class="flex max-w-3xl flex-col gap-4">
					<h1 class="text-4xl font-semibold tracking-tight lg:text-5xl">{doc.title}</h1>
					{#if doc.description}
						<p class="max-w-xl text-lg text-muted-foreground">{doc.description}</p>
					{/if}
				</div>
			</section>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-changelog lg:items-start">
				<ChangelogToc toc={sidebarToc} maxVisibleVersions={12} />

				<div class="flex min-w-0 flex-col gap-5">
					<div
						class="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 lg:flex-row lg:items-center lg:justify-between"
					>
						<label
							class="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
						>
							<SearchIcon class="size-4 shrink-0" />
							<input
								type="search"
								placeholder="Search releases, issues, or keywords"
								bind:value={query}
								aria-label="Search changelog"
								class="w-full bg-transparent p-0 text-base outline-none placeholder:text-muted-foreground"
							/>
						</label>
						<div class="flex flex-wrap gap-2">
							<Button size="sm" variant="outline" onclick={() => applyBulkAction(true)}
								>Expand all</Button
							>
							<Button size="sm" variant="ghost" onclick={() => applyBulkAction(false)}
								>Collapse all</Button
							>
						</div>
					</div>

					{#if ready}
						<p class="text-sm text-muted-foreground">
							Showing {visibleCount} of {totalCount} releases
						</p>
					{/if}

					<div class="flex flex-col gap-6">
						<div
							class={[
								'[&_.markdown]:flex [&_.markdown]:flex-col [&_.markdown]:gap-6',
								ready && 'hidden'
							]}
							{@attach extractSections}
						>
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
											class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground no-underline"
										>
											Release
											<ExternalLinkIcon class="size-3.5" />
										</a>
									{/if}
								{/snippet}
								<ReleaseNoteCard
									id={section.id}
									title={section.title}
									description={section.dateLabel}
									expanded={expanded[section.id] ?? false}
									onToggle={() => toggleSection(section.id)}
									contentNodes={section.contentNodes}
									{badge}
								/>
							{/each}
						{/if}
					</div>

					{#if ready && query && visibleCount === 0}
						<div
							class="rounded-lg border border-dashed border-border bg-muted/5 p-6 text-muted-foreground"
						>
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
								<ExternalLinkIcon class="mb-1 size-4 align-text-bottom text-muted-foreground" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
