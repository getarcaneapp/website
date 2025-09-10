<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from './logo.svelte';
	import MainNav from './mainnav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import GithubLink from './github-link.svelte';
	import ModeSwitcher from './modeswitcher.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { mainNavItems } from '$lib/config/docs.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let version: string | undefined = $state('');

	async function readVersionFile(): Promise<string> {
		try {
			const response = await fetch('https://raw.githubusercontent.com/ofkm/arcane/refs/heads/main/.version');
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

<header class="bg-background border-border sticky top-0 z-50 w-full">
	<div class="container-wrapper px-6">
		<div class="flex h-16 items-center gap-2 **:data-[slot=separator]:!h-4">
			<Button href="/" variant="ghost" size="icon" class="hidden size-8 lg:flex">
				<Logo class="size-5" />
				<span class="sr-only">Pocket ID</span>
			</Button>
			<MainNav items={mainNavItems} class="hidden lg:flex" />

			<MobileNav class="flex lg:hidden" />

			<div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
				<div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none"><!-- docs search placeholder --></div>
				<Separator orientation="vertical" />
				{#if version}
					<Badge
						variant="default"
						class="bg-background dark:bg-surface border-border/50 dark:border-primary text-foreground border text-xs font-bold shadow-sm dark:shadow-none"
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
