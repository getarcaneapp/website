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

const gettingStarted = defineCollection({
	name: 'gettingStarted',
	pattern: './*.md',
	schema: docSchema
});

const userManagement = defineCollection({
	name: 'userManagement',
	pattern: './users/**/*.md',
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

export default defineConfig({
	root: './content',
	collections: {
		gettingStarted,
		userManagement,
		features,
		guides,
		development
	},
	output: { assets: 'static' }
});
