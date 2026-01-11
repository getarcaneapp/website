import { json } from '@sveltejs/kit';
import {
	api,
	changelog,
	cli,
	configuration,
	contributing,
	dockerResources,
	gettingStarted,
	guides,
	indexPage,
	remoteManagement,
	templates
} from '$velite/index.js';

export const prerender = true;

type CollectionDoc = (typeof indexPage)[number];

const rawDocs = import.meta.glob('/content/**/*.md', {
	as: 'raw',
	eager: true
}) as Record<string, string>;

function stripFrontmatter(md: string) {
	return md.replace(/^---[\s\S]*?---\s*/m, '');
}
function stripCodeBlocks(md: string) {
	return md.replace(/```[\s\S]*?```/g, '');
}
function mdToText(md: string) {
	return md
		.replace(/!\[[^\]]*]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/`+/g, '')
		.replace(/^#{1,6}\s*/gm, '')
		.replace(/[*_>#-]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}
function headingsFromToc(toc: any): string[] {
	const out: string[] = [];
	function walk(items?: any[]) {
		if (!items) return;
		for (const it of items) {
			if (it.title) out.push(it.title);
			walk(it.items);
		}
	}
	walk((toc as any)?.items || toc); // Velite s.toc() can be an array or { items: [] } depending on version/config
	return out;
}
function pathToHref(pathOrSlug: string): string {
	const cleaned = pathOrSlug
		.replace(/^\/+/, '')
		.replace(/\/index$/, '')
		.trim();
	return cleaned === '' || cleaned === 'index' ? '/docs' : `/docs/${cleaned}`;
}

const allDocs: CollectionDoc[] = [
	...indexPage,
	...gettingStarted,
	...dockerResources,
	...configuration,
	...remoteManagement,
	...cli,
	...guides,
	...templates,
	...contributing,
	...api,
	...changelog
];

export function GET() {
	const docs = allDocs
		.filter((d) => (d as any).published !== false)
		.flatMap((d) => {
			const filePath = `/content/${d.path}.md`;
			const raw = rawDocs[filePath] || '';
			const text = mdToText(stripCodeBlocks(stripFrontmatter(raw)));
			const toc = (d as any).toc;
			const slugish = (d as any).slug ?? d.path;
			const pageHref = pathToHref(slugish);

			const results: any[] = [];

			// Add the main page
			results.push({
				id: slugish,
				title: d.title,
				description: d.description,
				section: (d as any).section,
				href: pageHref,
				headings: headingsFromToc(toc),
				content: text.slice(0, 10_000),
				type: 'page'
			});

			// Add each heading from TOC as a searchable item
			function walk(items?: any[]) {
				if (!items) return;
				for (const it of items) {
					if (it.title && it.url) {
						results.push({
							id: `${slugish}${it.url}`,
							title: it.title,
							description: `Section in ${d.title}`,
							section: (d as any).section,
							href: `${pageHref}${it.url}`,
							headings: [],
							content: '',
							type: 'heading',
							parentTitle: d.title
						});
					}
					walk(it.items);
				}
			}
			walk((toc as any)?.items || (Array.isArray(toc) ? toc : []));

			return results;
		});

	return json({ docs });
}
