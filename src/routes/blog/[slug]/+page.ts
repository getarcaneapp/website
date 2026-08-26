import { getPublishedPosts, getBlogPost } from '#lib/blog.js';
import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return getPublishedPosts().map((post) => ({ slug: post.slug }));
};

export const load: PageLoad = async ({ params }) => {
	return getBlogPost(params.slug);
};
