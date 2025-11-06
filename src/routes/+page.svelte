<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Settings from '@lucide/svelte/icons/settings';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { FeatureCard } from '$lib/components/ui/feature-card/index.js';
	import { features } from '$lib/config/features.js';
</script>

<ContentWrapper>
	<section class="relative mt-12 mb-12 flex flex-col items-center text-center">
		<h1 class="relative mb-4 flex flex-col items-center gap-3 font-black tracking-tight">
			<span
				class="relative inline-block w-full px-4 sm:max-w-[520px] md:max-w-[680px] lg:max-w-[840px] xl:max-w-[900px]"
			>
				<span class="sr-only">Arcane</span>
				<enhanced:img
					src="../../static/img/logo-full.svg"
					alt="Arcane — Modern Docker Management"
					decoding="async"
					loading="eager"
					class="mx-auto h-auto w-full object-contain drop-shadow-[0_4px_24px_rgba(147,51,234,0.25)] select-none"
					sizes="(min-width: 1280px) 900px, (min-width: 1024px) 840px, (min-width: 640px) 520px, 90vw"
				/>
			</span>
			<span
				class="text-foreground/90 mt-4 block text-center text-[clamp(1rem,1.8vw,1.5rem)] leading-tight font-light whitespace-nowrap md:text-[clamp(1.1rem,1.6vw,1.75rem)]"
			>
				Modern Docker Management, <span class="text-primary font-medium">Designed for Everyone.</span>
			</span>
		</h1>

		<div class="mt-6 flex flex-col items-center gap-4 sm:flex-row">
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
			class="border-border/60 from-background/60 via-background/40 to-background/20 pointer-events-none absolute inset-0 -z-10 rounded-3xl border bg-linear-to-b mask-[linear-gradient(to_bottom,black,transparent_85%)] p-px"
		></div>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			{#each features as feature (feature.title)}
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

	<div class="mx-auto mt-6 flex max-w-3xl flex-col items-center justify-center gap-3 text-center">
		<span class="text-muted-foreground text-sm">Supported by</span>
		<div class="flex items-center gap-6">
			<a
				href="https://greptile.com"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center transition-opacity hover:opacity-80"
				aria-label="Greptile"
			>
				<enhanced:img
					src="../../static/img/greptile.svg"
					alt="Greptile"
					class="h-6 w-auto"
					decoding="async"
					loading="lazy"
				/>
			</a>

			<a
				href="https://depot.dev"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center transition-opacity hover:opacity-80"
				aria-label="Depot"
			>
				<img
					src="/img/depot-logo-horizontal-on-light.svg"
					alt="Depot"
					class="h-6 w-auto dark:hidden"
					decoding="async"
					loading="lazy"
				/>
				<img
					src="/img/depot-logo-horizontal-on-dark.svg"
					alt="Depot"
					class="hidden h-6 w-auto dark:block"
					decoding="async"
					loading="lazy"
				/>
			</a>
		</div>
	</div>
</ContentWrapper>
