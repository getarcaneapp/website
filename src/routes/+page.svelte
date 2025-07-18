<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { FeatureCard } from '$lib/components/ui/feature-card/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Lightbulb from '@lucide/svelte/icons/lightbulb';
	import Settings from '@lucide/svelte/icons/settings';
	import { features } from '$lib/config/features.js';
</script>

<ContentWrapper>
	<section class="mt-12 mb-12 flex flex-col items-center text-center">
		<h1 class="mb-2 flex items-end gap-0 text-6xl font-black tracking-tight">
			<span
				class="ml-[-0.18em] bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text align-bottom text-transparent drop-shadow-[0_2px_16px_rgba(109,40,217,0.5)]"
			>
				Arcane
			</span>
		</h1>
		<p class="text-muted-foreground mx-auto mt-2 mb-8 max-w-2xl text-2xl font-light">
			Modern Docker Management, <span class="text-primary font-medium">Designed for Everyone.</span>
		</p>

		<div class="flex flex-col items-center gap-4 sm:flex-row">
			<Button variant="default" size="lg" href="/docs/setup">
				<BookOpen class="size-4" />
				Get Started
			</Button>

			<div class="relative">
				<Button variant="secondary" size="lg" href="/generator">
					<Settings class="size-4" />
					Compose Generator
				</Button>
				<span
					class="bg-primary text-primary-foreground absolute -top-2 -right-4 rotate-20 rounded-full px-2 py-1 text-xs font-medium"
				>
					New
				</span>
			</div>
		</div>
	</section>

	<section class="mb-12">
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

	<p class="text-muted-foreground mt-8 text-center italic">
		Shoutout to the shadcn and shadcn-svelte teams, I loved the style of the shadcn-svelte docs so
		much, I wanted to use a similar look and feel for this project's documentation. Alot of the code
		was inspired by their work, so please check them out!
	</p>
</ContentWrapper>
