// @ts-check
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { highlighter } from './src/lib/markdown/highlighter.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('mdsvex').MdsvexOptions} */
export const mdsvexConfig = {
	extensions: ['.md'],
	// Wraps every compiled `.md` and provides the element overrides (h1–h6, p, a,
	// blockquote callouts, lists, tables, …) via its module-script named exports.
	layout: resolve(__dirname, './src/lib/components/markdown/layout.svelte'),
	remarkPlugins: [remarkGfm],
	// rehype-slug's unified Plugin type doesn't structurally match mdsvex's re-exported
	// Plugin type (a known cross-package friction); the plugin works fine at runtime.
	rehypePlugins: /** @type {import('mdsvex').MdsvexOptions['rehypePlugins']} */ (
		/** @type {unknown} */ ([rehypeSlug])
	),
	// Fenced code is highlighted at build time with Shiki (see highlighter.js).
	highlight: {
		highlighter
	}
};
