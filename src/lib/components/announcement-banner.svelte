<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import X from 'virtual:icons/lucide/x';
	import { page } from '$app/state';
	import { getFeaturedPost } from '#lib/blog.js';

	const featured = getFeaturedPost();
	const storageKey = featured ? `arcane:dismissed-announcement:${featured.slug}` : '';

	let dismissed = $state(false);

	const onFeaturedPost = $derived(featured ? page.url.pathname === featured.href : false);
	const visible = $derived(Boolean(featured) && !dismissed && !onFeaturedPost);

	onMount(() => {
		if (!storageKey) return;
		dismissed = window.localStorage.getItem(storageKey) === '1';
	});

	const dismiss = () => {
		dismissed = true;
		if (storageKey) window.localStorage.setItem(storageKey, '1');
	};
</script>

{#if featured && visible}
	<div class="relative border-b border-primary/20 bg-primary/8 dark:bg-primary/12">
		<div class="flex items-center justify-center gap-2 px-4 py-2 pr-12 lg:px-6">
			<a
				href={featured.href}
				class="inline-flex min-w-0 items-center justify-center gap-2 text-center text-[12px] font-medium text-primary hover:underline"
			>
				<span class="truncate">{featured.banner ?? featured.title}</span>
				<ArrowRight class="size-3 shrink-0" />
			</a>
			<button
				type="button"
				onclick={dismiss}
				class="absolute top-1/2 right-3 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground lg:right-4"
				aria-label="Dismiss announcement"
			>
				<X class="size-3.5" />
			</button>
		</div>
	</div>
{/if}
