<script lang="ts">
	import { redditComments, type RedditComment } from '#lib/config/reddit-comments.js';
	import { ExternalLinkIcon } from '#lib/icons/index.js';

	const SECONDS_PER_CARD = 4;

	let comments = $state.raw(redditComments);

	const shuffle = () => {
		const shuffled = [...redditComments];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		comments = shuffled;
	};
</script>

{#snippet commentCard(comment: RedditComment)}
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			<p class="truncate text-sm font-medium text-foreground">u/{comment.author}</p>
			<p class="text-xs text-muted-foreground">r/selfhosted</p>
		</div>
		<ExternalLinkIcon class="size-4 shrink-0 text-muted-foreground" />
	</div>
	<blockquote class="mt-3 line-clamp-5 text-sm leading-relaxed text-foreground/90">
		“{comment.excerpt}”
	</blockquote>
{/snippet}

<section aria-labelledby="community-comments-title" class="relative pb-20">
	<div class="mb-10 flex flex-col items-center gap-2 px-4 text-center">
		<h2
			id="community-comments-title"
			class="font-heading text-3xl font-semibold tracking-tight md:text-4xl"
		>
			Trusted by self-hosters
		</h2>
		<p class="mt-2 max-w-xl text-sm text-muted-foreground">
			Real comments from people running Arcane, straight from r/selfhosted.
		</p>
	</div>

	<div
		role="region"
		aria-label="Community comments"
		class="group/marquee no-scrollbar overflow-hidden mask-fade-x motion-reduce:overflow-x-auto motion-reduce:mask-none"
		{@attach shuffle}
	>
		<div
			class="flex w-max animate-marquee group-focus-within/marquee:animate-paused group-hover/marquee:animate-paused motion-reduce:animate-none"
			style:--marquee-duration={`${comments.length * SECONDS_PER_CARD}s`}
		>
			{#each [false, true] as duplicate (duplicate)}
				<ul
					class={['flex shrink-0 gap-4 pr-4', duplicate && 'motion-reduce:hidden']}
					aria-hidden={duplicate || undefined}
				>
					{#each comments as comment (comment.id)}
						<li class="w-comment-card shrink-0">
							<a
								href={comment.url}
								target="_blank"
								rel="noreferrer"
								tabindex={duplicate ? -1 : undefined}
								aria-label={`Read u/${comment.author}'s comment on Reddit`}
								class="flex h-48 flex-col rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/40 hover:bg-card"
							>
								{@render commentCard(comment)}
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</div>
</section>
