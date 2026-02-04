<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Settings from '@lucide/svelte/icons/settings';
	import Zap from '@lucide/svelte/icons/zap';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import DockerComposeGenerator from '$lib/components/docker-compose-generator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="docs-theme relative isolate">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
	<ContentWrapper>
		<section class="mt-8 mb-12 px-4 text-center sm:mt-12 sm:mb-16">
			<div class="mx-auto max-w-5xl">
				<!-- Decorative icon -->
				<div class="mb-6 flex justify-center">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25"
					>
						<Zap class="h-8 w-8 text-white" />
					</div>
				</div>

				<h1 class="font-heading mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
					<span class="text-foreground">Docker Compose</span>
					<br />
					<span class="text-purple-600 dark:text-purple-400">Generator</span>
				</h1>

				<p class="text-muted-foreground mx-auto mt-4 mb-8 max-w-4xl text-lg leading-relaxed font-light sm:text-xl">
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
			<div class="mx-auto max-w-[1500px]">
				<div class="mb-6 flex flex-col gap-2">
					<p class="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">Compose Generator</p>
					<h2 class="text-2xl font-bold md:text-3xl">Configure your deployment</h2>
					<p class="text-muted-foreground text-base">
						Choose services and options. Your YAML updates live as you go.
					</p>
				</div>
				<DockerComposeGenerator />
			</div>
		</section>
	</ContentWrapper>
</div>
