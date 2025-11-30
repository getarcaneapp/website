import type { KnipConfig } from 'knip';
import { compile } from 'svelte/compiler';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Scan content markdown files for Svelte component imports
 * MDSX allows importing components in markdown via <script> tags
 */
function getMdsxComponentImports(contentDir: string): string[] {
	const imports = new Set<string>();

	function scanDir(dir: string) {
		const entries = readdirSync(dir);
		for (const entry of entries) {
			const fullPath = join(dir, entry);
			const stat = statSync(fullPath);
			if (stat.isDirectory()) {
				scanDir(fullPath);
			} else if (entry.endsWith('.md')) {
				const content = readFileSync(fullPath, 'utf-8');
				// Match imports from $lib/components in script tags
				const importRegex = /from\s+['"](\$lib\/components\/[^'"]+)['"]/g;
				let match;
				while ((match = importRegex.exec(content)) !== null) {
					// Convert $lib/components/foo.svelte to src/lib/components/foo.svelte
					// Also handle .js extensions -> .ts
					let importPath = match[1].replace('$lib/', 'src/lib/');
					// Handle index.js -> index.ts for TypeScript files
					importPath = importPath.replace(/\.js$/, '.ts');
					imports.add(importPath);
				}
			}
		}
	}

	try {
		scanDir(contentDir);
	} catch {
		// Content dir might not exist in some environments
	}

	return Array.from(imports);
}

// Get component imports from markdown content files
const mdsxImports = getMdsxComponentImports('./content');

const config: KnipConfig = {
	compilers: {
		svelte: (source: string) => compile(source, {}).js.code
	},
	entry: [
		// SvelteKit route files
		'src/routes/**/+*.{js,ts,svelte}',
		// Lib exports
		'src/lib/index.{js,ts}',
		// MDSX blueprint and components (used by markdown processor)
		'src/lib/components/mdsx/**/*.{svelte,ts}',
		// Config files
		'svelte.config.js',
		'vite.config.ts',
		'mdsx.config.js',
		'velite.config.js',
		// Components imported in markdown files (discovered dynamically)
		...mdsxImports
	],
	project: ['src/**/*.{js,ts,svelte}', 'src/**/*.d.ts'],
	ignore: [
		// Generated directories
		'.svelte-kit/**',
		'.velite/**'
	],
	ignoreFiles: [
		// Cloudflare worker
		'src/_worker.js',
		// Icon components (dynamically selected based on language)
		'src/lib/components/icons/**',
		// Config files used by content pages
		'src/lib/config/cli-commands.ts',
		'src/lib/config/pages/**',
		// Types (used across the project, may appear unused)
		'src/lib/types/**',
		// Hooks (may be used dynamically)
		'src/lib/hooks/**',
		// shadcn-svelte UI components - these export many unused variants by design
		'src/lib/components/ui/**',
		// Components that may not be used yet but are part of the design system
		'src/lib/components/agent-env-table.svelte',
		'src/lib/components/architecture-diagram.svelte',
		'src/lib/components/copy-button.svelte',
		'src/lib/components/preview-banner.svelte',
		'src/lib/components/table-of-contents.svelte'
	],
	ignoreExportsUsedInFile: {
		interface: true,
		type: true
	},
	ignoreDependencies: [
		// Used in mdsx.config.js but referenced as strings
		'rehype-pretty-code',
		'remark-code-import',
		'unist-builder',
		'unist-util-visit',
		// Tailwind animation classes (referenced in CSS)
		'tw-animate-css'
	]
};

export default config;
