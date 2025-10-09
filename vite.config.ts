import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ['@lucide/svelte']
	},
	plugins: [tailwindcss(), enhancedImages(), sveltekit()],
	server: {
		fs: {
			allow: ['..', './content']
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					icons: ['@lucide/svelte']
				}
			}
		}
	}
});
