import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { api as apiMeta } from '$velite/index.js';
import type { PageLoad } from './$types.js';

type DocModule = { default: Component; metadata?: Record<string, any> };

const modules = import.meta.glob<DocModule>('/content/**/*.md');

function transformPath(p: string): string {
	return p
		.replace(/\\/g, '/')
		.replace(/^.*\/content\//, '')
		.replace(/\.md$/, '')
		.replace(/\/index$/, '')
		.trim();
}

export const prerender = true;

export const load: PageLoad = async () => {
	const meta = apiMeta?.[0];
	if (!meta) throw error(404, 'API reference not found');

	const key = Object.keys(modules).find((k) => transformPath(k) === 'api');
	if (!key) throw error(404, 'API module not found');

	const mod = await modules[key]();
	const fm = mod.metadata ?? {};

	return {
		component: mod.default,
		metadata: {
			...meta,
			...fm,
			path: 'api',
			title: fm.title ?? meta.title,
			description: fm.description ?? meta.description,
			toc: fm.toc ?? meta.toc ?? []
		}
	};
};
