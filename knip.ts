import type { KnipConfig } from 'knip';
import { compile } from 'svelte/compiler';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Scan content markdown files for Svelte component imports
 * MDSX allows importing components in markdown via <script> tags
 */
function resolveMdsxImport(importPath: string): string | null {
	const resolvedImport = importPath.replace('$lib/', 'src/lib/');
	const candidates = [
		resolvedImport.replace(/\.js$/, '.ts'),
		resolvedImport.replace(/\.js$/, '.svelte'),
		resolvedImport,
		`${resolvedImport}.ts`,
		`${resolvedImport}.js`,
		`${resolvedImport}.svelte`,
		`${resolvedImport}.svelte.ts`,
		`${resolvedImport}.svelte.js`,
		join(resolvedImport, 'index.ts'),
		join(resolvedImport, 'index.js'),
		join(resolvedImport, 'index.svelte')
	];

	for (const candidate of candidates) {
		if (existsSync(candidate) && statSync(candidate).isFile()) {
			return candidate;
		}
	}

	return null;
}

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
				// Match imports from $lib in script tags so directory imports resolve too
				const importRegex = /from\s+['"](\$lib\/[^'"]+)['"]/g;
				let match;
				while ((match = importRegex.exec(content)) !== null) {
					const importPath = resolveMdsxImport(match[1]);
					if (importPath) imports.add(importPath);
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
		svelte: (source: string, filename: string) => compile(source, { filename }).js.code
	},
	entry: [
		// SvelteKit route files
		'src/routes/**/+*.{js,ts,svelte}',
		// Lib exports
		'src/lib/index.{js,ts}',
		// MDSX blueprint and components (used by markdown processor)
		'src/lib/components/mdsx/**/*.{svelte,ts}',
		// Config files
		'mdsx.config.js',
		'velite.config.js',
		// Components imported in markdown files (discovered dynamically)
		...mdsxImports
	],
	project: ['src/**/*.{js,ts,svelte}', 'src/**/*.d.ts'],
	ignoreFiles: [
		// Icon components (dynamically selected based on language)
		'src/lib/components/icons/**',
		// Types (used across the project, may appear unused)
		'src/lib/types/**',
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
	ignoreIssues: {
		// shadcn-style barrels intentionally re-export more than the app currently consumes
		'src/lib/components/ui/**': ['exports', 'types'],
		// Public-ish helper exports used by conventions/content patterns can look unused to Knip
		'src/lib/components/command-search/index.ts': ['exports'],
		'src/lib/config/docs.ts': ['exports'],
		'src/lib/hooks/use-toc.svelte.ts': ['exports'],
		'src/lib/types/sbom.type.ts': ['exports', 'types'],
		'src/lib/utils.ts': ['types'],
		'src/lib/utils/utils.ts': ['types']
	},
	ignoreBinaries: [
		// Invoked through npx in preinstall
		'only-allow'
	],
	ignoreDependencies: [
		// Used in mdsx.config.js but referenced as strings
		'rehype-pretty-code',
		'remark-code-import',
		'unist-builder',
		'unist-util-visit',
		// Editor/formatting integration
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss',
		// Tailwind animation classes (referenced in CSS)
		'tw-animate-css'
	]
};

export default config;
