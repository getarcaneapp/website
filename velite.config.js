// @ts-check
import { defineCollection, defineConfig, s } from 'velite';

const docSchema = s
	.object({
		title: s.string(),
		description: s.string(),
		path: s.path(),
		published: s.boolean().default(true),
		order: s.number().optional(),
		toc: s.toc()
	})
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

const setup = defineCollection({
	name: 'setup',
	pattern: './setup/**/*.md',
	schema: docSchema
});

const configuration = defineCollection({
	name: 'configuration',
	pattern: './configuration/**/*.md',
	schema: docSchema
});

const features = defineCollection({
	name: 'features',
	pattern: './features/**/*.md',
	schema: docSchema
});

const guides = defineCollection({
	name: 'guides',
	pattern: './guides/**/*.md',
	schema: docSchema
});

const development = defineCollection({
	name: 'development',
	pattern: './dev/**/*.md',
	schema: docSchema
});

const templates = defineCollection({
	name: 'templates',
	pattern: ['./templates.md', './templates/**/*.md'],
	schema: docSchema
});

const changelog = defineCollection({
	name: 'changelog',
	pattern: './changelog.md',
	schema: docSchema
});

export default defineConfig({
	root: './content',
	collections: {
		indexPage,
		setup,
		configuration,
		features,
		guides,
		development,
		templates,
		changelog
	},
	output: { assets: 'static' }
});
