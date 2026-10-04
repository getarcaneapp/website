import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	blog: defineCollection({
		loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			date: z.coerce.date(),
			kind: z.enum(['news', 'update', 'deprecation', 'release']).default('news'),
			featured: z.boolean().default(false),
			banner: z.string().optional(),
			published: z.boolean().default(true)
		})
	}),
	changelog: defineCollection({
		loader: glob({ pattern: '*.md', base: './src/content/changelog' }),
		schema: z.object({ title: z.string(), description: z.string().optional() })
	})
};
