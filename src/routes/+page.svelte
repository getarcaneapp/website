<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import { resolve } from '$app/paths';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import MobileBetaCallout from '$lib/components/mobile-beta-callout.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Code from '$lib/components/ui/code/index.js';
	import { FeatureCard } from '$lib/components/ui/feature-card/index.js';
	import { features } from '$lib/config/features.js';

	interface StatsHistoryEntry {
		date: string;
		count: number;
	}

	interface StatsResponse {
		total: number;
		by_type?: Record<string, number>;
		by_version?: Record<string, number>;
		history?: StatsHistoryEntry[];
	}

	const STATS_URL = 'https://checkin.getarcane.app/stats';
	const HISTORY_WINDOW = 14;

	const composeFile = `services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    environment:
      - ENCRYPTION_KEY=your-32-char-encryption-key
      - JWT_SECRET=your-jwt-secret
      - TZ=UTC
    cgroup: host
    restart: unless-stopped

volumes:
  arcane-data:`;

	let stats = $state<StatsResponse | null>(null);
	let statusError = $state<string | null>(null);
	let latestDateLabel = $state<string | null>(null);
	let versionBreakdown = $state<Array<{ version: string; count: number }>>([]);
	let typeBreakdown = $state<Array<{ type: string; count: number }>>([]);
	let history = $state<StatsHistoryEntry[]>([]);
	let historyMax = $state(0);

	const formatDate = (isoDate: string): string => {
		const date = new Date(`${isoDate}T00:00:00Z`);
		if (Number.isNaN(date.getTime())) {
			return isoDate;
		}
		return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
	};

	const selectLatestDate = (entries: StatsHistoryEntry[]): string | null => {
		if (!entries.length) {
			return null;
		}
		const latest = entries.reduce((current, entry) =>
			entry.date > current.date ? entry : current
		);
		return latest.date;
	};

	const buildBreakdown = (record: Record<string, number> | undefined) =>
		Object.entries(record ?? {})
			.map(([key, count]) => ({ key, count }))
			.sort((a, b) => b.count - a.count);

	const buildHistory = (entries: StatsHistoryEntry[]): StatsHistoryEntry[] => {
		const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
		const windowed = sorted.slice(-HISTORY_WINDOW);
		const maxValue = windowed.reduce((max, entry) => Math.max(max, entry.count), 0);
		historyMax = Math.max(1, maxValue);
		return windowed;
	};

	onMount(async () => {
		try {
			const response = await fetch(STATS_URL, { cache: 'no-store' });
			if (!response.ok) {
				throw new Error(`Unexpected status ${response.status}`);
			}

			const data: StatsResponse = await response.json();
			stats = data;

			versionBreakdown = buildBreakdown(data.by_version).map(({ key, count }) => ({
				version: key,
				count
			}));
			typeBreakdown = buildBreakdown(data.by_type).map(({ key, count }) => ({ type: key, count }));

			const historyEntries = Array.isArray(data.history) ? data.history : [];
			history = buildHistory(historyEntries);

			const latestDate = selectLatestDate(historyEntries);
			latestDateLabel = latestDate ? formatDate(latestDate) : null;
		} catch (error) {
			console.error('Failed to load analytics stats:', error);
			statusError = 'Status currently unavailable.';
		}
	});
</script>

