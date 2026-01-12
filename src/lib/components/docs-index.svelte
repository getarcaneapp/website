<script lang="ts">
	import { Link } from '$lib/components/ui/link/index.js';
	import {
		configuration,
		contributing,
		dockerResources,
		gettingStarted,
		guides,
		remoteManagement,
		templates
	} from '$velite/index.js';
	import { sortDocs } from '$lib/config/docs.js';

	type Doc = { title: string; path: string; order?: number };

	let {
		sections = [
			{ title: 'Getting Started', collections: [gettingStarted] },
			{ title: 'Docker Resources', collections: [dockerResources] },
			{ title: 'Configuration', collections: [configuration] },
			{ title: 'Remote Management', collections: [remoteManagement] },
			{ title: 'Templates', collections: [templates] },
			{ title: 'Guides', collections: [guides] },
			{ title: 'Contributing', collections: [contributing] }
		]
	} = $props();

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
