import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { blog } from '#velite/index.js';

export type BlogPost = (typeof blog)[number] & { dateLabel: string };

function toPlainDate(value: string): Temporal.PlainDate {
	return Temporal.PlainDate.from(value.slice(0, 10));
}

function toYmd(value: string): string {
	return toPlainDate(value).toString();
}

function formatPostDate(value: string): string {
	return toPlainDate(value).toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

function byDateDesc(a: BlogPost, b: BlogPost) {
	return (
		Temporal.PlainDate.compare(toPlainDate(b.date), toPlainDate(a.date)) ||
		b.title.localeCompare(a.title)
	);
}

interface DocModule {
	default: Component;
	metadata?: Record<string, unknown>;
}

type DocResolver = () => Promise<DocModule>;

const modules = import.meta.glob<DocModule>('/content/blog/**/*.md');

export function getPublishedPosts(): BlogPost[] {
	return [...blog]
		.filter((post) => post.published !== false)
		.map((post) => ({
			...post,
			date: toYmd(post.date),
			dateLabel: formatPostDate(post.date)
		}))
		.sort(byDateDesc);
}

export function getLatestPost(): BlogPost | undefined {
	return getPublishedPosts()[0];
}

export function getFeaturedPost(): BlogPost | undefined {
	return getPublishedPosts().find((post) => post.featured);
}

function resolveModule(slug: string): DocResolver | undefined {
	const key = Object.keys(modules).find((path) => {
		const cleaned = path
			.replace(/\\/g, '/')
			.replace(/^.*\/content\//, '')
			.replace(/\.md$/, '');
		return cleaned === `blog/${slug}`;
	});
	return key ? (modules[key] as DocResolver) : undefined;
}

export function findPostNeighbors(slug: string): {
	previous: BlogPost | null;
	next: BlogPost | null;
} {
	const posts = getPublishedPosts();
	const idx = posts.findIndex((post) => post.slug === slug);
	if (idx === -1) return { previous: null, next: null };
	return {
		previous: posts[idx + 1] ?? null,
		next: posts[idx - 1] ?? null
	};
}

export async function getBlogPost(slug: string): Promise<{
	component: Component;
	metadata: BlogPost;
}> {
	const meta = getPublishedPosts().find((post) => post.slug === slug);
	const resolver = resolveModule(slug);

	if (!meta || !resolver) {
		error(404, 'Could not find the blog post.');
	}

	const mod = await resolver();

	return {
		component: mod.default,
		metadata: meta
	};
}