<div class="docs-theme relative isolate">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
	<ContentWrapper>
		<!-- Hero -->
		<section class="relative mt-10 mb-16">
			<div
				class="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 px-6 py-10 shadow-[0_30px_70px_-60px_oklch(0_0_0/0.6)] backdrop-blur md:px-10 md:py-14"
			>
				<div class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
					<!-- Left: copy + CTAs -->
					<div class="flex flex-col items-center text-center lg:items-start lg:text-left">
						<h1 class="flex flex-col items-center gap-3 lg:items-start">
							<span class="inline-block w-full max-w-100">
								<span class="sr-only">Arcane</span>
								<enhanced:img
									src="../lib/assets/logo-full.svg"
									alt="Arcane — Modern Docker Management"
									width="457"
									height="112"
									decoding="async"
									loading="eager"
									fetchpriority="high"
									class="h-auto w-full object-contain drop-shadow-[0_2px_14px_rgba(147,51,234,0.2)] select-none"
									sizes="(min-width: 1024px) 400px, 80vw"
								/>
							</span>
							<span
								class="block text-[clamp(1.1rem,2vw,1.6rem)] leading-tight font-light text-foreground/90"
							>
								Modern Docker Management, <span
									class="animate-gradient bg-linear-to-r from-purple-600 via-violet-500 to-purple-600 bg-size-[200%_auto] bg-clip-text font-semibold text-transparent"
									>Designed for Everyone.</span
								>
							</span>
						</h1>

						<p class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
							A beautiful, intuitive interface for managing your Docker containers, images, networks,
							and volumes.
							<span class="font-medium text-foreground/80">No terminal required.</span>
						</p>

						<div class="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
							<Button size="lg" href="/docs/setup/installation" class="group">
								Get Started
								<ArrowRight class="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
							</Button>
							<Button variant="outline" size="lg" href="https://demo.getarcane.app" target="_blank">
								Try the Demo
							</Button>
							<Button variant="ghost" size="lg" href="/generator" class="gap-2">
								Compose Generator
								<Badge
									variant="secondary"
									class="border-primary/30 bg-primary/10 text-primary"
								>
									New
								</Badge>
							</Button>
						</div>
					</div>

					<!-- Right: compose.yaml window -->
					<div class="relative w-full">
						<div
							class="overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-[0_24px_60px_-40px_oklch(0_0_0/0.6)] backdrop-blur"
						>
							<div class="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
								<span class="size-3 rounded-full bg-red-400/80"></span>
								<span class="size-3 rounded-full bg-yellow-400/80"></span>
								<span class="size-3 rounded-full bg-green-400/80"></span>
								<span class="ml-2 font-mono text-xs text-muted-foreground">compose.yaml</span>
							</div>
							<Code.Root lang="yaml" code={composeFile} data-code-overflow class="rounded-none border-0">
								<Code.CopyButton size="sm" variant="ghost" />
							</Code.Root>
						</div>
					</div>
				</div>
			</div>
		</section>

		<MobileBetaCallout />

		<!-- Capabilities -->
		<section class="relative mb-20">
			<div class="mb-8 flex flex-col gap-2">
				<p class="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">
					Capabilities
				</p>
				<h2 class="font-heading text-3xl font-semibold tracking-tight">
					Everything you need to run Arcane
				</h2>
				<p class="max-w-2xl text-base text-muted-foreground">
					Monitor containers, handle volumes, orchestrate updates, and keep logs within reach —
					without dropping into the CLI.
				</p>
			</div>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature, i (feature.title)}
					<div
						style="animation-delay: {i * 100}ms;"
						class="animate-in duration-500 fill-mode-backwards fade-in slide-in-from-bottom-4"
					>
						<FeatureCard
							icon={feature.icon}
							title={feature.title}
							description={feature.description}
							fullWidth={feature.fullWidth}
						/>
					</div>
				{/each}
			</div>
		</section>

		<!-- Analytics Heartbeat -->
		<section class="relative mb-20">
			<div
				class="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 px-6 py-8 shadow-[0_24px_60px_-55px_oklch(0_0_0/0.5)] backdrop-blur-xl md:px-10"
			>
				<div class="relative">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div class="space-y-2">
							<p class="font-mono text-xs font-medium tracking-[0.15em] text-primary uppercase">
								Heartbeat status
							</p>
							<h2 class="text-2xl font-semibold tracking-tight text-foreground">
								Analytics Heartbeat
							</h2>
							<p class="max-w-xl text-sm leading-relaxed text-muted-foreground">
								Live, anonymized check-ins from running Arcane servers.
								<a
									href={resolve('/docs/configuration/analytics')}
									class="font-medium text-foreground underline underline-offset-4"
								>
									Learn more
								</a>
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-2 text-xs">
							<div
								class="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5"
							>
								<span class="text-muted-foreground">Active</span>
								<span class="font-semibold text-foreground">{stats ? stats.total : '—'}</span>
							</div>
							<div
								class="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5"
							>
								<span class="text-muted-foreground">Last update</span>
								<span class="font-semibold text-foreground">{latestDateLabel ?? '—'}</span>
							</div>
							<div
								class="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5"
							>
								<span class="text-muted-foreground">Versions</span>
								<span class="font-semibold text-foreground">{versionBreakdown.length || '—'}</span>
							</div>
							{#if versionBreakdown.length}
								<div
									class="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5"
								>
									<span class="text-muted-foreground">Most common</span>
									<span class="font-semibold text-foreground">
										v{versionBreakdown[0].version} ({versionBreakdown[0].count})
									</span>
								</div>
							{/if}
						</div>
					</div>

					<div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
						<div class="space-y-4">
							<div>
								<p class="font-mono text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
									By version
								</p>
								{#if versionBreakdown.length}
									<div class="mt-3 flex flex-wrap gap-2 text-xs">
										{#each versionBreakdown as version (version.version)}
											<span class="rounded-full border border-border/60 bg-background/70 px-2.5 py-1">
												v{version.version} · {version.count}
											</span>
										{/each}
									</div>
								{:else}
									<p class="mt-2 text-sm text-muted-foreground">No version data yet.</p>
								{/if}
							</div>

							{#if typeBreakdown.length}
								<div>
									<p class="font-mono text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
										By type
									</p>
									<div class="mt-3 flex flex-wrap gap-2 text-xs">
										{#each typeBreakdown as type (type.type)}
											<span class="rounded-full border border-border/60 bg-background/70 px-2.5 py-1">
												{type.type} · {type.count}
											</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div>
							<p class="font-mono text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
								Recent activity
							</p>
							{#if history.length}
								<div class="mt-3 flex items-end gap-1" aria-label="Recent heartbeat activity">
									{#each history as entry (entry.date)}
										<div
											class="w-2 rounded-sm bg-primary/70"
											style={`height: ${Math.max(8, Math.round((entry.count / historyMax) * 44))}px`}
											title={`${entry.date}: ${entry.count}`}
										>
											<span class="sr-only">{entry.date}: {entry.count}</span>
										</div>
									{/each}
								</div>
							{:else}
								<p class="mt-3 text-sm text-muted-foreground">No activity yet.</p>
							{/if}
						</div>
					</div>

					{#if statusError}
						<p class="mt-4 text-xs text-muted-foreground">{statusError}</p>
					{/if}
				</div>
			</div>
		</section>

		<!-- Supported by -->
		<section class="py-12">
			<div
				class="rounded-[2rem] border border-border/60 bg-background/70 px-6 py-6 text-center shadow-[0_20px_45px_-45px_oklch(0_0_0/0.5)] backdrop-blur"
			>
				<div class="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 text-center">
					<span class="font-mono text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase"
						>Supported by</span
					>
					<div class="flex flex-wrap items-center justify-center gap-8">
						<a
							href="https://greptile.com"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center transition-all duration-300 hover:scale-105"
							aria-label="Greptile"
						>
							<enhanced:img
								src="../lib/assets/greptile.svg"
								alt="Greptile"
								width="102"
								height="28"
								class="h-7 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100"
								decoding="async"
								loading="lazy"
							/>
						</a>

						<a
							href="https://graphite.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
							aria-label="Graphite"
						>
							<enhanced:img
								src="../lib/assets/graphite.png"
								alt="Graphite"
								width="28"
								height="28"
								class="h-7 w-auto rounded-md opacity-70 transition-opacity duration-300 group-hover:opacity-100"
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
							class="group inline-flex items-center transition-all duration-300 hover:scale-105"
							aria-label="Depot"
						>
							<enhanced:img
								src="../lib/assets/depot-logo-horizontal-on-light.svg"
								alt="Depot"
								width="112"
								height="28"
								class="h-7 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
								decoding="async"
								loading="lazy"
							/>
							<enhanced:img
								src="../lib/assets/depot-logo-horizontal-on-dark.svg"
								alt="Depot"
								width="112"
								height="28"
								class="hidden h-7 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100 dark:block"
								decoding="async"
								loading="lazy"
							/>
						</a>

						<a
							href="https://orbstack.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
							aria-label="OrbStack"
						>
							<enhanced:img
								src="../lib/assets/orbstack.png"
								alt="OrbStack"
								width="28"
								height="28"
								class="h-7 w-auto rounded-md opacity-70 transition-opacity duration-300 group-hover:opacity-100"
								decoding="async"
								loading="lazy"
							/>
							<span
								class="text-sm font-bold text-foreground/80 transition-colors duration-300 group-hover:text-foreground"
							>
								OrbStack
							</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	</ContentWrapper>
</div>
