import type { AstroIntegration } from 'astro';
import { calloutsPlugin } from './callouts';
import { changelogPlugins } from './changelog';

export const arcaneMarkdown = (): AstroIntegration => ({
	name: 'arcane-markdown',
	hooks: {
		'astro:config:setup': ({ config }) => {
			const options = config.markdown.processor?.options as
				| { mdastPlugins?: unknown[] }
				| undefined;
			if (!options?.mdastPlugins)
				throw new Error('Arcane Markdown plugins need the Satteri Markdown processor');
			options.mdastPlugins.push(calloutsPlugin, ...changelogPlugins);
		}
	}
});
