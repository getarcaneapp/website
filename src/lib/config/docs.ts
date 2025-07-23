export const mainNavItems = [
	{ href: '/docs', label: 'Docs' },
	{ href: '/generator', label: 'Compose Generator' }
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

export const SidebarNavItems: SidebarNavItem[] = [
	{
		title: 'Get Started',
		items: [
			{ title: 'Installation', href: '/docs/setup', items: [] },
			{ title: 'Configuration', href: '/docs/configuration', items: [] }
			// { title: 'Changelog', href: '/changelog', items: [] }
		]
	},
	{
		title: 'User Management',
		items: [
			{ title: 'Local Users', href: '/docs/users/local', items: [] },
			{ title: 'OIDC Single Sign-On', href: '/docs/users/sso', items: [] }
		]
	},
	{
		title: 'Features',
		items: [
			{ title: 'Compose Projects', href: '/docs/features/compose', items: [] },
			{ title: 'Containers', href: '/docs/features/containers', items: [] },
			{ title: 'Environments', href: '/docs/features/environments', items: [] },
			{ title: 'Images', href: '/docs/features/images', items: [] },
			{ title: 'Networks', href: '/docs/features/networks', items: [] },
			{ title: 'Volumes', href: '/docs/features/volumes', items: [] }
		]
	},
	// {
	// 	title: 'Guides',
	// 	items: [
	// 		{ title: 'Troubleshooting', href: '/docs/guides/troubleshooting', items: [] },
	// 		{ title: 'Auto Updates', href: '/docs/guides/updates', items: [] },
	// 		{ title: 'Container Registries', href: '/docs/guides/registries', items: [] }
	// 	]
	// },
	{
		title: 'Templates',
		items: [
			{ title: 'Using Templates', href: '/docs/templates', items: [] },
			{ title: 'Template Registries', href: '/docs/templates/registries', items: [] }
		]
	},
	{
		title: 'Development',
		items: [{ title: 'Contributing', href: '/docs/dev/contribute', items: [] }]
	}
];
