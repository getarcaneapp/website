import {
	cli,
	configuration,
	development,
	features,
	guides,
	security,
	setup,
	templates
} from '$velite/index.js';

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
	order?: number;
};

export type SidebarNavItem = NavItem & {
	items: SidebarNavItem[];
};

function toHref(path: string) {
	return `/docs/${path}`;
}

export function sortDocs<T extends { title: string; order?: number }>(arr: T[]) {
	const hasOrder = arr.some((item) => typeof item.order === 'number');

	if (!hasOrder) {
		return [...arr].sort((a, b) =>
			a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
		);
	}

	return [...arr].sort((a, b) => {
		const ao = a.order ?? Number.MAX_SAFE_INTEGER;
		const bo = b.order ?? Number.MAX_SAFE_INTEGER;
		if (ao !== bo) return ao - bo;
		return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
	});
}

function mapLeafDocs(
	docs: Array<{ title: string; path: string; order?: number; published?: boolean }>
): SidebarNavItem[] {
	const visibleDocs = docs.filter((doc) => doc.published !== false);

	return sortDocs(visibleDocs).map((d) => ({
		title: d.title,
		href: toHref(d.path),
		order: d.order,
		items: []
	}));
}

function mapFeatureDocs(
	docs: Array<{ title: string; path: string; order?: number; published?: boolean }>
): SidebarNavItem[] {
	const visibleDocs = docs.filter((doc) => doc.published !== false);
	const swarmOverview = visibleDocs.find((doc) => doc.path === 'features/swarm');
	const swarmChildren = visibleDocs.filter((doc) => doc.path.startsWith('features/swarm-'));
	const otherDocs = visibleDocs.filter(
		(doc) => doc.path !== 'features/swarm' && !doc.path.startsWith('features/swarm-')
	);

	const items = mapLeafDocs(otherDocs);

	if (!swarmOverview) {
		return sortDocs(items);
	}

	items.push({
		title: swarmOverview.title,
		href: toHref(swarmOverview.path),
		order: swarmOverview.order,
		items: sortDocs(
			swarmChildren.map((doc) => ({
				...doc,
				title:
					doc.path === 'features/swarm-nodes-agents'
						? 'Nodes & Agents'
						: doc.path === 'features/swarm-configs-secrets'
							? 'Configs & Secrets'
							: doc.title.replace(/^Swarm\s+/, '')
			}))
		).map((doc) => ({
			title: doc.title,
			href: toHref(doc.path),
			order: doc.order,
			items: []
		}))
	});

	return sortDocs(items);
}

function mapSectionDocs(
	key: string,
	source: Array<{ title: string; path: string; order?: number; published?: boolean }>
): SidebarNavItem[] {
	if (key === 'features') {
		return mapFeatureDocs(source);
	}

	return mapLeafDocs(source);
}

function flattenNavItems(items: SidebarNavItem[]): SidebarNavItem[] {
	return items.flatMap((item) => [
		...(item.href ? [{ ...item, items: [] }] : []),
		...flattenNavItems(item.items)
	]);
}

const SECTION_BUILDERS: Array<{
	key: string;
	title: string;
	source: any[];
}> = [
	{ key: 'setup', title: 'Setup', source: setup },
	{ key: 'security', title: 'Security', source: security },
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

const sectionNavItems: SidebarNavItem[] = SECTION_BUILDERS.map(({ key, title, source }) => ({
	title,
	items: mapSectionDocs(key, source)
}));

export const SidebarNavItems: SidebarNavItem[] = [...sectionNavItems];

SidebarNavItems.push(COMMUNITY_GROUP);

const flat: SidebarNavItem[] = sectionNavItems.flatMap((section) => flattenNavItems(section.items));

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
