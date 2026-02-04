<script lang="ts">
	import { onMount } from 'svelte';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Settings from '@lucide/svelte/icons/settings';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
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
		const latest = entries.reduce((current, entry) => (entry.date > current.date ? entry : current));
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

			versionBreakdown = buildBreakdown(data.by_version).map(({ key, count }) => ({ version: key, count }));
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

<ContentWrapper>
	<!-- Subtle Background Glow -->
	<div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
		<div
			class="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.606_0.25_292.717/0.06),transparent_60%)] blur-3xl"
		></div>
		<div
			class="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.606_0.25_292.717/0.04),transparent_60%)] blur-3xl"
		></div>
	</div>

	<section class="relative mt-12 mb-16 flex flex-col items-center text-center">
		<h1 class="relative mb-4 flex flex-col items-center gap-3 font-black tracking-tight">
			<span
				class="relative inline-block w-full px-4 sm:max-w-[520px] md:max-w-[680px] lg:max-w-[840px] xl:max-w-[900px]"
			>
				<span class="sr-only">Arcane</span>
				<enhanced:img
					src="../../static/img/logo-full.svg"
					alt="Arcane — Modern Docker Management"
					decoding="async"
					loading="eager"
					class="mx-auto h-auto w-full object-contain drop-shadow-[0_4px_32px_rgba(147,51,234,0.35)] transition-all duration-500 select-none hover:drop-shadow-[0_4px_48px_rgba(147,51,234,0.5)]"
					sizes="(min-width: 1280px) 900px, (min-width: 1024px) 840px, (min-width: 640px) 520px, 90vw"
				/>
			</span>
			<span
				class="text-foreground/90 mt-4 block text-center text-[clamp(1rem,1.8vw,1.5rem)] leading-tight font-light whitespace-nowrap md:text-[clamp(1.1rem,1.6vw,1.75rem)]"
			>
				Modern Docker Management, <span
					class="animate-gradient bg-linear-to-r from-purple-600 via-violet-500 to-purple-600 bg-size-[200%_auto] bg-clip-text font-semibold text-transparent"
					>Designed for Everyone.</span
				>
			</span>
		</h1>

		<p class="text-muted-foreground mt-4 max-w-2xl text-center text-base leading-relaxed md:text-lg">
			A beautiful, intuitive interface for managing your Docker containers, images, networks, and volumes.
			<span class="text-foreground/80 font-medium">No terminal required.</span>
		</p>

		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
			<Button
				variant="default"
				size="lg"
				href="/docs/setup/installation"
				class="group relative overflow-hidden bg-linear-to-r from-purple-600 via-violet-600 to-purple-600 bg-size-[200%_auto] text-white shadow-lg shadow-purple-500/25 transition-all duration-500 hover:bg-right hover:shadow-xl hover:shadow-purple-500/40"
			>
				<Sparkles class="size-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
				Get Started
				<span
					class="absolute inset-0 -z-10 translate-x-[-200%] bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]"
				></span>
			</Button>

			<div class="relative">
				<Button
					variant="outline"
					size="lg"
					href="/generator"
					class="group bg-background/80 relative border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/60 hover:bg-purple-500/5 dark:border-purple-400/30 dark:hover:border-purple-400/60"
				>
					<Settings class="size-4 transition-transform duration-500 group-hover:rotate-90" />
					Compose Generator
				</Button>
				<span
					class="absolute -top-2.5 -right-4 rotate-12 rounded-full bg-linear-to-r from-purple-600 to-violet-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-2 shadow-purple-500/30 ring-white/20 dark:ring-black/20"
				>
					New
				</span>
			</div>
		</div>
	</section>

	<section class="relative mb-20">
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature, i (feature.title)}
				<div
					style="animation-delay: {i * 100}ms;"
					class="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-500"
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

	<section class="relative mb-20">
		<div
			class="border-border/60 bg-background/60 relative overflow-hidden rounded-3xl border px-6 py-8 shadow-[0_20px_50px_-40px_oklch(0_0_0/0.4)] backdrop-blur-xl md:px-10"
		>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-[40%] bg-[radial-gradient(circle,oklch(0.606_0.25_292.717/0.12),transparent_70%)]"
				aria-hidden="true"
			></div>

			<div class="relative">
				<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div class="space-y-2">
						<p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Heartbeat status</p>
						<h2 class="text-foreground text-2xl font-semibold tracking-tight">Analytics Heartbeat</h2>
						<p class="text-muted-foreground max-w-xl text-sm leading-relaxed">
							Live, anonymized check-ins from running Arcane servers.
							<a href="/docs/configuration/analytics" class="text-foreground font-medium underline underline-offset-4">
								Learn more
							</a>
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-2 text-xs">
						<div class="border-border/60 bg-background/70 flex items-center gap-2 rounded-full border px-3 py-1.5">
							<span class="text-muted-foreground">Active</span>
							<span class="text-foreground font-semibold">{stats ? stats.total : '—'}</span>
						</div>
						<div class="border-border/60 bg-background/70 flex items-center gap-2 rounded-full border px-3 py-1.5">
							<span class="text-muted-foreground">Last update</span>
							<span class="text-foreground font-semibold">{latestDateLabel ?? '—'}</span>
						</div>
						<div class="border-border/60 bg-background/70 flex items-center gap-2 rounded-full border px-3 py-1.5">
							<span class="text-muted-foreground">Versions</span>
							<span class="text-foreground font-semibold">{versionBreakdown.length || '—'}</span>
						</div>
						{#if versionBreakdown.length}
							<div class="border-border/60 bg-background/70 flex items-center gap-2 rounded-full border px-3 py-1.5">
								<span class="text-muted-foreground">Most common</span>
								<span class="text-foreground font-semibold">
									v{versionBreakdown[0].version} ({versionBreakdown[0].count})
								</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
					<div class="space-y-4">
						<div>
							<p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">By version</p>
							{#if versionBreakdown.length}
								<div class="mt-3 flex flex-wrap gap-2 text-xs">
									{#each versionBreakdown as version}
										<span class="border-border/60 bg-background/70 rounded-full border px-2.5 py-1">
											v{version.version} · {version.count}
										</span>
									{/each}
								</div>
							{:else}
								<p class="text-muted-foreground mt-2 text-sm">No version data yet.</p>
							{/if}
						</div>

						{#if typeBreakdown.length}
							<div>
								<p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">By type</p>
								<div class="mt-3 flex flex-wrap gap-2 text-xs">
									{#each typeBreakdown as type}
										<span class="border-border/60 bg-background/70 rounded-full border px-2.5 py-1">
											{type.type} · {type.count}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div>
						<p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Recent activity</p>
						{#if history.length}
							<div class="mt-3 flex items-end gap-1" aria-label="Recent heartbeat activity">
								{#each history as entry}
									<div
										class="w-2 rounded-sm bg-purple-500/70"
										style={`height: ${Math.max(8, Math.round((entry.count / historyMax) * 44))}px`}
										title={`${entry.date}: ${entry.count}`}
									>
										<span class="sr-only">{entry.date}: {entry.count}</span>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-muted-foreground mt-3 text-sm">No activity yet.</p>
						{/if}
					</div>
				</div>

				{#if statusError}
					<p class="text-muted-foreground mt-4 text-xs">{statusError}</p>
				{/if}
			</div>
		</div>
	</section>

	<section class="py-12">
		<p class="text-muted-foreground mx-auto max-w-3xl text-center text-sm leading-relaxed italic">
			Shoutout to the shadcn and shadcn-svelte teams — their design language inspired this documentation experience.
			Much of the UX polish pays homage to their incredible work, so be sure to explore their ecosystems!
		</p>

		<div class="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-4 text-center">
			<span class="text-muted-foreground text-sm font-medium tracking-wider uppercase">Supported by</span>
			<div class="flex items-center gap-8">
				<a
					href="https://greptile.com"
					target="_blank"
					rel="noopener noreferrer"
					class="group inline-flex items-center transition-all duration-300 hover:scale-105"
					aria-label="Greptile"
				>
					<enhanced:img
						src="../../static/img/greptile.svg"
						alt="Greptile"
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
					<img
						src="/img/graphite.png"
						alt="Graphite"
						class="h-7 w-auto rounded-md opacity-70 transition-opacity duration-300 group-hover:opacity-100"
						decoding="async"
						loading="lazy"
					/>
					<span class="text-foreground/80 group-hover:text-foreground text-sm font-bold transition-colors duration-300">
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
					<img
						src="/img/depot-logo-horizontal-on-light.svg"
						alt="Depot"
						class="h-7 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
						decoding="async"
						loading="lazy"
					/>
					<img
						src="/img/depot-logo-horizontal-on-dark.svg"
						alt="Depot"
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
					<img
						src="/img/orbstack.png"
						alt="OrbStack"
						class="h-7 w-auto rounded-md opacity-70 transition-opacity duration-300 group-hover:opacity-100"
						decoding="async"
						loading="lazy"
					/>
					<span class="text-foreground/80 group-hover:text-foreground text-sm font-bold transition-colors duration-300">
						OrbStack
					</span>
				</a>
			</div>
		</div>
	</section>
</ContentWrapper>
