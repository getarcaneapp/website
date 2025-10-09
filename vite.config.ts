import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ['@lucide/svelte'],
	},
	plugins: [tailwindcss(), enhancedImages(), sveltekit()],
	server: {
		fs: {
			allow: ['..', './content'],
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					icons: ['@lucide/svelte'],
				},
			},
		},
	},
});
