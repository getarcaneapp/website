import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MdsvexOptions } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { remarkCallouts } from './src/lib/markdown/callouts.js';
import { highlighter } from './src/lib/markdown/highlighter.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const mdsvexConfig: MdsvexOptions = {
	extensions: ['.md'],
	// Wraps every compiled `.md` and provides the element overrides (h1–h6, p, a,
	// blockquote callouts, lists, tables, …) via its module-script named exports.
	layout: resolve(__dirname, './src/lib/components/markdown/layout.svelte'),
	// Current unified plugin types don't structurally match the older Plugin type mdsvex
	// re-exports (a known cross-package friction); the plugins work fine at runtime.
	remarkPlugins: [remarkGfm, remarkCallouts] as unknown as MdsvexOptions['remarkPlugins'],
	rehypePlugins: [rehypeSlug] as unknown as MdsvexOptions['rehypePlugins'],
	// Fenced code is highlighted at build time with Shiki (see highlighter.ts).
	highlight: {
		highlighter
	}
};
