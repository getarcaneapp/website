<script lang="ts">
	import CommunityGrid from '$lib/components/community/community-grid.svelte';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { communityArticles, communityVideos } from '$lib/config/community.js';
</script>

<svelte:head>
	<title>Community — Arcane</title>
	<meta
		name="description"
		content="Videos, articles, and blog posts from the Arcane community. Share your own content and join the conversation."
	/>
</svelte:head>

<ContentWrapper>
	<section class="relative pt-16 pb-16 md:pt-20">
		<div class="mb-10 flex flex-col items-center gap-2 text-center">
			<h2 class="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
				From the community
			</h2>
			<p class="mt-2 max-w-xl text-sm text-muted-foreground">
				Videos, articles, and blog posts made by people using Arcane.
			</p>
		</div>
	</section>

	<section class="relative pb-16">
		<h3 class="mb-6 text-lg font-semibold tracking-tight text-foreground">Videos</h3>
		<CommunityGrid items={communityVideos} emptyMessage="No videos yet — check back soon." />
	</section>

	<section class="relative pb-16">
		<h3 class="mb-6 text-lg font-semibold tracking-tight text-foreground">Articles & blog posts</h3>
		<CommunityGrid items={communityArticles} emptyMessage="No articles yet — check back soon." />
	</section>

	<section class="relative pb-20">
		<div
			class="flex flex-col items-center gap-3 rounded-md border border-border bg-background p-8 text-center"
		>
			<h3 class="text-lg font-semibold tracking-tight text-foreground">
				Made something about Arcane?
			</h3>
			<p class="max-w-md text-sm text-muted-foreground">
				Share your video, article, or blog post with the community. Reach out on Discord or email
				info@getarcane.app. We would love to feature your content as an appreciation for supporting
				our project.
			</p>
			<div class="mt-2 flex flex-wrap items-center justify-center gap-3">
				<Button
					variant="outline"
					href="https://discord.gg/WyXYpdyV3Z"
					target="_blank"
					rel="noopener noreferrer"
				>
					Join the Discord
				</Button>
			</div>
		</div>
	</section>
</ContentWrapper>
