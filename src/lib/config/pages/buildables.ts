import type { BuildableConfig } from '#lib/types/buildable.type.js';

export const buildables: BuildableConfig[] = [
	{
		name: 'Autologin',
		feature: 'autologin',
		description: 'Automatically sign in using build-time enabled credentials.',
		docsHref: '/docs/development/buildables/autologin',
		source: 'Official',
		envVars: ['ARCANE_AUTO_LOGIN_USERNAME', 'ARCANE_AUTO_LOGIN_PASSWORD']
	}
];
