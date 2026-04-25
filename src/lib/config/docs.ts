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

type Doc = {
	title: string;
	path: string;
	order?: number;
	published?: boolean;
};

function toHref(path: string) {
	return `/docs/${path}`;
}

const ALL_DOCS: Doc[] = [
	...setup,
	...security,
	...configuration,
	...features,
	...guides,
	...templates,
	...development,
	...cli
] as Doc[];

const docByPath = new Map<string, Doc>(ALL_DOCS.map((d) => [d.path, d]));

function leaf(path: string, overrideTitle?: string): SidebarNavItem | null {
	const doc = docByPath.get(path);
	if (!doc || doc.published === false) return null;
	return {
		title: overrideTitle ?? doc.title,
		href: toHref(doc.path),
		items: []
	};
}

function group(title: string, children: Array<SidebarNavItem | null>): SidebarNavItem {
	return {
		title,
		items: children.filter((c): c is SidebarNavItem => c !== null)
	};
}

// Sidebar layout — paths listed in display order.
// Pages can appear under any group regardless of their on-disk folder.
const GET_STARTED = group('Get Started', [
	leaf('setup/installation'),
	leaf('setup/podman'),
	leaf('guides/lxc-container'),
	leaf('setup/migrate-v1'),
	leaf('setup/next-images')
]);

const SECURITY = group('Security', [leaf('security/verify-artifacts'), leaf('setup/socket-proxy')]);

const CONFIGURATION = group('Configuration', [
	leaf('configuration/environment'),
	leaf('configuration/appearance'),
	leaf('configuration/notifications'),
	leaf('configuration/sso'),
	leaf('configuration/analytics')
]);

const NETWORKING = group('Networking', [
	leaf('configuration/proxy'),
	leaf('configuration/websockets-reverse-proxies'),
	leaf('configuration/tls')
]);

const SWARM_PARENT: SidebarNavItem = {
	title: 'Docker Swarm',
	href: toHref('features/swarm'),
	items: [
		leaf('features/swarm-cluster', 'Cluster'),
		leaf('features/swarm-workloads', 'Workloads'),
		leaf('features/swarm-nodes-agents', 'Nodes & Agents'),
		leaf('features/swarm-configs-secrets', 'Configs & Secrets')
	].filter((c): c is SidebarNavItem => c !== null)
};

const FEATURES = group('Features', [
	leaf('features/projects'),
	leaf('features/containers'),
	leaf('features/images'),
	leaf('features/image-builds'),
	leaf('features/volumes'),
	leaf('features/networks'),
	leaf('features/vulnerability-scans'),
	leaf('features/environments'),
	leaf('guides/updates'),
	leaf('guides/custom-metadata'),
	docByPath.has('templates') ? leaf('templates') : null,
	docByPath.has('templates/registries') ? leaf('templates/registries') : null,
	SWARM_PARENT
]);

const GUIDES = group('Guides', [leaf('guides/buildables'), leaf('guides/gpu-setup')]);

const CLI = group('CLI', [leaf('cli/install'), leaf('cli/config')]);

const DEVELOPMENT = group('Development', [leaf('dev/contribute'), leaf('dev/translate')]);

const COMMUNITY: SidebarNavItem = {
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

const sectionNavItems: SidebarNavItem[] = [
	GET_STARTED,
	SECURITY,
	CONFIGURATION,
	NETWORKING,
	FEATURES,
	GUIDES,
	CLI,
	DEVELOPMENT
].filter((s) => s.items.length > 0);

export const SidebarNavItems: SidebarNavItem[] = [...sectionNavItems, COMMUNITY];

function flattenNavItems(items: SidebarNavItem[]): SidebarNavItem[] {
	return items.flatMap((item) => [
		...(item.href ? [{ ...item, items: [] }] : []),
		...flattenNavItems(item.items)
	]);
}

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

// Kept for any callers that still rely on it.
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
