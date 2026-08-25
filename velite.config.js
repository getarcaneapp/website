// @ts-check
import { defineCollection, defineConfig, s } from 'velite';

const docSchema = s
	.object({
		title: s.string(),
		description: s.string(),
		path: s.path(),
		published: s.boolean().default(true),
		toc: s.toc()
	})
	.strict()
	.transform((data) => {
		const segments = data.path.split('/');

		return {
			...data,
			slug: segments.join('/'),
			section: segments[0],
			segments
		};
	});

const indexPage = defineCollection({
	name: 'indexPage',
	pattern: './index.md',
	schema: docSchema
});

const getStarted = defineCollection({
	name: 'getStarted',
	pattern: './get-started/**/*.md',
	schema: docSchema
});

const upgrade = defineCollection({
	name: 'upgrade',
	pattern: './upgrade/**/*.md',
	schema: docSchema
});

const features = defineCollection({
	name: 'features',
	pattern: './features/**/*.md',
	schema: docSchema
});

const customization = defineCollection({
	name: 'customization',
	pattern: './customization/**/*.md',
	schema: docSchema
});

const configuration = defineCollection({
	name: 'configuration',
	pattern: './configuration/**/*.md',
	schema: docSchema
});

const authentication = defineCollection({
	name: 'authentication',
	pattern: './authentication/**/*.md',
	schema: docSchema
});

const networking = defineCollection({
	name: 'networking',
	pattern: './networking/**/*.md',
	schema: docSchema
});

const security = defineCollection({
	name: 'security',
	pattern: './security/**/*.md',
	schema: docSchema
});

const guides = defineCollection({
	name: 'guides',
	pattern: './guides/**/*.md',
	schema: docSchema
});

const cli = defineCollection({
	name: 'cli',
	pattern: './cli/**/*.md',
	schema: docSchema
});

const development = defineCollection({
	name: 'development',
	pattern: './development/**/*.md',
	schema: docSchema
});

const changelog = defineCollection({
	name: 'changelog',
	pattern: './changelog.md',
	schema: docSchema
});

const api = defineCollection({
	name: 'api',
	pattern: './api.md',
	schema: docSchema
});

const privacy = defineCollection({
	name: 'privacy',
	pattern: './privacy.md',
	schema: docSchema
});

export default defineConfig({
	root: './content',
	collections: {
		indexPage,
		getStarted,
		upgrade,
		features,
		customization,
		configuration,
		authentication,
		networking,
		security,
		guides,
		cli,
		development,
		changelog,
		api,
		privacy
	},
	output: { assets: 'static' }
});
