<script lang="ts">
	import Play from 'virtual:icons/lucide/play';

	interface Props {
		videoId: string;
		title: string;
		thumbnail?: string;
	}

	let { videoId, title, thumbnail }: Props = $props();

	let playing = $state(false);

	const poster = $derived(thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
	const embedSrc = $derived(`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`);
</script>

<div class="relative aspect-video w-full overflow-hidden rounded-md border border-border bg-muted">
	{#if playing}
		<iframe
			class="absolute inset-0 h-full w-full"
			src={embedSrc}
			title={`YouTube: ${title}`}
			allowfullscreen
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
	{:else}
		<button
			type="button"
			onclick={() => (playing = true)}
			class="group/play absolute inset-0 h-full w-full cursor-pointer"
			aria-label={`Play video: ${title}`}
		>
			<img src={poster} alt="" class="h-full w-full object-cover" loading="lazy" />
			<span class="absolute inset-0 bg-black/20 transition-colors group-hover/play:bg-black/30"
			></span>
			<span
				class="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur transition-transform duration-300 group-hover/play:scale-110"
			>
				<Play class="size-6 translate-x-0.5 text-white" />
			</span>
		</button>
	{/if}
</div>
