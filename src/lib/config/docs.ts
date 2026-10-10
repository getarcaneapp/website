export const mainNavItems = [
	{ href: '/docs', label: 'Docs' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/generator', label: 'Compose Generator' },
	{ href: '/community', label: 'Community' }
];

export const DISCORD_URL = 'https://discord.gg/WyXYpdyV3Z';
export const GITHUB_REPO = 'getarcaneapp/arcane';
export const DEMO_URL = 'https://demo.getarcane.app';

type SidebarLink = string | { slug: string; label: string };
type SidebarGroup = { label: string; collapsed?: boolean; items: SidebarItem[] };
type SidebarItem =
	| SidebarLink
	| SidebarGroup
	| { label: string; link: string; attrs?: Record<string, string> };

const doc = (path: string, label?: string): SidebarLink =>
	label ? { slug: `docs/${path}`, label } : `docs/${path}`;

const parent = (label: string, path: string, children: SidebarLink[]): SidebarGroup => ({
	label,
	collapsed: true,
	items: [doc(path, 'Overview'), ...children]
});

export const docSections: { label: string; items: SidebarItem[] }[] = [
	{
		label: 'Get Started',
		items: [
			doc('get-started/installation'),
			doc('get-started/podman'),
			doc('get-started/lxc-container'),
			doc('get-started/migrate-v2'),
			doc('get-started/preview-builds'),
			doc('get-started/downgrading')
		]
	},
	{
		label: 'Managing Docker',
		items: [
			parent('Projects', 'docker/projects', [doc('docker/git-sync'), doc('docker/gitops-hooks')]),
			doc('docker/containers'),
			doc('docker/images'),
			doc('docker/image-builds'),
			doc('docker/volumes'),
			doc('docker/networks'),
			doc('docker/backups'),
			doc('docker/auto-updates'),
			parent('Templates', 'docker/templates', [doc('docker/template-registries')]),
			doc('docker/variables'),
			doc('docker/activity')
		]
	},
	{
		label: 'Remote Hosts & Swarm',
		items: [
			doc('remote/environments'),
			parent('Docker Swarm', 'remote/swarm', [
				doc('remote/swarm-cluster', 'Cluster'),
				doc('remote/swarm-workloads', 'Workloads'),
				doc('remote/swarm-nodes-agents', 'Nodes & Agents'),
				doc('remote/swarm-configs-secrets', 'Configs & Secrets')
			])
		]
	},
	{
		label: 'Users & Access',
		items: [
			doc('access/sso'),
			doc('access/passkeys'),
			doc('access/roles'),
			doc('access/federated-credentials'),
			doc('access/account-recovery')
		]
	},
	{
		label: 'Settings & Integrations',
		items: [
			doc('settings/appearance'),
			doc('settings/notifications'),
			doc('settings/mobile-app'),
			doc('settings/gpu-monitoring'),
			doc('settings/opentelemetry'),
			doc('settings/analytics')
		]
	},
	{
		label: 'Reverse Proxy & Networking',
		items: [
			doc('networking/reverse-proxy'),
			doc('networking/tls'),
			doc('networking/outbound-proxy')
		]
	},
	{
		label: 'Security',
		items: [
			doc('security/vulnerability-scans'),
			doc('security/socket-proxy'),
			doc('security/edge-mtls'),
			doc('security/verify-artifacts')
		]
	},
	{
		label: 'Reference',
		items: [
			doc('reference/environment-variables'),
			doc('reference/compose-labels'),
			doc('reference/api'),
			parent('CLI', 'reference/cli/install', [
				doc('reference/cli/config'),
				doc('reference/cli/commands')
			])
		]
	},
	{
		label: 'Contributing',
		items: [
			doc('development/contribute'),
			doc('development/translate'),
			parent('Buildables', 'development/buildables', [doc('development/buildables/autologin')])
		]
	}
];

export const sidebar: SidebarItem[] = [
	...docSections,
	{
		label: 'Community',
		items: [{ label: 'Discord', link: DISCORD_URL, attrs: { target: '_blank' } }]
	}
];

export function sectionSlugs(items: SidebarItem[]): string[] {
	return items.flatMap((item) => {
		if (typeof item === 'string') return [item];
		if ('slug' in item) return [item.slug];
		if ('items' in item) return sectionSlugs(item.items);
		return [];
	});
}
