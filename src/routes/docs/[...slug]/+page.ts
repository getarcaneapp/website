import { getDoc } from '$lib/docs.js';
import {
	cli,
	configuration,
	contributing,
	dockerResources,
	gettingStarted,
	guides,
	indexPage,
	remoteManagement,
	templates,
} from '$velite/index.js';
import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

const ALL_DOCS = [
	...indexPage,
	...gettingStarted,
	...dockerResources,
	...configuration,
	...remoteManagement,
	...cli,
	...guides,
	...templates,
	...contributing,
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
