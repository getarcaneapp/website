<script module>
	// mdsvex reads this module script's named exports to override the HTML
	// elements Markdown generates with these components. (`pre` is intentionally
	// omitted — fenced code is handled at build time by the Shiki highlighter.)
	export {
		a,
		blockquote,
		figcaption,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		hr,
		img,
		li,
		ol,
		p,
		strong,
		table,
		td,
		th,
		tr,
		ul
	} from './index.js';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { copyCode } from '$lib/markdown/copy-code.js';

	// mdsvex also passes frontmatter values as props; only `children` is used.
	let { children }: { children?: Snippet } = $props();
</script>

<div class="markdown" use:copyCode>
	{@render children?.()}
</div>
