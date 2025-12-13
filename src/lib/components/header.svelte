<script lang="ts">
	import { onMount } from 'svelte';
	import { CommandSearch } from '$lib/components/command-search/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
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

<header
	class="border-border/40 sticky top-0 z-50 w-full border-b bg-white/80 shadow-[0_1px_3px_oklch(0_0_0/0.04),0_4px_12px_-2px_oklch(0_0_0/0.06)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 dark:bg-[oklch(0.14_0.006_285.823/0.85)] dark:shadow-[0_1px_3px_oklch(0_0_0/0.2),0_4px_16px_-2px_oklch(0_0_0/0.25)]"
>
	<div class="container-wrapper px-6">
		<div class="flex h-16 items-center gap-2 **:data-[slot=separator]:h-4!">
			<Button href="/" variant="ghost" size="icon" class="hidden size-8 lg:flex">
				<Logo class="size-5" />
				<span class="sr-only">Arcane</span>
			</Button>
			<MainNav items={mainNavItems} class="hidden lg:flex" />

			<MobileNav class="flex lg:hidden" />

			<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
				<div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
					<CommandSearch />
				</div>
				<Separator orientation="vertical" />
				{#if version}
					<Badge
						variant="default"
						class="border border-purple-500/30 bg-purple-50/80 text-xs font-semibold text-purple-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-purple-100/80 hover:shadow-md dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20"
					>
						v{version}
					</Badge>
				{/if}
				<Separator orientation="vertical" />
				<GithubLink />
				<Separator orientation="vertical" />
				<ModeSwitcher />
			</div>
		</div>
	</div>
</header>
