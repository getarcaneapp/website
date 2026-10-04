import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'> & {
	slug: string;
	href: string;
	dateYmd: string;
	dateLabel: string;
};

const postDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});

export async function getPublishedPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog', (post) => post.data.published !== false);
	return posts
		.map((post) => ({
			...post,
			slug: post.id,
			href: `/blog/${post.id}`,
			dateYmd: post.data.date.toISOString().slice(0, 10),
			dateLabel: postDateFormatter.format(post.data.date)
		}))
		.sort((a, b) => b.dateYmd.localeCompare(a.dateYmd) || b.data.title.localeCompare(a.data.title));
}

export async function getFeaturedPost(): Promise<BlogPost | undefined> {
	return (await getPublishedPosts()).find((post) => post.data.featured);
}

export function findPostNeighbors(
	posts: BlogPost[],
	slug: string
): { previous: BlogPost | null; next: BlogPost | null } {
	const idx = posts.findIndex((post) => post.slug === slug);
	if (idx === -1) return { previous: null, next: null };
	return { previous: posts[idx + 1] ?? null, next: posts[idx - 1] ?? null };
}
