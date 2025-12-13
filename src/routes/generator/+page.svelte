<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Settings from '@lucide/svelte/icons/settings';
	import Zap from '@lucide/svelte/icons/zap';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import DockerComposeGenerator from '$lib/components/docker-compose-generator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<ContentWrapper>
	<section class="mt-8 mb-12 px-4 text-center sm:mt-12 sm:mb-16">
		<div class="mx-auto max-w-3xl">
			<!-- Decorative icon -->
			<div class="mb-6 flex justify-center">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25"
				>
					<Zap class="h-8 w-8 text-white" />
				</div>
			</div>

			<h1 class="mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
				<span class="text-foreground">Docker Compose</span>
				<br />
				<span class="text-purple-600 dark:text-purple-400">Generator</span>
			</h1>

			<p class="text-muted-foreground mx-auto mt-4 mb-8 max-w-2xl text-lg leading-relaxed font-light sm:text-xl">
				Interactively create a custom Docker Compose for Arcane. Configure databases, authentication, and more
				<span class="text-foreground font-medium">in just a few clicks.</span>
			</p>

			<div class="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
				<Button
					variant="outline"
					size="lg"
					href="/docs/setup/installation"
					class="group w-full border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5 sm:w-auto"
				>
					<BookOpen class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
					Read Setup Guide
				</Button>
				<Button
					variant="outline"
					size="lg"
					href="/docs/configuration/environment"
					class="group w-full border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5 sm:w-auto"
				>
					<Settings class="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
					Environment Variable Docs
				</Button>
			</div>
		</div>
	</section>

	<section id="configure" class="mb-14 px-4 sm:mb-16">
		<div class="mx-auto max-w-4xl">
			<Card.Root class="overflow-hidden border-purple-500/10 dark:border-purple-400/10">
				<Card.Header class="border-border/50 border-b bg-linear-to-r from-purple-500/5 via-transparent to-violet-500/5">
					<div class="flex items-start justify-between gap-3">
						<div>
							<Card.Title class="text-xl font-bold">Configure Your Deployment</Card.Title>
							<Card.Description class="text-muted-foreground"
								>Choose services and options. Your YAML updates live.</Card.Description
							>
						</div>
						<div class="hidden items-center gap-2 sm:flex">
							<span
								class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 ring-1 ring-green-500/20 dark:text-green-400"
							>
								<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
								Live Preview
							</span>
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
