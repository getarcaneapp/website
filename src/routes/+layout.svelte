<script lang="ts">
	import '../app.css';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/header.svelte';

	let { children } = $props();

	let isDeprecatedDomain = $state(false);

	const PROD_HOSTS = ['arcane.ofkm.dev', 'getarcane.app'];

	if (typeof window !== 'undefined') {
		const host = window.location.hostname;

		// Check if accessing via deprecated domain
		if (host === 'arcane.ofkm.dev') {
			isDeprecatedDomain = true;
		}
	}
</script>

<ModeWatcher disableTransitions={false} />

<svelte:head>
	<title>Arcane Documentation</title>
	<meta name="description" content="Arcane - Docker Management, Designed for Everyone." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{#if isDeprecatedDomain}
	<div
		class="sticky top-0 z-60 border-b border-amber-500 bg-amber-500/10 text-amber-600 backdrop-blur-sm dark:bg-amber-500/15 dark:text-amber-400"
	>
		<div class="container-wrapper px-6 py-2">
			<div class="flex items-center justify-center gap-2 text-center text-[12px] font-medium">
				<AlertTriangle class="size-4" />
				<span>
					This domain is deprecated. Please visit the new domain:
					<a
						href={`https://getarcane.app${typeof window !== 'undefined' ? window.location.pathname : ''}`}
						class="inline-flex items-center gap-1 font-semibold text-current underline hover:opacity-80"
					>
						getarcane.app
						<ArrowRight class="size-3" />
					</a>
				</span>
			</div>
		</div>
	</div>
{/if}

<div class="text-foreground relative flex min-h-screen flex-col">
	<!-- Global background -->
	<div class="bg-background fixed inset-0 -z-50" aria-hidden="true"></div>
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
