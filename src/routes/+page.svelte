<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { FeatureCard } from '$lib/components/ui/feature-card';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { BookOpen, Lightbulb } from '@lucide/svelte';
	import { features } from '$lib/config/features';
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
		<Button variant="default" size="lg" href="/docs/setup">
			<BookOpen class="h-4 w-4" />
			Get Started
		</Button>
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

	<Alert.Root class="mx-auto mt-8 max-w-2xl">
		<Lightbulb class="size-4" />
		<Alert.Title>Pro Tip</Alert.Title>
		<Alert.Description>Arcane works best with Docker version 20.10.0 or higher.</Alert.Description>
	</Alert.Root>

	<p class="text-muted-foreground mt-8 text-center italic">
		I loved the style of the shadcn-svelte docs so much, I wanted to use a similar look and feel for
		this project's documentation.
	</p>
</ContentWrapper>
