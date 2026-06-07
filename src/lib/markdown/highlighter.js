// @ts-check
/**
 * Build-time Shiki highlighter for mdsvex fenced code blocks.
 *
 * mdsvex routes fenced code through `highlight.highlighter` (it ties Svelte
 * escaping to this step and emits a raw `{@html}` node, which bypasses the
 * layout's element overrides — so the markdown `pre` component can't be used).
 * We mirror the runtime highlighter in `src/lib/components/ui/code` (same themes
 * and `pre` transformer) so build-time code blocks match component-rendered code.
 * The copy button is attached at runtime by the `copyCode` action in layout.svelte.
 */
import { escapeSvelte } from 'mdsvex';
import { createHighlighterCore } from 'shiki/core';
// Follows the best practices in https://shiki.matsu.io/guide/best-performance
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const bundledLanguages = {
	apache: () => import('@shikijs/langs/apache'),
	bash: () => import('@shikijs/langs/bash'),
	diff: () => import('@shikijs/langs/diff'),
	docker: () => import('@shikijs/langs/docker'),
	javascript: () => import('@shikijs/langs/javascript'),
	json: () => import('@shikijs/langs/json'),
	nginx: () => import('@shikijs/langs/nginx'),
	svelte: () => import('@shikijs/langs/svelte'),
	typescript: () => import('@shikijs/langs/typescript'),
	yaml: () => import('@shikijs/langs/yaml')
};

/** Fenced-block languages used in content that map onto a bundled grammar. */
const aliases = /** @type {const} */ ({
	dockerfile: 'docker',
	nginxconf: 'nginx',
	env: 'bash',
	dotenv: 'bash',
	sh: 'bash',
	shell: 'bash',
	zsh: 'bash',
	yml: 'yaml',
	ts: 'typescript',
	js: 'javascript'
});

/** @type {ReturnType<typeof createHighlighterCore> | undefined} */
let highlighterPromise;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [
				import('@shikijs/themes/github-light-default'),
				import('@shikijs/themes/github-dark-default')
			],
			langs: Object.values(bundledLanguages),
			engine: createJavaScriptRegexEngine()
		});
	}
	return highlighterPromise;
}

/**
 * mdsvex highlighter. Returns Svelte markup: the highlighted HTML is escaped
 * for Svelte and embedded in an `{@html}` expression inside a `.code-block`
 * container that the `copyCode` action enhances with a copy button.
 *
 * @param {string} code raw code from the fenced block
 * @param {string | null} [lang] language id from the fence (may be empty/null)
 * @returns {Promise<string>}
 */
export async function highlighter(code, lang) {
	const hl = await getHighlighter();
	const requested = (lang || '').toLowerCase();
	const resolved = aliases[/** @type {keyof typeof aliases} */ (requested)] ?? requested;
	// 'text' is a built-in no-op grammar — safe fallback for unknown languages.
	const useLang = hl.getLoadedLanguages().includes(resolved) ? resolved : 'text';

	const html = hl.codeToHtml(code, {
		lang: useLang,
		themes: {
			light: 'github-light-default',
			dark: 'github-dark-default'
		},
		transformers: [
			{
				pre(node) {
					// Drop Shiki's inline background so the theme CSS controls it, and turn
					// on line numbers (matches Code.Root's default of hideLines === false).
					node.properties.style = '';
					node.properties.class = `${node.properties.class ?? ''} line-numbers`.trim();
					return node;
				}
			}
		]
	});

	return `<div class="code-block">{@html \`${escapeSvelte(html)}\`}</div>`;
}
