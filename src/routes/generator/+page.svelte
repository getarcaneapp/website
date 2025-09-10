<script lang="ts">
	import DockerComposeGenerator from '$lib/components/docker-compose-generator.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Settings from '@lucide/svelte/icons/settings';
	import Zap from '@lucide/svelte/icons/zap';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Lightbulb from '@lucide/svelte/icons/lightbulb';
	import FileText from '@lucide/svelte/icons/file-text';

	import { envConfig as allEnv } from '$lib/config/pages/env-config.js';

	const featuredEnv = allEnv.filter((c) => ['APP_URL', 'PORT', 'DATABASE_URL', 'OIDC_ENABLED'].includes(c.name));
</script>

<section class="mt-8 mb-10 px-4 text-center sm:mt-12 sm:mb-14">
	<div class="mx-auto max-w-3xl">
		<div
			class="text-muted-foreground mx-auto mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
		>
			<span class="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
			Arcane 1.0
		</div>

		<h1 class="mb-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
			<span class="text-foreground">Docker Compose</span>
			<span
				class="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(109,40,217,0.5)]"
			>
				Generator
			</span>
		</h1>

		<p class="text-muted-foreground mx-auto mt-3 mb-6 max-w-2xl text-lg leading-relaxed font-light sm:mb-8 sm:text-xl">
			Interactively create a custom Docker Compose for Arcane. Configure databases, authentication, and more in a few
			clicks.
		</p>

		<div class="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
			<Button variant="default" size="lg" href="#configure" class="w-full sm:w-auto">
				<Zap class="h-4 w-4" />
				Start Configuring
			</Button>
			<Button variant="outline" size="lg" href="/docs/setup" class="w-full sm:w-auto">
				<BookOpen class="h-4 w-4" />
				Read Setup Guide
			</Button>
			<Button variant="ghost" size="lg" href="/docs/configuration" class="w-full sm:w-auto">
				<Settings class="h-4 w-4" />
				Configuration Docs
			</Button>
		</div>
	</div>
</section>

<section id="configure" class="mb-14 px-4 sm:mb-16">
	<div
		class="absolute inset-x-0 -z-10 mx-2 h-[260px] rounded-3xl bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 sm:mx-6 dark:from-blue-950/20 dark:to-purple-950/20"
	></div>

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
		<div class="lg:col-span-8">
			<Card.Root class="overflow-hidden">
				<Card.Header class="bg-muted/30 border-b">
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

		<aside class="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
			<div class="flex flex-col gap-4">
				<Card.Root>
					<Card.Header>
						<div class="inline-flex items-center gap-2">
							<Lightbulb class="size-4 text-blue-600 dark:text-blue-400" />
							<Card.Title>Quick Tips</Card.Title>
						</div>
						<Card.Description>Keep deployments secure and reliable</Card.Description>
					</Card.Header>
					<Card.Content>
						<ul class="text-muted-foreground mt-1 list-inside list-disc space-y-1 text-sm">
							<li>Enable OIDC authentication for team environments.</li>
							<li>Keep encryption keys and JWT secrets secure.</li>
							<li>Schedule regular backups of your data volume.</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<div class="inline-flex items-center gap-2">
							<Settings class="text-foreground size-4" />
							<Card.Title>Common Env Vars</Card.Title>
						</div>
						<Card.Description>Defaults you can adjust later</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-3">
						{#each featuredEnv as item}
							<div class="bg-muted/30 rounded-md border p-3">
								<div class="flex items-center justify-between">
									<p class="font-mono text-xs font-semibold">{item.name}</p>
									<span class="text-muted-foreground text-[10px]">{item.description}</span>
								</div>
								<p class="text-muted-foreground mt-2 truncate font-mono text-xs">{item.value}</p>
							</div>
						{/each}
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<div class="inline-flex items-center gap-2">
							<BookOpen class="text-foreground size-4" />
							<Card.Title>Docs & Guides</Card.Title>
						</div>
						<Card.Description>Recommended reading</Card.Description>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2">
						<Button variant="outline" size="sm" href="/docs/setup" class="justify-start">
							<BookOpen class="h-4 w-4" />
							Setup Guide
						</Button>
						<Button variant="ghost" size="sm" href="/docs/configuration" class="justify-start">
							<Settings class="h-4 w-4" />
							Configuration Reference
						</Button>
					</Card.Content>
				</Card.Root>
			</div>
		</aside>
	</div>
</section>

<section class="mb-14 px-4 sm:mb-16">
	<div class="mx-auto mb-6 max-w-3xl text-center sm:mb-8">
		<h2 class="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">What’s Next?</h2>
		<p class="text-muted-foreground text-base sm:text-lg">After generating your Docker Compose file</p>
	</div>

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="bg-card flex items-start gap-4 rounded-lg border p-4 sm:p-6">
			<div class="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
				<FileText class="text-primary h-5 w-5" />
			</div>
			<div>
				<h3 class="mb-2 text-sm font-semibold sm:text-base">1. Save the file</h3>
				<p class="text-muted-foreground text-xs sm:text-sm">
					Download or copy the generated <code class="bg-muted rounded px-1 py-0.5 text-[10px]">docker-compose.yml</code
					> to your project.
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
					Run <code class="bg-muted rounded px-1 py-0.5 text-[10px]">docker compose up -d</code> to start Arcane.
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
					Open your configured URL/port and start managing containers.
				</p>
			</div>
		</div>
	</div>
</section>

<Alert.Root
	class="mx-auto mt-6 max-w-4xl border-blue-200 bg-blue-50/50 sm:mt-8 dark:border-blue-800 dark:bg-blue-950/20"
>
	<Lightbulb class="size-4 text-blue-600 dark:text-blue-400" />
	<Alert.Title class="text-blue-900 dark:text-blue-100">Helpful reminders</Alert.Title>
	<Alert.Description class="text-blue-800 dark:text-blue-200">
		<ul class="mt-2 list-inside list-disc space-y-1 text-sm">
			<li>Use strong, unique values for ENCRYPTION_KEY and JWT_SECRET.</li>
			<li>Plan storage and backups for your data volumes.</li>
			<li>Document your chosen ports and URLs for your team.</li>
		</ul>
	</Alert.Description>
</Alert.Root>
