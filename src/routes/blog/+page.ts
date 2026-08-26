import { getPublishedPosts } from '#lib/blog.js';
import type { PageLoad } from './$types.js';

export const prerender = true;

export const load: PageLoad = () => {
	return {
		posts: getPublishedPosts()
	};
};
