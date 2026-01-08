import { cli, configuration, development, features, guides, setup, templates } from '$velite/index.js';

export const mainNavItems = [
	{ href: '/docs', label: 'Docs' },
	{ href: '/api-reference', label: 'API' },
	{ href: '/generator', label: 'Compose Generator' },
	{ href: '/sbom', label: 'SBOM' },
	{ href: '/changelog', label: 'Changelog' }
];

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
};

export type SidebarNavItem = NavItem & {
	items: SidebarNavItem[];
};

function toHref(path: string) {
	return `/docs/${path}`;
}

export function sortDocs<T extends { title: string; order?: number }>(arr: T[]) {
	return [...arr].sort((a, b) => {
		const ao = a.order ?? Number.MAX_SAFE_INTEGER;
		const bo = b.order ?? Number.MAX_SAFE_INTEGER;
		if (ao !== bo) return ao - bo;
		return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
	});
}

function mapLeafDocs(docs: Array<{ title: string; path: string; order?: number }>): SidebarNavItem[] {
	return sortDocs(docs).map((d) => ({
		title: d.title,
		href: toHref(d.path),
		items: []
	}));
}

const SECTION_BUILDERS: Array<{
	key: string;
	title: string;
	source: any[];
}> = [
	{ key: 'setup', title: 'Setup', source: setup },
	{ key: 'configuration', title: 'Configuration', source: configuration },
	{ key: 'features', title: 'Features', source: features },
	{ key: 'cli', title: 'CLI', source: cli },
	{ key: 'guides', title: 'Guides', source: guides },
	{ key: 'templates', title: 'Templates', source: templates },
	{ key: 'development', title: 'Development', source: development }
];

const COMMUNITY_GROUP: SidebarNavItem = {
	title: 'Community',
	items: [
		{
			title: 'Discord',
			href: 'https://discord.gg/WyXYpdyV3Z',
			external: true,
			items: []
		}
	]
};

export const SidebarNavItems: SidebarNavItem[] = SECTION_BUILDERS.map(({ title, source }) => ({
	title,
	items: mapLeafDocs(source)
}));

SidebarNavItems.push(COMMUNITY_GROUP);

const flat: SidebarNavItem[] = SECTION_BUILDERS.flatMap((s) => mapLeafDocs(s.source));

export function findNeighbors(pathName: string): {
	previous: SidebarNavItem | null;
	next: SidebarNavItem | null;
} {
	const clean = pathName.split('?')[0].split('#')[0];
	const idx = flat.findIndex((i) => i.href === clean);
	if (idx === -1) return { previous: null, next: null };
	return {
		previous: flat[idx - 1] ?? null,
		next: flat[idx + 1] ?? null
	};
}
