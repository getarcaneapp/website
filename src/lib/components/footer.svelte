<script lang="ts">
	import Logo from './logo.svelte';

	const columns = [
		{
			title: 'Product',
			links: [
				{ label: 'Documentation', href: '/docs' },
				{ label: 'Try the Demo', href: 'https://demo.getarcane.app', external: true },
				{ label: 'Compose Generator', href: '/generator' },
				{ label: 'Changelog', href: '/changelog' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ label: 'API Reference', href: '/api-reference' },
				{ label: 'SBOM', href: '/sbom' },
				{ label: 'Community', href: '/community' },
				{ label: 'GitHub', href: 'https://github.com/getarcaneapp/arcane', external: true }
			]
		},
		{
			title: 'Legal',
			links: [{ label: 'Privacy', href: '/privacy' }]
		}
	];
</script>

<footer class="border-t border-border">
	<div class="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
	<div class="w-full px-4 py-12 lg:px-6">
		<div class="flex flex-col justify-between gap-10 md:flex-row">
			<div class="flex max-w-xs flex-col gap-4">
				<a href="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-80">
					<Logo class="size-5" />
					<span class="text-sm font-semibold tracking-tight">Arcane</span>
				</a>
				<p class="text-sm leading-relaxed text-muted-foreground">
					Modern Docker management, designed for everyone.
				</p>
				<div class="mt-6 flex flex-col gap-3">
					<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
						>Supported by</span
					>
					<div class="flex flex-wrap items-center gap-6">
						<a
							href="https://greptile.com"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center"
							aria-label="Greptile"
						>
							<enhanced:img
								src="../assets/greptile.svg"
								alt="Greptile"
								width="102"
								height="28"
								class="h-6 w-auto opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
								decoding="async"
								loading="lazy"
							/>
						</a>
						<a
							href="https://graphite.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2"
							aria-label="Graphite"
						>
							<enhanced:img
								src="../assets/graphite.png"
								alt="Graphite"
								width="28"
								height="28"
								class="h-6 w-auto rounded-md opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
								decoding="async"
								loading="lazy"
							/>
							<span
								class="text-sm font-bold text-foreground/80 transition-colors duration-300 group-hover:text-foreground"
							>
								Graphite
							</span>
						</a>
						<a
							href="https://depot.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center"
							aria-label="Depot"
						>
							<enhanced:img
								src="../assets/depot-logo-horizontal-on-light.svg"
								alt="Depot"
								width="112"
								height="28"
								class="h-6 w-auto opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:hidden"
								decoding="async"
								loading="lazy"
							/>
							<enhanced:img
								src="../assets/depot-logo-horizontal-on-dark.svg"
								alt="Depot"
								width="112"
								height="28"
								class="hidden h-6 w-auto opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:block"
								decoding="async"
								loading="lazy"
							/>
						</a>
						<a
							href="https://orbstack.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2"
							aria-label="OrbStack"
						>
							<enhanced:img
								src="../assets/orbstack.png"
								alt="OrbStack"
								width="28"
								height="28"
								class="h-6 w-auto rounded-md opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
								decoding="async"
								loading="lazy"
							/>
							<span
								class="text-sm font-bold text-foreground/80 transition-colors duration-300 group-hover:text-foreground"
							>
								OrbStack
							</span>
						</a>
						<a
							href="https://snyk.io"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center"
							aria-label="Snyk"
						>
							<enhanced:img
								src="../assets/Snyk_Brand_-_Logo_-_Black_-_Wordmark.png"
								alt="Snyk"
								width="47"
								height="24"
								class="h-6 w-auto opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:hidden"
								decoding="async"
								loading="lazy"
							/>
							<enhanced:img
								src="../assets/Snyk_Brand_-_Logo_-_White_-_Wordmark.png"
								alt="Snyk"
								width="47"
								height="24"
								class="hidden h-6 w-auto opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:block"
								decoding="async"
								loading="lazy"
							/>
						</a>
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
										class="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
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
