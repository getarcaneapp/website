/*
	Installed from @ieedan/shadcn-svelte-extras
*/

import { createHighlighterCore, type ThemeRegistration } from 'shiki/core';
// Follows the best practices established in https://shiki.matsu.io/guide/best-performance
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const bundledLanguages = {
	bash: () => import('@shikijs/langs/bash'),
	diff: () => import('@shikijs/langs/diff'),
	dotenv: () => import('@shikijs/langs/dotenv'),
	ini: () => import('@shikijs/langs/ini'),
	javascript: () => import('@shikijs/langs/javascript'),
	json: () => import('@shikijs/langs/json'),
	svelte: () => import('@shikijs/langs/svelte'),
	typescript: () => import('@shikijs/langs/typescript'),
	yaml: () => import('@shikijs/langs/yaml')
};

/** The languages configured for the highlighter */
export type SupportedLanguage = keyof typeof bundledLanguages;

/**
 * github-light-default with comments darkened from #6e7781 (4.28:1 on the light code
 * background) to #57606a (6.0:1). Every other token color already passes 4.5:1.
 */
async function lightTheme(): Promise<ThemeRegistration> {
	const { default: theme } = await import('@shikijs/themes/github-light-default');
	return {
		...theme,
		tokenColors: theme.tokenColors?.map((rule) =>
			rule.settings.foreground?.toLowerCase() === '#6e7781'
				? { ...rule, settings: { ...rule.settings, foreground: '#57606a' } }
				: rule
		)
	};
}

/** A preloaded highlighter instance. */
export const highlighter = createHighlighterCore({
	themes: [lightTheme(), import('@shikijs/themes/github-dark-default')],
	langs: Object.values(bundledLanguages),
	engine: createJavaScriptRegexEngine()
});
