export const mainNavItems = [
	// { href: '/docs', label: 'Docs' }
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
			{ title: 'Introduction', href: '/', items: [] },
			{ title: 'Installation', href: '/docs/setup', items: [] },
			{ title: 'Configuration', href: '/docs/configuration', items: [] },
			{ title: 'Changelog', href: '/changelog', items: [] }
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
			{ title: 'Accordion', href: '/docs/accordion', items: [] },
			{ title: 'Alert Dialog', href: '/docs/alert-dialog', items: [] },
			{ title: 'Alert', href: '/docs/alert', items: [] },
			{ title: 'Aspect Ratio', href: '/docs/aspect-ratio', items: [] },
			{ title: 'Avatar', href: '/docs/avatar', items: [] },
			{ title: 'Badge', href: '/docs/badge', items: [] }
		]
	}
];
