import { getDoc } from '$lib/docs.js';
import {
	configuration,
	development,
	features,
	guides,
	indexPage,
	setup,
	templates,
} from '$velite/index.js';
import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

const ALL_DOCS = [
	...indexPage,
	...setup,
	...configuration,
	...features,
	...guides,
	...templates,
	...development,
];

export const entries: EntryGenerator = () => {
	console.info('Prerendering /docs');

	const list = ALL_DOCS.map((doc) => ({ slug: doc.path }));

	// Ensure /docs root works by aliasing to the index page
	if (!list.find((e) => e.slug === 'index')) {
		list.push({ slug: 'index' });
	}

	return list;
};

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug === '' ? 'index' : params.slug;
	const doc = await getDoc(slug);
	return doc;
};
