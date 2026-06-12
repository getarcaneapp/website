<script lang="ts">
	import { onMount } from 'svelte';
	import { CommandSearch } from '$lib/components/command-search/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { mainNavItems } from '$lib/config/docs.js';
	import GithubLink from './github-link.svelte';
	import Logo from './logo.svelte';
	import MainNav from './mainnav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import ModeSwitcher from './modeswitcher.svelte';

	let version: string | undefined = $state('');

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

	onMount(() => {
		readVersionFile().then((v) => {
			if (v) {
				version = v;
			}
		});
	});
</script>

<header class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
	<div class="flex h-14 w-full items-center gap-4 px-4 lg:px-6">
		<a href="/" class="hidden items-center gap-2 lg:flex">
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
					variant="outline"
					class="hidden h-7 items-center rounded-full border-border px-2.5 font-mono text-xs font-medium text-muted-foreground sm:flex"
				>
					v{version}
				</Badge>
			{/if}
			<GithubLink />
			<ModeSwitcher />
			<Button
				href="https://demo.getarcane.app"
				target="_blank"
				variant="brand"
				size="sm"
				class="h-8 text-xs font-semibold"
			>
				Try the Demo
			</Button>
		</div>
	</div>
</header>
