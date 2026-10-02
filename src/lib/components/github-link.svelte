<script lang="ts">
	import { browser } from '$app/env';
	import { Button } from '#lib/components/ui/button/index.js';
	import { GithubIcon } from '#lib/icons/index.js';

	const FALLBACK_STAR_COUNT = 0;

	async function getGithubStarCount() {
		try {
			const res = await fetch('https://ungh.cc/repos/getarcaneapp/arcane');
			const data = await res.json();
			return data.repo?.stars ?? FALLBACK_STAR_COUNT;
		} catch (error) {
			console.error(error);
			return FALLBACK_STAR_COUNT;
		}
	}

	let stars = $state(FALLBACK_STAR_COUNT);

	if (browser) {
		getGithubStarCount().then((count) => (stars = count));
	}
</script>

<Button
	href="https://github.com/getarcaneapp/arcane"
	target="_blank"
	rel="noreferrer"
	size="sm"
	variant="ghost"
	class="group h-8"
>
	<GithubIcon class="transition-transform duration-200 group-hover:scale-110" />
	<span
		class="text-xs text-muted-foreground tabular-nums transition-colors duration-200 group-hover:text-foreground"
	>
		{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
	</span>
</Button>
