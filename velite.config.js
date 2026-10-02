// @ts-check
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
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

const docker = defineCollection({
	name: 'docker',
	pattern: './docker/**/*.md',
	schema: docSchema
});

const remote = defineCollection({
	name: 'remote',
	pattern: './remote/**/*.md',
	schema: docSchema
});

const access = defineCollection({
	name: 'access',
	pattern: './access/**/*.md',
	schema: docSchema
});

const settings = defineCollection({
	name: 'settings',
	pattern: './settings/**/*.md',
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

const reference = defineCollection({
	name: 'reference',
	pattern: './reference/**/*.md',
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

const blog = defineCollection({
	name: 'blog',
	pattern: './blog/**/*.md',
	schema: s
		.object({
			title: s.string(),
			description: s.string(),
			date: s.isodate(),
			kind: s.enum(['news', 'update', 'deprecation', 'release']).default('news'),
			featured: s.boolean().default(false),
			banner: s.string().optional(),
			published: s.boolean().default(true),
			path: s.path(),
			toc: s.toc()
		})
		.strict()
		.transform((data) => {
			const segments = data.path.split('/');
			const slug = segments.slice(1).join('/') || segments[0];

			return {
				...data,
				slug,
				href: `/blog/${slug}`,
				section: 'blog',
				segments
			};
		})
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
		docker,
		remote,
		access,
		settings,
		networking,
		security,
		reference,
		development,
		changelog,
		blog,
		privacy
	},
	output: { assets: 'static' },
	complete: async ({ blog }) => {
		/** @param {unknown} value */
		const xml = (value) =>
			String(value)
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;');
		/** @param {unknown} value */
		const rfc822 = (value) => new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`).toUTCString();

		const posts = [...blog]
			.filter((post) => post.published !== false)
			.sort(
				(a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title)
			);
		const latest = posts[0]?.date ?? new Date().toISOString();
		const items = posts
			.map((post) => {
				const url = `https://getarcane.app${post.href}`;
				return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${xml(post.description)}</description>
      <category>${xml(post.kind)}</category>
    </item>`;
			})
			.join('\n');

		const dir = resolve('static');
		await mkdir(dir, { recursive: true });
		await writeFile(
			resolve(dir, 'rss.xml'),
			`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Arcane Blog</title>
    <link>https://getarcane.app/blog</link>
    <description>A home for deprecations, migrations, and other notable changes.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
${items}
  </channel>
</rss>
`
		);
	}
});
