<script lang="ts">
	import { browser } from '$app/env';
	import { CommandSearch } from '#lib/components/command-search/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { mainNavItems } from '#lib/config/docs.js';
	import AnnouncementBanner from './announcement-banner.svelte';
	import GithubLink from './github-link.svelte';
	import Logo from './logo.svelte';
	import MainNav from './mainnav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import ModeSwitcher from './modeswitcher.svelte';

	// Rendered height, including the announcement banner; the root layout exposes it as
	// `--header-height` so sticky panels sit right below the header.
	let { height = $bindable(0) }: { height?: number } = $props();

	let version = $state('');

	interface ArcaneConfig {
		version: string;
		revision: string;
	}

	async function readVersionFile(): Promise<string> {
		try {
			const response = await fetch(
				'https://raw.githubusercontent.com/getarcaneapp/arcane/refs/heads/main/.arcane.json'
			);
			const data: ArcaneConfig = await response.json();
			return data.version;
		} catch (error) {
			console.error('Error reading version file:', error);
			return '';
		}
	}

	// The latest version is fetched in the browser so the prerendered header doesn't go stale.
	if (browser) {
		readVersionFile().then((v) => {
			if (v) version = v;
		});
	}
</script>

<header
	bind:offsetHeight={height}
	class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60"
>
	<AnnouncementBanner />
	<div class="h-0.5 w-full bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
	<div class="flex h-14 w-full items-center gap-4 px-4 lg:px-6">
		<a href="/" class="hidden items-center gap-2.5 transition-opacity hover:opacity-80 lg:flex">
			<Logo class="size-5" />
			<span class="text-sm font-semibold tracking-tight">Arcane</span>
		</a>
		<MainNav items={mainNavItems} class="hidden lg:flex" />

		<MobileNav class="flex lg:hidden" />

		<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
			<div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
				<CommandSearch />
			</div>
			{#if version}
				<Badge
					href="/changelog"
					aria-label={`View changelog for version ${version}`}
					variant="muted"
					shape="pill"
					mono
					class="hidden h-7 items-center sm:flex"
				>
					v{version}
				</Badge>
			{/if}
			<GithubLink />
			<ModeSwitcher />
			<Button href="https://demo.getarcane.app" target="_blank" variant="brand" size="xs">
				Try the Demo
			</Button>
		</div>
	</div>
</header>
