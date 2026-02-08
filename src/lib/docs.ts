import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import {
	cli,
	configuration,
	development,
	features,
	guides,
	indexPage,
	setup,
	templates
} from '$velite/index.js';

type CollectionDoc = (typeof indexPage)[number];

const allDocs: CollectionDoc[] = [
	...indexPage,
	...setup,
	...configuration,
	...features,
	...guides,
	...development,
	...templates,
	...cli
];

interface DocModule {
	default: Component;
	metadata?: Record<string, any>;
}

type DocResolver = () => Promise<DocModule>;
export type DocMetadata = CollectionDoc & Record<string, any>;

function transformPath(path: string): string {
	return path
		.replace(/\\/g, '/')
		.replace(/^.*\/content\//, '')
		.replace(/\.md$/, '')
		.replace(/\/index$/, '')
		.trim();
}

function getDocMetadata(slug: string): CollectionDoc | undefined {
	const clean = slug.replace(/^\/+/, '');
	return (
		allDocs.find((d) => d.path === clean) ||
		allDocs.find((d) => (d as any).slug === clean) ||
		allDocs.find((d) => (d as any).slug?.replace(/^\/+/, '') === clean)
	);
}

const modules = import.meta.glob<DocModule>('/content/**/*.md');

function resolveModule(slug: string): DocResolver | undefined {
	const key = Object.keys(modules).find((k) => transformPath(k) === slug);
	return key ? (modules[key] as DocResolver) : undefined;
}

export async function getDoc(
	_slug: string
): Promise<{ component: Component; metadata: DocMetadata }> {
	const slug = _slug === '' ? 'index' : _slug;

	const veliteMeta = getDocMetadata(slug);
	const resolver = resolveModule(slug);

	if (!veliteMeta || !resolver) {
		error(404, 'Could not find the documentation page.');
	}

	const mod = await resolver();
	const fm = mod.metadata || {};

	const metadata: DocMetadata = {
		...veliteMeta,
		...fm,
		title: fm.title ?? veliteMeta.title,
		description: fm.description ?? veliteMeta.description,
		path: veliteMeta.path,
		slug: (veliteMeta as any).slug ?? slug,
		section: (veliteMeta as any).section,
		segments: (veliteMeta as any).segments,
		published: fm.published ?? (veliteMeta as any).published ?? true,
		toc: fm.toc ?? (veliteMeta as any).toc
	};

	return {
		component: mod.default,
		metadata
	};
}
