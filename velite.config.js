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

const gettingStarted = defineCollection({
	name: 'gettingStarted',
	pattern: './getting-started/**/*.md',
	schema: docSchema
});

const dockerResources = defineCollection({
	name: 'dockerResources',
	pattern: './docker-resources/**/*.md',
	schema: docSchema
});

const configuration = defineCollection({
	name: 'configuration',
	pattern: './configuration/**/*.md',
	schema: docSchema
});

const remoteManagement = defineCollection({
	name: 'remoteManagement',
	pattern: './remote-management/**/*.md',
	schema: docSchema
});

const cli = defineCollection({
	name: 'cli',
	pattern: './cli/**/*.md',
	schema: docSchema
});

const guides = defineCollection({
	name: 'guides',
	pattern: './guides/**/*.md',
	schema: docSchema
});

const templates = defineCollection({
	name: 'templates',
	pattern: './templates/**/*.md',
	schema: docSchema
});

const contributing = defineCollection({
	name: 'contributing',
	pattern: './contributing/**/*.md',
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

export default defineConfig({
	root: './content',
	collections: {
		indexPage,
		gettingStarted,
		dockerResources,
		configuration,
		remoteManagement,
		cli,
		guides,
		templates,
		contributing,
		changelog,
		api
	},
	output: { assets: 'static' }
});
