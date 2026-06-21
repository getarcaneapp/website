import { enhancedImages } from '@sveltejs/enhanced-img';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite-plus';
import Icons from 'unplugin-icons/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { mdsvexConfig } from './mdsvex.config.js';

export default defineConfig({
	staged: {
		'*': 'vp check --fix'
	},
	fmt: {
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100,
		svelte: true,
		experimentalTailwindcss: {
			stylesheet: './src/app.css',
			attributes: ['class'],
			functions: ['clsx', 'cn'],
			preserveWhitespace: true
		},
		experimentalSortPackageJson: true,
		ignorePatterns: [
			'package-lock.json',
			'pnpm-lock.yaml',
			'*.md',
			'tsconfig.json',
			'svelte.config.js',
			'src/*.json',
			'static/**'
		]
	},
	lint: {
		plugins: ['oxc', 'typescript', 'unicorn'],
		env: {
			builtin: true,
			browser: true
		},
		ignorePatterns: ['.svelte-kit/**', '.velite/**', 'build/**'],
		options: {
			reportUnusedDisableDirectives: 'error'
		},
		overrides: [
			{
				files: ['vite.config.ts', 'svelte.config.js', 'velite.config.js', 'mdsvex.config.js'],
				env: {
					node: true
				}
			},
			{
				files: ['src/routes/api/**/*.ts'],
				env: {
					node: true
				}
			}
		]
	},
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
			extensions: ['.svelte', '.md'],
			adapter: adapter({
				fallback: 'index.html',
				pages: './build'
			}),
			alias: {
				$velite: '.velite'
			}
		}),
		Icons({
			compiler: 'svelte',
			autoInstall: false
		})
	],
	server: {
		fs: {
			allow: ['..', './content']
		}
	},
	build: {
		minify: 'oxc'
	}
});
