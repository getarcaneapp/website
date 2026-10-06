import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';

type TocItem = NonNullable<StarlightRouteData['toc']>['items'][number];

function setTag(
	head: StarlightRouteData['head'],
	tag: 'title' | 'meta',
	key: { name?: string; property?: string },
	content: string
) {
	const existing = head.find(
		(h) =>
			h.tag === tag &&
			(tag === 'title' ||
				(key.name ? h.attrs?.name === key.name : h.attrs?.property === key.property))
	);
	if (tag === 'title') {
		if (existing) existing.content = content;
		else head.push({ tag, content });
		return;
	}
	if (existing) existing.attrs = { ...existing.attrs, content };
	else head.push({ tag, attrs: { ...key, content } });
}

function addCollapsiblesToToc(body: string, items: TocItem[]) {
	const pattern = /^## (.+)$|<Collapsible\s+id="([^"]+)"\s+title="([^"]+)"/gm;
	let parent: TocItem | undefined;
	for (const match of body.matchAll(pattern)) {
		if (match[1]) {
			const text = match[1].replace(/`/g, '').trim();
			parent = items.find((item) => item.text === text) ?? parent;
			continue;
		}
		const entry: TocItem = { depth: 3, slug: match[2], text: match[3], children: [] };
		if (parent) parent.children.push(entry);
		else items.push(entry);
	}
}

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const { head, entry, siteTitle } = route;

	if (entry.data.title.includes(siteTitle)) setTag(head, 'title', {}, entry.data.title);

	if (route.toc) route.toc.items = route.toc.items.filter((item) => item.slug !== '_top');

	if (route.toc && entry.body?.includes('<Collapsible'))
		addCollapsiblesToToc(entry.body, route.toc.items);

	if (route.id.startsWith('docs/')) {
		const crumbs = [
			{ name: siteTitle, url: '/' },
			{ name: 'Docs', url: '/docs' },
			...(route.id === 'docs' ? [] : [{ name: entry.data.title, url: `/${route.id}` }])
		];
		head.push({
			tag: 'script',
			attrs: { type: 'application/ld+json' },
			content: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: crumbs.map((crumb, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: crumb.name,
					item: new URL(crumb.url, context.site).href
				}))
			})
		});
	}

	for (const tag of head) {
		if (tag.tag === 'link' && tag.attrs?.rel === 'canonical' && typeof tag.attrs.href === 'string')
			tag.attrs.href = tag.attrs.href.replace(/\.html$/, '');
		if (
			tag.tag === 'meta' &&
			tag.attrs?.property === 'og:url' &&
			typeof tag.attrs.content === 'string'
		)
			tag.attrs.content = tag.attrs.content.replace(/\.html$/, '');
	}

	if (route.id === '404') setTag(head, 'meta', { name: 'robots' }, 'noindex');
});
