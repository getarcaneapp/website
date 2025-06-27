<script lang="ts">
	import Logo from './logo.svelte';
	import MainNav from './mainnav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import GithubLink from './github-link.svelte';
	import ModeSwitcher from './modeswitcher.svelte';

	import { mainNavItems } from '$lib/config/docs';
</script>

<header class="bg-background border-border sticky top-0 z-50 w-full border-b">
	<div class="container-wrapper 3xl:fixed:px-0 px-6">
		<div class="flex items-start gap-2 py-4">
			<Button href="/" variant="ghost" class="hidden gap-2 lg:flex">
				<Logo />
				<span>Arcane Docs</span>
			</Button>
			<MainNav items={mainNavItems} class="hidden lg:flex" />

			<MobileNav class="flex lg:hidden" />

			<!-- Right side items -->
			<div class="ml-auto flex items-start gap-2 md:flex-1 md:justify-end">
				<div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
					<!-- <DocsCommandMenu /> -->
				</div>
				<Separator orientation="vertical" class="ml-2 hidden lg:block" />
				<GithubLink />
				<Separator orientation="vertical" />
				<ModeSwitcher />
			</div>
		</div>
	</div>
</header>
