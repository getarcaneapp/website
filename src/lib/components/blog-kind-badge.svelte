<script lang="ts">
	import type { BlogPost } from '#lib/blog.js';

	let { kind }: { kind: BlogPost['kind'] } = $props();
</script>

{#if kind === 'deprecation'}
	<span
		class="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400"
	>
		Deprecation
	</span>
{:else if kind === 'release'}
	<span
		class="inline-flex items-center rounded-md border border-chart-2/25 bg-chart-2/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-chart-2 uppercase"
	>
		Release
	</span>
{:else if kind === 'update'}
	<span
		class="inline-flex items-center rounded-md border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-sky-700 uppercase dark:text-sky-400"
	>
		Update
	</span>
{:else}
	<span
		class="inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-primary uppercase"
	>
		News
	</span>
{/if}
