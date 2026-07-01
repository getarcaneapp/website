<script lang="ts">
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import Newspaper from 'virtual:icons/lucide/newspaper';
	import Youtube from 'virtual:icons/lucide/youtube';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { CommunityItem } from '$lib/types/community.type.js';
	import VideoEmbed from './video-embed.svelte';

	let { item }: { item: CommunityItem } = $props();

	const formatDate = (isoDate: string): string => {
		const date = new Date(`${isoDate}T00:00:00Z`);
		if (Number.isNaN(date.getTime())) {
			return isoDate;
		}
		return date.toLocaleDateString(undefined, {
			month: 'short',
			day: '2-digit',
			year: 'numeric',
			timeZone: 'UTC'
		});
	};
</script>

{#if item.kind === 'video'}
	<div
		class="group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-background transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5"
	>
		<div
			class="absolute inset-x-0 top-0 z-10 h-0.5 scale-x-0 bg-linear-to-r from-transparent via-primary/40 to-transparent transition-transform duration-300 group-hover:scale-x-100"
		></div>
		<div class="overflow-hidden">
			<VideoEmbed videoId={item.videoId} title={item.title} thumbnail={item.thumbnail} />
		</div>
		<div class="flex flex-1 flex-col gap-2 p-5">
			<Badge variant="outline" class="w-fit gap-1">
				<Youtube class="size-3" />
				Video
			</Badge>
			<a
				href={item.url}
				target="_blank"
				rel="noopener noreferrer"
				class="font-medium text-foreground transition-colors hover:text-primary"
			>
				{item.title}
			</a>
			<p class="text-xs text-muted-foreground">{item.author} · {formatDate(item.publishedAt)}</p>
		</div>
	</div>
{:else}
	<a
		href={item.url}
		target="_blank"
		rel="noopener noreferrer"
		class="group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-background no-underline transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5"
	>
		<div
			class="absolute inset-x-0 top-0 z-10 h-0.5 scale-x-0 bg-linear-to-r from-transparent via-primary/40 to-transparent transition-transform duration-300 group-hover:scale-x-100"
		></div>
		<div class="relative aspect-video w-full overflow-hidden bg-muted">
			{#if item.thumbnail}
				<img src={item.thumbnail} alt="" class="h-full w-full object-cover" loading="lazy" />
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 via-primary/5 to-transparent"
				>
					<Newspaper class="size-8 text-primary/30" />
				</div>
			{/if}
			<span
				class="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary"
			>
				<ArrowUpRight class="size-3.5" />
			</span>
		</div>
		<div class="flex flex-1 flex-col gap-2 p-5">
			<Badge variant="outline" class="w-fit gap-1">
				<Newspaper class="size-3" />
				Article
			</Badge>
			<span class="font-medium text-foreground transition-colors group-hover:text-primary">
				{item.title}
			</span>
			<p class="text-xs text-muted-foreground">
				{item.author}{item.source ? ` · ${item.source}` : ''} · {formatDate(item.publishedAt)}
			</p>
		</div>
	</a>
{/if}
