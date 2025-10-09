import { json } from '@sveltejs/kit';
import {
	configuration,
	development,
	features,
	guides,
	indexPage,
	setup,
	templates,
} from '$velite/index.js';

export const prerender = true;

type CollectionDoc = (typeof indexPage)[number];

const rawDocs = import.meta.glob('/content/**/*.md', {
	as: 'raw',
	eager: true,
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
	walk((toc as any)?.items);
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
	...setup,
	...configuration,
	...features,
	...guides,
	...development,
	...templates,
];

export function GET() {
	const docs = allDocs
		.filter((d) => (d as any).published !== false)
		.map((d) => {
			const filePath = `/content/${d.path}.md`;
			const raw = rawDocs[filePath] || '';
			const text = mdToText(stripCodeBlocks(stripFrontmatter(raw)));
			const headings = headingsFromToc((d as any).toc);
			const slugish = (d as any).slug ?? d.path;

			return {
				id: slugish,
				title: d.title,
				description: d.description,
				section: (d as any).section,
				href: pathToHref(slugish),
				headings,
				content: text.slice(0, 10_000),
			};
		});

	return json({ docs });
}
