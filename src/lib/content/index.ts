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
		title: 'Compose Projects',
		description:
			'Learn how to manage Docker Compose projects with Arcane - create, edit, start, stop, and deploy multi-service applications.',
		path: 'features/compose'
	},
	{
		title: 'Containers',
		description:
			'Learn how to manage Docker containers with Arcane - create, start, stop, inspect, and remove containers with ease.',
		path: 'features/containers'
	},
	{
		title: 'Environments',
		description:
			'Learn how to set up and manage remote Docker hosts using the Arcane agent for centralized container management.',
		path: 'features/environments'
	},
	{
		title: 'Images',
		description:
			'Learn how to manage Docker images with Arcane - view, pull, inspect, remove, and prune images efficiently.',
		path: 'features/images'
	},
	{
		title: 'Networks',
		description: 'Learn how to manage Docker networks with Arcane - create, inspect, and remove networks with ease.',
		path: 'features/networks'
	},
	{
		title: 'Volumes',
		description: 'Learn how to manage Docker volumes with Arcane - create, view, and remove persistent data volumes.',
		path: 'features/volumes'
	}
];

// export const guides: DocMetadata[] = [
// 	{
// 		title: 'Troubleshooting',
// 		description: 'Common issues and solutions',
// 		path: 'guides/troubleshooting'
// 	},
// 	{
// 		title: 'Auto Updates',
// 		description: 'Configure automatic updates',
// 		path: 'guides/updates'
// 	},
// 	{
// 		title: 'Container Registries',
// 		description: 'Working with container registries',
// 		path: 'guides/registries'
// 	}
// ];

export const development: DocMetadata[] = [
	{
		title: 'Contributing',
		description: 'Learn how to contribute to the Arcane project, from reporting bugs to submitting code.',
		path: 'dev/contribute'
	}
];

export const templates: DocMetadata[] = [
	{
		title: 'Using Templates',
		description: 'Learn how to use templates in Arcane for faster development.',
		path: 'templates'
	},
	{
		title: 'Template Registries',
		description: 'Learn how to create and manage template registries in Arcane.',
		path: 'templates/registries'
	}
];

export const indexPage: DocMetadata[] = [
	{
		title: 'Documentation',
		description:
			'Welcome to the Arcane documentation! Here you will find everything you need to get started with Docker container management using Arcane.',
		path: 'index'
	}
];

export const allDocs = [
	...indexPage,
	...gettingStarted,
	...userManagement,
	...features,
	// ...guides,
	...templates,
	...development
];
