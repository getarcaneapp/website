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

async function readVersionFile(): Promise<string> {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/getarcaneapp/arcane/refs/heads/main/.version',
		);
		return await response.text();
	} catch (error) {
		console.error('Error reading version file:', error);
		return '';
	}
}

onMount(() => {
	readVersionFile().then((v) => {
		if (v.trim()) {
			version = v.trim();
		}
	});
});
</script>

<header
	class="border-border/60 sticky top-0 z-50 w-full border-b bg-[oklch(1_0_0/0.85)]/50 shadow-[0_1px_0_0_oklch(0.92_0_0)_inset,0_4px_12px_-2px_oklch(0.7_0_0/0.15),0_12px_32px_-8px_oklch(0.7_0_0/0.12)] backdrop-blur-xl supports-[backdrop-filter]:bg-[oklch(0.97_0_0/0.75)] dark:bg-[oklch(0.18_0.006_285.823/0.72)] dark:shadow-[0_1px_0_0_oklch(0.28_0.006_285.823)_inset,0_4px_12px_-2px_oklch(0.05_0_0/0.5),0_12px_32px_-8px_oklch(0.05_0_0/0.35)] dark:supports-[backdrop-filter]:bg-[oklch(0.16_0.006_285.823/0.65)]"
>
	<div class="container-wrapper px-6">
		<div class="flex h-16 items-center gap-2 **:data-[slot=separator]:!h-4">
			<Button href="/" variant="ghost" size="icon" class="hidden size-8 lg:flex">
				<Logo class="size-5" />
				<span class="sr-only">Pocket ID</span>
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
						class="border-border/60 dark:border-primary/60 text-foreground/90 border bg-[oklch(1_0_0/0.6)] text-xs font-bold shadow-[0_0_0_1px_oklch(0.92_0_0/0.6),0_2px_4px_-1px_oklch(0.7_0_0/0.25)] backdrop-blur supports-[backdrop-filter]:bg-[oklch(0.98_0_0/0.55)] dark:bg-[oklch(0.22_0.006_285.823/0.55)] dark:shadow-[0_0_0_1px_oklch(0.28_0.006_285.823/0.7),0_2px_4px_-1px_oklch(0.05_0_0/0.6)] dark:supports-[backdrop-filter]:bg-[oklch(0.25_0.006_285.823/0.45)]"
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
