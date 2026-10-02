import {
	access,
	development,
	docker,
	getStarted,
	networking,
	reference,
	remote,
	security,
	settings
} from '#velite/index.js';

export const mainNavItems = [
	{ href: '/docs', label: 'Docs' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/generator', label: 'Compose Generator' },
	{ href: '/community', label: 'Community' }
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

type Doc = {
	title: string;
	path: string;
	published?: boolean;
};

function toHref(path: string) {
	return `/docs/${path}`;
}

const ALL_DOCS: Doc[] = [
	...getStarted,
	...docker,
	...remote,
	...access,
	...settings,
	...networking,
	...security,
	...reference,
	...development
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

function parent(
	path: string,
	children: Array<SidebarNavItem | null>,
	title?: string
): SidebarNavItem | null {
	const item = leaf(path, title);
	if (!item) return null;
	return { ...item, items: children.filter((c): c is SidebarNavItem => c !== null) };
}

const GET_STARTED = group('Get Started', [
	leaf('get-started/installation'),
	leaf('get-started/podman'),
	leaf('get-started/lxc-container'),
	leaf('get-started/migrate-v2'),
	leaf('get-started/preview-builds'),
	leaf('get-started/downgrading')
]);

const MANAGING_DOCKER = group('Managing Docker', [
	parent('docker/projects', [leaf('docker/git-sync'), leaf('docker/gitops-hooks')]),
	leaf('docker/containers'),
	leaf('docker/images'),
	leaf('docker/image-builds'),
	leaf('docker/volumes'),
	leaf('docker/networks'),
	leaf('docker/backups'),
	leaf('docker/auto-updates'),
	parent('docker/templates', [leaf('docker/template-registries')]),
	leaf('docker/variables'),
	leaf('docker/activity')
]);

const REMOTE = group('Remote Hosts & Swarm', [
	leaf('remote/environments'),
	parent('remote/swarm', [
		leaf('remote/swarm-cluster', 'Cluster'),
		leaf('remote/swarm-workloads', 'Workloads'),
		leaf('remote/swarm-nodes-agents', 'Nodes & Agents'),
		leaf('remote/swarm-configs-secrets', 'Configs & Secrets')
	])
]);

const ACCESS = group('Users & Access', [
	leaf('access/sso'),
	leaf('access/passkeys'),
	leaf('access/roles'),
	leaf('access/federated-credentials'),
	leaf('access/account-recovery')
]);

const SETTINGS = group('Settings & Integrations', [
	leaf('settings/appearance'),
	leaf('settings/notifications'),
	leaf('settings/mobile-app'),
	leaf('settings/gpu-monitoring'),
	leaf('settings/analytics')
]);

const NETWORKING = group('Reverse Proxy & Networking', [
	leaf('networking/reverse-proxy'),
	leaf('networking/tls'),
	leaf('networking/outbound-proxy')
]);

const SECURITY = group('Security', [
	leaf('security/vulnerability-scans'),
	leaf('security/socket-proxy'),
	leaf('security/edge-mtls'),
	leaf('security/verify-artifacts')
]);

const REFERENCE = group('Reference', [
	leaf('reference/environment-variables'),
	leaf('reference/compose-labels'),
	leaf('reference/api'),
	parent(
		'reference/cli/install',
		[leaf('reference/cli/config'), leaf('reference/cli/commands')],
		'CLI'
	)
]);

const CONTRIBUTING = group('Contributing', [
	leaf('development/contribute'),
	leaf('development/translate'),
	parent('development/buildables', [leaf('development/buildables/autologin')])
]);

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
	MANAGING_DOCKER,
	REMOTE,
	ACCESS,
	SETTINGS,
	NETWORKING,
	SECURITY,
	REFERENCE,
	CONTRIBUTING
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
