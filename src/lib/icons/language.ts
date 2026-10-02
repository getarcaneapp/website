import {
	CssBrandIcon,
	FileIcon,
	JsonBrandIcon,
	SvelteBrandIcon,
	TypeScriptBrandIcon
} from './index.js';

/** Icon shown next to a code block's filename, picked from its language. */
export function getIconForLanguageExtension(language: string) {
	switch (language) {
		case 'svelte':
			return SvelteBrandIcon;
		case 'json':
			return JsonBrandIcon;
		case 'css':
			return CssBrandIcon;
		case 'ts':
		case 'js':
		case 'typescript':
			return TypeScriptBrandIcon;
		default:
			return FileIcon;
	}
}
