<script lang="ts">
	import { Link } from '$lib/components/ui/link/index.js';
	import { setup, configuration, features, templates, guides, development } from '$velite/index.js';

	type Doc = { title: string; path: string; order?: number };

	let {
		sections = [
			{ title: 'Getting Started', collections: [setup] },
			{ title: 'Configuration', collections: [configuration] },
			{ title: 'Features', collections: [features] },
			{ title: 'Templates', collections: [templates] },
			{ title: 'Guides', collections: [guides] },
			{ title: 'Development', collections: [development] }
		]
	} = $props();

	function sortDocs(arr: Doc[]): Doc[] {
		return [...arr].sort((a, b) => {
			const ao = a.order ?? 1e9;
			const bo = b.order ?? 1e9;
			if (ao !== bo) return ao - bo;
			return a.title.localeCompare(b.title);
		});
	}

	const toHref = (p: string) => `/docs/${p}`;
</script>

<div class="space-y-8">
	{#each sections as section (section.title)}
		<section class="space-y-2">
			<h3 class="text-lg font-semibold">{section.title}</h3>
			<ul class="list-disc pl-5">
				{#each sortDocs((section.collections as Doc[][]).flat()) as d (d.path)}
					<li>
						<Link href={toHref(d.path)}>{d.title}</Link>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
