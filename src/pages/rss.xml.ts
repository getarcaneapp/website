import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/blog';

export const GET: APIRoute = async (context) => {
	const posts = await getPublishedPosts();
	return rss({
		title: 'Arcane Blog',
		description: 'A home for deprecations, migrations, and other notable changes.',
		site: context.site ?? 'https://getarcane.app',
		customData: '<language>en-us</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			link: post.href,
			pubDate: post.data.date,
			description: post.data.description,
			categories: [post.data.kind]
		}))
	});
};
