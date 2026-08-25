import { getDoc } from '#lib/docs.js';
import {
	authentication,
	cli,
	configuration,
	customization,
	development,
	features,
	getStarted,
	guides,
	indexPage,
	networking,
	security,
	upgrade
} from '#velite/index.js';
import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

const ALL_DOCS = [
	...indexPage,
	...getStarted,
	...upgrade,
	...features,
	...customization,
	...configuration,
	...authentication,
	...networking,
	...security,
	...guides,
	...cli,
	...development
];

export const entries: EntryGenerator = () => {
	console.info('Prerendering /docs');

	// Unpublished docs are excluded here and 404'd in getDoc, so `published: false`
	// actually withholds a page instead of only hiding its sidebar entry.
	const list = ALL_DOCS.filter((doc) => doc.published !== false).map((doc) => ({ slug: doc.path }));

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
