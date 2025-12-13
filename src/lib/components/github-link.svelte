<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import GithubIcon from './icons/github.svelte';

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

	onMount(async () => {
		stars = await getGithubStarCount();
	});
</script>

<Button
	href="https://github.com/getarcaneapp/arcane"
	target="_blank"
	rel="noreferrer"
	size="sm"
	variant="ghost"
	class="group hover:bg-muted/50 h-8 shadow-none transition-all duration-200"
>
	<GithubIcon class="transition-transform duration-200 group-hover:scale-110" />
	<span class="text-muted-foreground group-hover:text-foreground text-xs tabular-nums transition-colors duration-200">
		{stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
	</span>
</Button>
