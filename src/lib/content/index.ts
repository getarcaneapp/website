export type DocMetadata = {
	title: string;
	description: string;
	path: string;
	published?: boolean;
};

export const gettingStarted: DocMetadata[] = [
	{
		title: 'Arcane Setup Guide',
		description: 'Get Arcane running fast with Docker Compose.',
		path: 'setup'
	},
	{
		title: 'Configuration',
		description: 'Configure Arcane for your environment',
		path: 'configuration'
	}
];

export const userManagement: DocMetadata[] = [
	{
		title: 'Local Users',
		description: 'Managing local users in Arcane',
		path: 'users/local'
	},
	{
		title: 'OIDC Single Sign-On',
		description: 'Configure OIDC SSO for Arcane',
		path: 'users/sso'
	}
];

export const features: DocMetadata[] = [
	{
		title: 'Containers',
		description: 'Managing Docker containers',
		path: 'features/containers'
	},
	{
		title: 'Environments',
		description: 'Environment management',
		path: 'features/environments'
	},
	{
		title: 'Images',
		description: 'Docker image management',
		path: 'features/images'
	},
	{
		title: 'Networks',
		description: 'Docker network management',
		path: 'features/networks'
	},
	{
		title: 'Compose Projects',
		description: 'Docker Compose project management',
		path: 'features/compose'
	},
	{
		title: 'Volumes',
		description: 'Docker volume management',
		path: 'features/volumes'
	}
];

export const guides: DocMetadata[] = [
	{
		title: 'Troubleshooting',
		description: 'Common issues and solutions',
		path: 'guides/troubleshooting'
	},
	{
		title: 'Auto Updates',
		description: 'Configure automatic updates',
		path: 'guides/updates'
	},
	{
		title: 'Container Registries',
		description: 'Working with container registries',
		path: 'guides/registries'
	}
];

export const development: DocMetadata[] = [
	{
		title: 'Contributing',
		description:
			'Learn how to contribute to the Arcane project, from reporting bugs to submitting code.',
		path: 'dev/contribute'
	},
	{
		title: 'Building from Source',
		description: 'Build Arcane from source code',
		path: 'dev/building'
	}
];

export const allDocs = [
	...gettingStarted,
	...userManagement,
	...features,
	...guides,
	...development
];
