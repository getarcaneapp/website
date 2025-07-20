import { getDoc } from '$lib/docs.js';
import { allDocs } from '$lib/content/index.js';
import type { EntryGenerator, PageLoad } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = () => {
	console.info('Prerendering /docs');

	// Generate entries from the metadata index
	const entries = allDocs.map((doc) => ({ slug: doc.path }));

	// Add empty slug for /docs root
	entries.push({ slug: 'index' });

	return entries;
};

export const load: PageLoad = async ({ params }) => {
	const doc = await getDoc(params.slug);
	return doc;
};
