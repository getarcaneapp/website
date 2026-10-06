type HeadTag = {
	tag: 'meta' | 'link' | 'script';
	attrs: Record<string, string | boolean>;
	content?: string;
};

export const PLAUSIBLE_SRC = 'https://plausible.ofkm.us/js/pa-IsfcMHM5HU-XgkIZ_1O28.js';
export const PLAUSIBLE_INIT =
	'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();';

export const sharedHead = (site: URL | string): HeadTag[] => [
	{ tag: 'meta', attrs: { property: 'og:image', content: new URL('/img/logo.svg', site).href } },
	{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
	{
		tag: 'link',
		attrs: { rel: 'alternate', type: 'application/rss+xml', title: 'Arcane Blog', href: '/rss.xml' }
	},
	{
		tag: 'link',
		attrs: {
			rel: 'preload',
			href: '/fonts/Geist/geist.woff2',
			as: 'font',
			type: 'font/woff2',
			crossorigin: 'anonymous'
		}
	},
	{ tag: 'script', attrs: { async: true, src: PLAUSIBLE_SRC } },
	{ tag: 'script', attrs: {}, content: PLAUSIBLE_INIT }
];
