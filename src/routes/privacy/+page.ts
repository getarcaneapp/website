import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { privacy as privacyMeta } from '$velite/index.js';
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
	const meta = privacyMeta?.[0];
	if (!meta) throw error(404, 'Privacy Policy not found');

	const key = Object.keys(modules).find((k) => transformPath(k) === 'privacy');
	if (!key) throw error(404, 'Privacy Policy module not found');

	const mod = await modules[key]();
	const fm = mod.metadata ?? {};

	return {
		component: mod.default,
		metadata: {
			...meta,
			...fm,
			path: 'privacy',
			title: fm.title ?? meta.title,
			description: fm.description ?? meta.description,
			toc: fm.toc ?? meta.toc ?? []
		}
	};
};
