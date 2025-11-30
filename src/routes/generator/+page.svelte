<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Settings from '@lucide/svelte/icons/settings';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import DockerComposeGenerator from '$lib/components/docker-compose-generator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<ContentWrapper>
	<section class="mt-8 mb-10 px-4 text-center sm:mt-12 sm:mb-14">
		<div class="mx-auto max-w-3xl">
			<h1 class="mb-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
				<span class="text-foreground">Docker Compose</span>
				<span
					class="bg-linear-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(109,40,217,0.5)]"
				>
					Generator
				</span>
			</h1>

			<p
				class="text-muted-foreground mx-auto mt-3 mb-6 max-w-2xl text-lg leading-relaxed font-light sm:mb-8 sm:text-xl"
			>
				Interactively create a custom Docker Compose for Arcane. Configure databases, authentication, and more in a few
				clicks.
			</p>

			<div class="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
				<Button variant="outline" size="lg" href="/docs/setup/installation" class="w-full sm:w-auto">
					<BookOpen class="h-4 w-4" />
					Read Setup Guide
				</Button>
				<Button variant="outline" size="lg" href="/docs/configuration/environment" class="w-full sm:w-auto">
					<Settings class="h-4 w-4" />
					Environment Variable Docs
				</Button>
			</div>
		</div>
	</section>

	<section id="configure" class="mb-14 px-4 sm:mb-16">
		<div
			class="absolute inset-x-0 -z-10 mx-2 h-[260px] rounded-3xl bg-linear-to-r from-blue-50/50 via-transparent to-purple-50/50 sm:mx-6 dark:from-blue-950/20 dark:to-purple-950/20"
		></div>

		<div class="mx-auto max-w-4xl">
			<Card.Root class="overflow-hidden">
				<Card.Header>
					<div class="flex items-start justify-between gap-3">
						<div>
							<Card.Title>Configure Your Deployment</Card.Title>
							<Card.Description>Choose services and options. Your YAML updates live.</Card.Description>
						</div>
					</div>
				</Card.Header>

				<Card.Content class="p-0">
					<DockerComposeGenerator />
				</Card.Content>
			</Card.Root>
		</div>
	</section>
</ContentWrapper>
