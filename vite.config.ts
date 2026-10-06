import { defineConfig } from 'vite-plus';

export default defineConfig({
	staged: {
		'*': 'vp check --fix',
		'*.astro': 'prettier --write'
	},
	fmt: {
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100,
		svelte: true,
		experimentalTailwindcss: {
			stylesheet: './src/styles/global.css',
			attributes: ['class'],
			functions: ['clsx', 'cn'],
			preserveWhitespace: true
		},
		experimentalSortPackageJson: true,
		ignorePatterns: ['static/**', 'src/content/**', 'pnpm-lock.yaml']
	},
	lint: {
		plugins: ['oxc', 'typescript', 'unicorn'],
		env: {
			builtin: true,
			browser: true
		},
		ignorePatterns: ['.astro/**', 'dist/**'],
		options: {
			reportUnusedDisableDirectives: 'error'
		},
		overrides: [
			{
				files: ['vite.config.ts', 'astro.config.mjs'],
				env: {
					node: true
				}
			}
		]
	}
});
