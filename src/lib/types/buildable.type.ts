export type BuildableConfig = {
	name: string;
	feature: string;
	description: string;
	docsHref: string;
	source: 'Official' | 'Community';
	sourceHref?: string;
	envVars?: string[];
};
