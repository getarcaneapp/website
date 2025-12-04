<script lang="ts">
	import '../app.css';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Code from '@lucide/svelte/icons/code';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/header.svelte';

	let { children } = $props();

	let showBanner = $state(false);
	let isDev = $state(false);
	let isDeprecatedDomain = $state(false);
	let version: string | undefined = $state();

	interface ArcaneConfig {
		version: string;
		revision: string;
	}

	async function readVersionFile(): Promise<string> {
		try {
			const res = await fetch('https://raw.githubusercontent.com/getarcaneapp/arcane/refs/heads/main/.arcane.json');
			const data: ArcaneConfig = await res.json();
			return data.version;
		} catch {
			return '';
		}
	}

	const PROD_HOSTS = ['arcane.ofkm.dev', 'getarcane.app'];
	const PROD_DOCS_URL = 'https://getarcane.app/docs';

	if (typeof window !== 'undefined') {
		const host = window.location.hostname;
		const isProd = PROD_HOSTS.includes(host);

		// Check if accessing via deprecated domain
		if (host === 'arcane.ofkm.dev') {
			isDeprecatedDomain = true;
		}

		if (!isProd) {
			showBanner = true;
			isDev = host === 'localhost' || host === '127.0.0.1';
			readVersionFile().then((v) => (version = v || undefined));
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
		class="sticky top-0 z-[60] border-b border-amber-500 bg-amber-500/10 text-amber-600 backdrop-blur-sm dark:bg-amber-500/15 dark:text-amber-400"
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

{#if showBanner}
	<div
		class="sticky top-0 z-[60] border-b border-purple-500 bg-purple-500/10 text-purple-600 backdrop-blur-sm dark:bg-purple-500/15 dark:text-purple-400"
	>
		<div class="container-wrapper px-6 py-2">
			<div class="flex items-center justify-center gap-2 text-center text-[12px] font-medium">
				{#if isDev}
					<Code class="size-4" />
					<span>Development environment — documentation may not reflect the production version</span>
				{:else}
					<AlertTriangle class="size-4" />
					<span>
						This documentation is for an unreleased version of Arcane. See the
						<a href={PROD_DOCS_URL} class="font-semibold text-current underline hover:opacity-80">latest version</a>
						{#if version}
							(v{version}){/if}
					</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<div class="bg-background text-foreground flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
