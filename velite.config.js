// @ts-check
import { defineCollection, defineConfig, s } from 'velite';

const docSchema = s
	.object({
		title: s.string(),
		description: s.string(),
		path: s.path(),
		navLabel: s.string().optional(),
		links: s
			.object({
				doc: s.string().optional(),
				api: s.string().optional(),
				source: s.string().optional()
			})
			.optional(),
		component: s.boolean().default(false),
		toc: s.toc()
	})
	.transform((data) => {
		return {
			...data,
			slug: data.path.split('/').slice(1).join('/'),
			slugFull: `/${data.path}`
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
