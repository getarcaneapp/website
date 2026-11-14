import { defineConfig } from 'vite-plus';

export default defineConfig({
	staged: {
		'*': 'biome check --write --no-errors-on-unmatched --files-ignore-unknown=true'
	}
});
