<script lang="ts">
	import { BookOpenIcon, SettingsIcon, ZapIcon } from '#lib/icons/index.js';
	import ContentWrapper from '#lib/components/content-wrapper.svelte';
	import DockerComposeGenerator from '#lib/components/docker-compose-generator.svelte';
	import Button from '#lib/components/ui/button/button.svelte';
</script>

<div class="relative isolate">
	<ContentWrapper>
		<section class="mt-5 mb-4 px-4">
			<div class="mx-auto max-w-375 md:pl-2">
				<div>
					<h1 class="mb-2 text-3xl font-semibold tracking-tight lg:text-4xl">
						Docker Compose Generator
					</h1>
					<p class="max-w-2xl text-base leading-relaxed text-muted-foreground">
						Follow the guided steps to configure Arcane services, credentials, and storage. Your
						Compose file is updated in real time.
					</p>
				</div>
				<div class="mt-4 inline-flex w-full flex-wrap gap-2.5 sm:w-auto">
					<Button variant="outline" size="sm" href="/docs/get-started/installation" class="group">
						<BookOpenIcon class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
						Setup Guide
					</Button>
					<Button variant="outline" size="sm" href="/docs/configuration/environment" class="group">
						<SettingsIcon class="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
						Environment Docs
					</Button>
				</div>
			</div>
		</section>

		<section id="configure" class="mb-8 px-4">
			<div class="mx-auto max-w-375">
				<DockerComposeGenerator />
			</div>
		</section>
	</ContentWrapper>
</div>
