<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { FeatureCard } from '$lib/components/ui/feature-card/index.js';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Settings from '@lucide/svelte/icons/settings';
	import { features } from '$lib/config/features.js';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
</script>

<ContentWrapper>
	<section class="relative mt-12 mb-12 flex flex-col items-center text-center">
		<h1 class="relative mb-4 flex flex-col items-center gap-3 font-black tracking-tight">
			<span class="text-6xl sm:text-7xl md:text-8xl">
				<span
					class="ml-[-0.18em] inline-block bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(147,51,234,0.45)]"
				>
					Arcane
				</span>
			</span>
			<span
				class="text-foreground/70 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium tracking-wide backdrop-blur-md dark:bg-white/5"
			>
				Open Source • Free • Self-Hosted
			</span>
		</h1>

		<p class="text-muted-foreground mx-auto mt-2 mb-6 max-w-2xl text-2xl leading-snug font-light text-balance">
			Modern Docker Management, <span class="text-primary font-medium">Designed for Everyone.</span>
		</p>

		<div class="flex flex-col items-center gap-4 sm:flex-row">
			<Button variant="default" size="lg" href="/docs/setup/installation">
				<BookOpen class="size-4" />
				Get Started
			</Button>

			<div class="relative">
				<Button variant="secondary" size="lg" href="/generator">
					<Settings class="size-4" />
					Compose Generator
				</Button>
				<span
					class="bg-primary text-primary-foreground absolute -top-2 -right-4 rotate-12 rounded-full px-2 py-1 text-xs font-medium shadow-md ring-1 ring-black/10 dark:ring-white/10"
				>
					New
				</span>
			</div>
		</div>
	</section>

	<section class="relative -mt-4 mb-16">
		<div
			aria-hidden="true"
			class="border-border/60 from-background/60 via-background/40 to-background/20 pointer-events-none absolute inset-0 -z-10 rounded-3xl border bg-gradient-to-b [mask-image:linear-gradient(to_bottom,black,transparent_85%)] p-px"
		></div>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			{#each features as feature}
				<FeatureCard
					icon={feature.icon}
					title={feature.title}
					description={feature.description}
					fullWidth={feature.fullWidth}
				/>
			{/each}
		</div>
	</section>

	<p class="text-muted-foreground mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed italic">
		Shoutout to the shadcn and shadcn-svelte teams — their design language inspired this documentation experience. Much
		of the UX polish pays homage to their incredible work, so be sure to explore their ecosystems!
	</p>
</ContentWrapper>
