/**
 * Browser client for the Pagefind full-text index.
 *
 * The index is generated from the prerendered HTML by `pagefind --site build` after `vp build`
 * and served from `/pagefind/`. Only elements marked `data-pagefind-body` (docs and blog
 * content) are indexed, so it isn't available under `pnpm dev` until a build has run.
 */

type PagefindSubResult = {
	title: string;
	url: string;
	excerpt: string;
};

type PagefindResultData = {
	url: string;
	excerpt: string;
	meta: { title?: string; section?: string };
	sub_results?: PagefindSubResult[];
};

type PagefindSearch = {
	results: { id: string; data: () => Promise<PagefindResultData> }[];
};

type PagefindModule = {
	options: (options: { excerptLength?: number }) => Promise<void>;
	init: () => Promise<void>;
	debouncedSearch: (
		term: string,
		options?: unknown,
		debounceTimeoutMs?: number
	) => Promise<PagefindSearch | null>;
};

export type SearchHeading = {
	title: string;
	href: string;
	/** HTML with matches wrapped in `<mark>`; Pagefind escapes the page text itself. */
	excerpt: string;
};

export type SearchResult = {
	title: string;
	section?: string;
	href: string;
	excerpt: string;
	headings: SearchHeading[];
};

const MODULE_PATH = '/pagefind/pagefind.js';
const MAX_RESULTS = 8;
const MAX_HEADINGS = 3;
const DEBOUNCE_MS = 150;

let modulePromise: Promise<PagefindModule> | undefined;

/** Loads and initialises Pagefind once; later calls reuse the same instance. */
export function loadPagefind(): Promise<PagefindModule> {
	modulePromise ??= (async () => {
		const pagefind = (await import(/* @vite-ignore */ MODULE_PATH)) as PagefindModule;
		await pagefind.options({ excerptLength: 24 });
		await pagefind.init();
		return pagefind;
	})();
	// Allow a retry (e.g. after a flaky network) instead of caching the failure.
	modulePromise.catch(() => (modulePromise = undefined));
	return modulePromise;
}

/** `/docs/foo.html#bar` → `/docs/foo#bar`, `/index.html` → `/` */
const toRoute = (url: string) => url.replace(/(?:\/index)?\.html(?=#|$)/, '') || '/';

/**
 * Full-text search across the docs and blog. Resolves to `null` when a newer search
 * superseded this one (Pagefind debounces internally).
 */
export async function search(term: string): Promise<SearchResult[] | null> {
	const pagefind = await loadPagefind();
	const found = await pagefind.debouncedSearch(term, undefined, DEBOUNCE_MS);
	if (!found) return null;

	return Promise.all(
		found.results.slice(0, MAX_RESULTS).map(async (result) => {
			const data = await result.data();
			const href = toRoute(data.url);

			return {
				title: data.meta.title ?? href,
				section: data.meta.section,
				href,
				excerpt: data.excerpt,
				headings: (data.sub_results ?? [])
					.map((sub) => ({ title: sub.title, href: toRoute(sub.url), excerpt: sub.excerpt }))
					// The first sub-result is often the page itself (content before the first heading).
					.filter((sub) => sub.href !== href)
					.slice(0, MAX_HEADINGS)
			};
		})
	);
}
