<script module>
	export {
		a,
		blockquote,
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
		pre,
		strong,
		table,
		td,
		th,
		tr,
		ul,
		figcaption
	} from './index.js';
</script>

<script lang="ts">
	let { frontmatter, children } = $props();
</script>

<!-- No head tags here - let the page component handle SEO -->

<div class="mdsx">
	{@render children()}
</div>
