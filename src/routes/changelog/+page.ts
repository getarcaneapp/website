import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { changelog as changelogMeta } from '$velite/index.js';
import type { PageLoad } from './$types.js';

type DocModule = { default: Component; metadata?: Record<string, any> };

const modules = import.meta.glob<DocModule>('/content/changelog/*.md');

export const prerender = true;

export const load: PageLoad = async () => {
	const meta = changelogMeta?.[0];
	if (!meta) throw error(404, 'Changelog not found');

	const keys = Object.keys(modules).sort().reverse();
	if (keys.length === 0) throw error(404, 'Changelog modules not found');

	const docs = await Promise.all(keys.map((key) => modules[key]()));
	const toc = docs.flatMap((doc) => doc.metadata?.toc ?? []);

	return {
		components: docs.map((doc) => doc.default),
		metadata: {
			...meta,
			path: 'changelog',
			title: meta.title,
			description: meta.description,
			toc
		}
	};
};
