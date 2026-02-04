<script lang="ts">
	import { resolve } from '$app/paths';
	import { configuration, development, features, guides, setup, templates } from '$velite/index.js';
	import { sortDocs } from '$lib/config/docs.js';

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

	const toHref = (p: string) => `/docs/${p}`;
	const getInitials = (title: string) =>
		title
			.split(' ')
			.filter(Boolean)
			.map((word) => word[0]?.toUpperCase())
			.join('')
			.slice(0, 2);
</script>

<div class="docs-index">
	{#each sections as section (section.title)}
		{@const docs = sortDocs((section.collections as Doc[][]).flat())}
		<section class="docs-index__section">
			<div class="docs-index__header">
				<h3 class="docs-index__title">{section.title}</h3>
				<span class="docs-index__count">{docs.length} items</span>
			</div>
			<div class="docs-index__grid">
				{#each docs as d (d.path)}
					<a class="docs-index__card" href={resolve(toHref(d.path))}>
						<span class="docs-index__icon">{getInitials(d.title)}</span>
						<span class="docs-index__label">
							<span class="docs-index__card-title">{d.title}</span>
						</span>
						<span class="docs-index__arrow">&gt;</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.docs-index {
		display: grid;
		gap: 2.5rem;
	}

	.docs-index__section {
		display: grid;
		gap: 1rem;
	}

	.docs-index__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.docs-index__title {
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.docs-index__count {
		font-size: 0.75rem;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.docs-index__grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.docs-index__card {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.9rem;
		border-radius: 1.5rem;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		background: color-mix(in oklab, var(--background) 92%, transparent);
		padding: 1rem 1.1rem;
		color: var(--foreground);
		text-decoration: none;
		transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.docs-index__card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in oklab, var(--primary) 35%, transparent);
		box-shadow: 0 16px 35px -30px oklch(0 0 0 / 0.45);
	}

	.docs-index__card:focus-visible {
		outline: 2px solid color-mix(in oklab, var(--primary) 60%, transparent);
		outline-offset: 3px;
	}

	.docs-index__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 0.85rem;
		border: 1px solid color-mix(in oklab, var(--border) 65%, transparent);
		color: var(--muted-foreground);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.docs-index__label {
		display: grid;
		gap: 0.2rem;
	}

	.docs-index__card-title {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.docs-index__arrow {
		color: var(--muted-foreground);
		font-size: 1rem;
	}
</style>
