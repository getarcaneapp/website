<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '#lib/utils.js';
	import Logo from './logo.svelte';
	import greptileLogo from '../assets/greptile.svg?enhanced';
	import graphiteLogo from '../assets/graphite.png?enhanced';
	import depotLogoLight from '../assets/depot-logo-horizontal-on-light.svg?enhanced';
	import depotLogoDark from '../assets/depot-logo-horizontal-on-dark.svg?enhanced';
	import orbstackLogo from '../assets/orbstack.png?enhanced';
	import snykLogoLight from '../assets/Snyk_Brand_-_Logo_-_Black_-_Wordmark.png?enhanced';
	import snykLogoDark from '../assets/Snyk_Brand_-_Logo_-_White_-_Wordmark.png?enhanced';
	import dockerLogo from '../assets/docker-logo-ocean-blue.svg?enhanced';

	const DISCORD_URL = 'https://discord.gg/WyXYpdyV3Z';

	type Sponsor = {
		name: string;
		href: string;
		logo: typeof greptileLogo;
		logoDark?: typeof greptileLogo;
		/** Square mark that needs the name rendered next to it. */
		wordmark?: boolean;
		imgClass?: string;
	};

	const sponsors: Sponsor[] = [
		{ name: 'Greptile', href: 'https://greptile.com', logo: greptileLogo },
		{
			name: 'Graphite',
			href: 'https://graphite.dev',
			logo: graphiteLogo,
			wordmark: true,
			imgClass: 'size-6 rounded-md'
		},
		{
			name: 'Depot',
			href: 'https://depot.dev',
			logo: depotLogoLight,
			logoDark: depotLogoDark
		},
		{
			name: 'OrbStack',
			href: 'https://orbstack.dev',
			logo: orbstackLogo,
			wordmark: true,
			imgClass: 'size-6 rounded-md'
		},
		{ name: 'Snyk', href: 'https://snyk.io', logo: snykLogoLight, logoDark: snykLogoDark },
		{ name: 'Docker', href: 'https://www.docker.com', logo: dockerLogo, imgClass: 'h-5' }
	];

	const logoClass =
		'h-6 w-auto opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0';

	const columns = [
		{
			title: 'Product',
			links: [
				{ label: 'DockerHub', href: 'https://hub.docker.com/u/getarcaneapp', external: true },
				{ label: 'GitHub', href: 'https://github.com/getarcaneapp/arcane', external: true },
				{ label: 'API Reference', href: '/api-reference' },
				{ label: 'SBOM', href: '/sbom' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Blog', href: '/blog' },
				{ label: 'Changelog', href: '/changelog' },
				{ label: 'Community', href: '/community' },
				{ label: 'Discord', href: DISCORD_URL, external: true }
			]
		},
		{
			title: 'Legal',
			links: [{ label: 'Privacy', href: '/privacy' }]
		}
	];

	let discordOnlineCount = $state<number | null>(null);

	onMount(async () => {
		try {
			const response = await fetch('/api/discord/presence');
			if (!response.ok) return;

			const data: unknown = await response.json();
			if (
				typeof data === 'object' &&
				data !== null &&
				'online' in data &&
				typeof data.online === 'number' &&
				Number.isInteger(data.online) &&
				data.online >= 0
			) {
				discordOnlineCount = data.online;
			}
		} catch {
			discordOnlineCount = null;
		}
	});
</script>

<footer class="border-t border-border">
	<div class="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
	<div class="w-full px-4 py-12 lg:px-6">
		<div class="flex flex-col justify-between gap-10 md:flex-row">
			<div class="flex flex-col gap-10">
				<div class="flex max-w-xs flex-col gap-4">
					<a href="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-80">
						<Logo class="size-5" />
						<span class="text-sm font-semibold tracking-tight">Arcane</span>
					</a>
					<p class="text-sm leading-relaxed text-muted-foreground">
						Modern Docker management, designed for everyone.
					</p>
				</div>

				<div class="mt-auto flex flex-col gap-4">
					<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
						Supported by
					</span>
					<div class="flex flex-wrap items-center gap-x-8 gap-y-5">
						{#each sponsors as sponsor (sponsor.name)}
							<a
								href={sponsor.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group inline-flex items-center gap-2"
								aria-label={sponsor.name}
							>
								{#if sponsor.logoDark}
									<enhanced:img
										src={sponsor.logo}
										alt=""
										class={cn(logoClass, 'dark:hidden', sponsor.imgClass)}
										decoding="async"
										loading="lazy"
									/>
									<enhanced:img
										src={sponsor.logoDark}
										alt=""
										class={cn(logoClass, 'hidden dark:block', sponsor.imgClass)}
										decoding="async"
										loading="lazy"
									/>
								{:else}
									<enhanced:img
										src={sponsor.logo}
										alt=""
										class={cn(logoClass, sponsor.imgClass)}
										decoding="async"
										loading="lazy"
									/>
								{/if}
								{#if sponsor.wordmark}
									<span
										class="text-sm font-bold text-foreground/80 transition-colors duration-300 group-hover:text-foreground"
									>
										{sponsor.name}
									</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
				{#each columns as column (column.title)}
					<div class="flex flex-col gap-3">
						<span class="text-sm font-medium text-foreground">{column.title}</span>
						<ul class="flex flex-col gap-2">
							{#each column.links as link (link.href)}
								<li>
									<a
										href={link.href}
										target={link.external ? '_blank' : undefined}
										rel={link.external ? 'noopener noreferrer' : undefined}
										class="group text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
										{#if link.href === DISCORD_URL && discordOnlineCount !== null}
											<span
												class="ml-1 inline-flex translate-y-px items-center rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] leading-none font-medium text-primary tabular-nums transition-colors group-hover:border-primary/30 group-hover:bg-primary/15"
											>
												{discordOnlineCount.toLocaleString()} online
											</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</div>
</footer>
