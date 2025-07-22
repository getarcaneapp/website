<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import DockerComposeGenerator from '$lib/components/docker-compose-generator.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Settings from '@lucide/svelte/icons/settings.svelte';
	import Zap from '@lucide/svelte/icons/zap.svelte';
	import BookOpen from '@lucide/svelte/icons/book-open.svelte';
	import Lightbulb from '@lucide/svelte/icons/lightbulb.svelte';
	import FileText from '@lucide/svelte/icons/file-text.svelte';
</script>

<ContentWrapper>
	<!-- Hero Section -->
	<section class="mt-8 mb-12 flex flex-col items-center px-4 text-center sm:mt-12 sm:mb-16">
		<div class="relative">
			<h1
				class="mb-4 flex flex-col gap-0 text-4xl font-black tracking-tight sm:flex-row sm:items-end sm:text-5xl md:text-6xl"
			>
				<span class="text-foreground">Docker Compose</span>
				<span
					class="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(109,40,217,0.5)] sm:ml-2"
				>
					Generator
				</span>
			</h1>
			<!-- Decorative gradient orb -->
			<div
				class="absolute -top-4 -right-4 -z-10 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-600/40 blur-2xl sm:-top-8 sm:-right-8 sm:h-40 sm:w-40"
			></div>
		</div>

		<p class="text-muted-foreground mx-auto mt-4 mb-6 max-w-3xl text-lg leading-relaxed font-light sm:mb-8 sm:text-xl">
			Create a <span class="text-primary font-medium">custom Docker Compose configuration</span>
			for your Arcane deployment with our interactive generator. Configure databases, authentication, and more with just
			a few clicks.
		</p>

		<div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
			<Button variant="default" size="lg" href="/docs/setup" class="w-full sm:w-auto">
				<BookOpen class="h-4 w-4" />
				Read Setup Guide
			</Button>
			<Button variant="outline" size="lg" href="/docs/configuration" class="w-full sm:w-auto">
				<Settings class="h-4 w-4" />
				Configuration Docs
			</Button>
		</div>
	</section>

	<!-- Main Generator Section -->
	<section class="mb-12 sm:mb-16">
		<div class="relative">
			<!-- Background decoration -->
			<div
				class="absolute inset-0 -z-10 -m-4 rounded-3xl bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 sm:-m-8 dark:from-blue-950/20 dark:to-purple-950/20"
			></div>

			<div class="mb-6 px-4 text-center sm:mb-8">
				<h2 class="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">Configure Your Deployment</h2>
				<p class="text-muted-foreground text-base sm:text-lg">Customize your Arcane setup with the options below</p>
			</div>

			<DockerComposeGenerator />
		</div>
	</section>

	<!-- Next Steps Section -->
	<section class="mb-12 px-4">
		<div class="mb-6 text-center sm:mb-8">
			<h2 class="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">What's Next?</h2>
			<p class="text-muted-foreground text-base sm:text-lg">After generating your Docker Compose file</p>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="bg-card flex items-start gap-4 rounded-lg border p-4 sm:p-6">
				<div class="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
					<FileText class="text-primary h-5 w-5" />
				</div>
				<div>
					<h3 class="mb-2 text-sm font-semibold sm:text-base">1. Save the File</h3>
					<p class="text-muted-foreground text-xs sm:text-sm">
						Download or copy the generated docker-compose.yml to your project directory.
					</p>
				</div>
			</div>

			<div class="bg-card flex items-start gap-4 rounded-lg border p-4 sm:p-6">
				<div class="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
					<Settings class="text-primary h-5 w-5" />
				</div>
				<div>
					<h3 class="mb-2 text-sm font-semibold sm:text-base">2. Deploy</h3>
					<p class="text-muted-foreground text-xs sm:text-sm">
						Run <code class="bg-muted rounded px-1 py-0.5 text-xs">docker compose up -d</code> to start your Arcane instance.
					</p>
				</div>
			</div>

			<div class="bg-card flex items-start gap-4 rounded-lg border p-4 sm:p-6">
				<div class="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
					<Zap class="text-primary h-5 w-5" />
				</div>
				<div>
					<h3 class="mb-2 text-sm font-semibold sm:text-base">3. Access</h3>
					<p class="text-muted-foreground text-xs sm:text-sm">
						Visit your Arcane instance at the configured port and start managing containers.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Pro Tips Alert -->
	<Alert.Root
		class="mx-auto mt-6 max-w-4xl border-blue-200 bg-blue-50/50 sm:mt-8 dark:border-blue-800 dark:bg-blue-950/20"
	>
		<Lightbulb class="size-4 text-blue-600 dark:text-blue-400" />
		<Alert.Title class="text-blue-900 dark:text-blue-100">Pro Tips</Alert.Title>
		<Alert.Description class="text-blue-800 dark:text-blue-200">
			<ul class="mt-2 list-inside list-disc space-y-1 text-sm">
				<li>Enable OIDC authentication for team environments</li>
				<li>Keep your encryption keys and JWT secrets secure</li>
				<li>Regular backups of your data volume are recommended</li>
			</ul>
		</Alert.Description>
	</Alert.Root>
</ContentWrapper>
