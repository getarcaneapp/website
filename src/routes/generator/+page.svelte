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
		<section class="generator-hero px-4">
			<div class="generator-hero__inner generator-offset mx-auto max-w-375">
				<div class="generator-hero__intro">
				<p class="generator-hero__eyebrow">Compose Generator</p>
					<h1 class="generator-hero__title">Docker Compose Generator</h1>
					<p class="generator-hero__subtitle">
						Follow the guided steps to configure Arcane services, credentials, and storage. Your Compose file
						is updated in real time.
					</p>
				</div>
				<div class="generator-hero__links">
					<Button
						variant="outline"
						size="sm"
						href="/docs/setup/installation"
						class="group border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5"
					>
						<BookOpen class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
						Setup Guide
					</Button>
					<Button
						variant="outline"
						size="sm"
						href="/docs/configuration/environment"
						class="group border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5"
					>
						<Settings class="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
						Environment Docs
					</Button>
				</div>
			</div>
		</section>

		<section id="configure" class="generator-workflow px-4">
			<div class="generator-workflow__inner mx-auto max-w-375">
				<DockerComposeGenerator />
			</div>
		</section>
	</ContentWrapper>
</div>

<style>
	.generator-hero {
		margin: 1.25rem 0 1rem;
	}

	.generator-hero__eyebrow {
		margin: 0 0 0.5rem;
		font-size: 0.7rem;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.generator-hero__title {
		margin: 0.7rem 0 0.5rem;
		font-size: clamp(1.9rem, 3vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	.generator-hero__subtitle {
		margin: 0;
		max-width: 42rem;
		color: var(--muted-foreground);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.generator-hero__links {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 1rem;
	}

	.generator-workflow {
		margin-bottom: 2rem;
	}

	.generator-offset {
		padding-left: 8px;
	}

	@media (max-width: 640px) {
		.generator-hero__links {
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.generator-offset {
			padding-left: 0;
		}
	}
</style>
