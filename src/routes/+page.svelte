<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import { resolve } from '$app/paths';
	import { trackEvent } from '$lib/analytics.js';
	import CommunityPreview from '$lib/components/community/community-preview.svelte';
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import MobileBetaCallout from '$lib/components/mobile-beta-callout.svelte';
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

	const normalizeVersion = (version: string): string => {
		const bare = version.replace(/^v/, '');
		return /^\d/.test(bare) ? `v${bare}` : bare;
	};

	const buildBreakdown = (record: Record<string, number> | undefined) =>
		Object.entries(record ?? {})
			.map(([key, count]) => ({ key, count }))
			.sort((a, b) => b.count - a.count);

	const buildVersionBreakdown = (record: Record<string, number> | undefined) => {
		const normalized: Record<string, number> = {};

		for (const [version, count] of Object.entries(record ?? {})) {
			const key = normalizeVersion(version);
			normalized[key] = (normalized[key] ?? 0) + count;
		}

		return Object.entries(normalized)
			.map(([version, count]) => ({ version, count }))
			.sort((a, b) => b.count - a.count);
	};

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

			versionBreakdown = buildVersionBreakdown(data.by_version);
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

<div class="relative isolate overflow-hidden">
	<!-- Purple ambient glow behind hero -->
	<div
		class="pointer-events-none absolute -inset-x-40 -top-40 h-150 opacity-60 dark:opacity-40"
		aria-hidden="true"
	>
		<div
			class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,oklch(0.6_0.26_292.717/0.2),transparent_70%)] dark:bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,oklch(0.65_0.24_292.717/0.15),transparent_70%)]"
		></div>
	</div>

	<ContentWrapper>
		<!-- Hero -->
		<section class="relative pt-20 pb-16 md:pt-28 md:pb-20">
			<!-- Dot grid background -->
			<div class="pointer-events-none absolute inset-0 hero-dot-grid" aria-hidden="true"></div>

			<div class="relative mx-auto flex max-w-4xl flex-col items-center text-center">
				<!-- Announcement pill -->
				<a
					href="/changelog"
					onclick={() =>
						trackEvent('CTA Clicked', { cta: 'changelog', placement: 'home_announcement' })}
					class="group mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/10"
				>
					<span class="relative flex size-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75"
						></span>
						<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
					</span>
					See what's new in the changelog
					<ArrowRight
						class="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
					/>
				</a>

				<!-- Main heading with gradient text -->
				<h1
					class="text-4xl font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-7xl"
				>
					<span
						class="bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
					>
						Modern Docker management,
					</span>
					<br />
					<span
						class="bg-linear-to-r from-primary via-purple-400 to-purple-300 bg-clip-text text-transparent dark:via-purple-400 dark:to-purple-300"
					>
						designed for everyone.
					</span>
				</h1>

				<p class="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
					A beautiful, intuitive interface for managing your Docker containers, images, networks,
					and volumes. No terminal required.
				</p>

				<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
					<Button
						size="lg"
						href="/docs/setup/installation"
						onclick={() =>
							trackEvent('CTA Clicked', { cta: 'get_started', placement: 'home_hero' })}
						class="group px-8"
					>
						Get Started
						<ArrowRight
							class="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
						/>
					</Button>
					<Button
						variant="outline"
						size="lg"
						href="https://demo.getarcane.app"
						target="_blank"
						onclick={() => trackEvent('CTA Clicked', { cta: 'demo', placement: 'home_hero' })}
						class="group px-8"
					>
						Try the Demo
						<ArrowUpRight
							class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</Button>
				</div>
			</div>

			<div class="relative mx-auto mt-16 w-full max-w-2xl">
				<div
					class="pointer-events-none absolute -inset-4 rounded-2xl bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,oklch(0.6_0.26_292.717/0.1),transparent_70%)] opacity-60 dark:opacity-40"
					aria-hidden="true"
				></div>

				<div
					class="relative overflow-hidden rounded-xl border border-primary/20 bg-code shadow-lg shadow-primary/5"
				>
					<div class="flex items-center gap-3 border-b border-primary/10 bg-surface/80 px-5 py-3">
						<div class="flex items-center gap-1.5">
							<span class="size-2.5 rounded-full bg-red-400/80"></span>
							<span class="size-2.5 rounded-full bg-yellow-400/80"></span>
							<span class="size-2.5 rounded-full bg-green-400/80"></span>
						</div>
						<span class="font-mono text-xs text-muted-foreground/70">compose.yaml</span>
					</div>
					<Code.Root
						lang="yaml"
						code={composeFile}
						data-code-overflow
						class="rounded-none border-0"
					>
						<Code.CopyButton size="sm" variant="ghost" />
					</Code.Root>
				</div>
			</div>
		</section>

		<MobileBetaCallout />

		<section class="relative pb-20">
			<div class="mb-10 flex flex-col items-center gap-2 text-center">
				<h2 class="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
					Everything you need to manage Docker
				</h2>
				<p class="mt-2 max-w-xl text-sm text-muted-foreground">
					A comprehensive set of tools to handle every aspect of your container infrastructure.
				</p>
			</div>
			<div
				class="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each features as feature, i (feature.title)}
					<FeatureCard
						icon={feature.icon}
						title={feature.title}
						description={feature.description}
						class={i === features.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}
					/>
				{/each}
			</div>
		</section>

		<CommunityPreview />

		<section class="relative pb-20">
			<div class="overflow-hidden rounded-xl border border-border shadow-sm">
				<div
					class="flex flex-col gap-2 border-b border-border bg-linear-to-r from-transparent via-primary/2 to-transparent px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8"
				>
					<div>
						<h2 class="text-xl font-semibold tracking-tight text-foreground">
							Analytics Heartbeat
						</h2>
						<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
							Live, anonymized check-ins from running Arcane servers.
							<a
								href={resolve('/docs/configuration/analytics')}
								class="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
							>
								Learn more
							</a>
						</p>
					</div>
				</div>

				<div class="grid grid-cols-2 divide-x divide-border border-b border-border md:grid-cols-4">
					<div class="flex flex-col gap-1.5 px-6 py-6 md:px-8">
						<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
							>Active instances</span
						>
						<span class="text-3xl font-bold tracking-tight text-foreground">
							{stats ? stats.total : '—'}
						</span>
					</div>
					<div class="flex flex-col gap-1.5 px-6 py-6 md:px-8">
						<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
							>Last update</span
						>
						<span class="text-3xl font-bold tracking-tight text-foreground">
							{latestDateLabel ?? '—'}
						</span>
					</div>
					<div class="flex flex-col gap-1.5 px-6 py-6 md:px-8">
						<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
							>Versions</span
						>
						<span class="text-3xl font-bold tracking-tight text-foreground">
							{versionBreakdown.length || '—'}
						</span>
					</div>
					<div class="flex flex-col gap-1.5 px-6 py-6 md:px-8">
						<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase"
							>Most common</span
						>
						<span class="font-mono text-3xl font-bold tracking-tight text-foreground">
							{versionBreakdown.length ? versionBreakdown[0].version : '—'}
						</span>
					</div>
				</div>

				<div class="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_240px]">
					<div class="space-y-6">
						<div>
							<p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
								By version
							</p>
							{#if versionBreakdown.length}
								<div class="mt-3 flex flex-wrap gap-2">
									{#each versionBreakdown as version (version.version)}
										<span
											class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/30 hover:bg-primary/3"
										>
											{version.version}
											<span class="text-muted-foreground">·</span>
											<span class="font-medium text-foreground">{version.count}</span>
										</span>
									{/each}
								</div>
							{:else}
								<p class="mt-2 text-sm text-muted-foreground">No version data yet.</p>
							{/if}
						</div>

						{#if typeBreakdown.length}
							<div>
								<p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
									By type
								</p>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each typeBreakdown as type (type.type)}
										<span
											class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/30 hover:bg-primary/3"
										>
											{type.type}
											<span class="text-muted-foreground">·</span>
											<span class="font-medium text-foreground">{type.count}</span>
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div>
						<p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
							Recent activity
						</p>
						{#if history.length}
							<div class="mt-3 flex items-end gap-1" aria-label="Recent heartbeat activity">
								{#each history as entry (entry.date)}
									<div
										class="w-2.5 rounded-sm bg-primary/60 transition-all duration-200 hover:bg-primary"
										style={`height: ${Math.max(8, Math.round((entry.count / historyMax) * 44))}px`}
										title={`${entry.date}: ${entry.count}`}
									>
										<span class="sr-only">{entry.date}: {entry.count}</span>
									</div>
								{/each}
							</div>
							<p class="mt-3 text-xs text-muted-foreground">
								{history[0].date} — {history[history.length - 1].date}
							</p>
						{:else}
							<p class="mt-3 text-sm text-muted-foreground">No activity yet.</p>
						{/if}
					</div>
				</div>

				{#if statusError}
					<p class="border-t border-border px-6 pt-4 pb-5 text-xs text-muted-foreground md:px-8">
						{statusError}
					</p>
				{/if}
			</div>
		</section>
	</ContentWrapper>
</div>
