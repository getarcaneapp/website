<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import { resolve } from '$app/paths';
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

<div class="relative isolate">
	<ContentWrapper>
		<!-- Hero -->
		<section class="relative mt-16 mb-20 md:mt-24">
			<div
				class="pointer-events-none absolute -inset-x-8 -top-24 -bottom-8 hero-dot-grid"
				aria-hidden="true"
			></div>
			<div class="relative mx-auto flex max-w-3xl flex-col items-center text-center">
				<a
					href="/changelog"
					class="group mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
				>
					<span class="size-1.5 rounded-full bg-primary"></span>
					See what's new in the changelog
					<ArrowRight
						class="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
					/>
				</a>
				<h1
					class="text-4xl font-semibold tracking-tighter text-balance text-foreground sm:text-5xl md:text-6xl"
				>
					Modern Docker management,
					<span class="text-muted-foreground">designed for everyone.</span>
				</h1>
				<p class="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
					A beautiful, intuitive interface for managing your Docker containers, images, networks,
					and volumes. No terminal required.
				</p>
				<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button size="lg" href="/docs/setup/installation" class="group">
						Get Started
						<ArrowRight
							class="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
						/>
					</Button>
					<Button variant="outline" size="lg" href="https://demo.getarcane.app" target="_blank">
						Try the Demo
					</Button>
				</div>
			</div>

			<!-- compose.yaml window -->
			<div class="relative mx-auto mt-14 w-full max-w-2xl">
				<div class="overflow-hidden rounded-lg border border-border bg-code">
					<div
						class="flex items-center justify-between border-b border-border bg-surface px-4 py-2"
					>
						<span class="font-mono text-xs text-muted-foreground">compose.yaml</span>
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

		<!-- Capabilities -->
		<section class="relative mb-20">
			<div class="mb-8 flex flex-col gap-2">
				<h2 class="font-heading text-3xl font-semibold tracking-tight text-primary">
					Capabilities
				</h2>
			</div>
			<div
				class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
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

		<!-- Analytics Heartbeat -->
		<section class="relative mb-20">
			<div class="overflow-hidden rounded-lg border border-border">
				<div
					class="flex flex-col gap-2 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8"
				>
					<h2 class="text-xl font-semibold tracking-tight text-foreground">Analytics Heartbeat</h2>
					<p class="text-sm leading-relaxed text-muted-foreground">
						Live, anonymized check-ins from running Arcane servers.
						<a
							href={resolve('/docs/configuration/analytics')}
							class="font-medium text-foreground underline underline-offset-4"
						>
							Learn more
						</a>
					</p>
				</div>

				<!-- Stat strip -->
				<div class="grid grid-cols-2 divide-x divide-border border-b border-border md:grid-cols-4">
					<div class="flex flex-col gap-1 px-6 py-5 md:px-8">
						<span class="text-xs text-muted-foreground">Active instances</span>
						<span class="text-2xl font-semibold tracking-tight text-foreground">
							{stats ? stats.total : '—'}
						</span>
					</div>
					<div class="flex flex-col gap-1 px-6 py-5 md:px-8">
						<span class="text-xs text-muted-foreground">Last update</span>
						<span class="text-2xl font-semibold tracking-tight text-foreground">
							{latestDateLabel ?? '—'}
						</span>
					</div>
					<div class="flex flex-col gap-1 px-6 py-5 md:px-8">
						<span class="text-xs text-muted-foreground">Versions</span>
						<span class="text-2xl font-semibold tracking-tight text-foreground">
							{versionBreakdown.length || '—'}
						</span>
					</div>
					<div class="flex flex-col gap-1 px-6 py-5 md:px-8">
						<span class="text-xs text-muted-foreground">Most common</span>
						<span class="text-2xl font-semibold tracking-tight text-foreground">
							{versionBreakdown.length ? versionBreakdown[0].version : '—'}
						</span>
					</div>
				</div>

				<div class="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_240px]">
					<div class="space-y-4">
						<div>
							<p class="text-xs font-medium text-muted-foreground">By version</p>
							{#if versionBreakdown.length}
								<div class="mt-3 flex flex-wrap gap-2 text-xs">
									{#each versionBreakdown as version (version.version)}
										<span class="rounded-md border border-border px-2.5 py-1 font-mono">
											{version.version} · {version.count}
										</span>
									{/each}
								</div>
							{:else}
								<p class="mt-2 text-sm text-muted-foreground">No version data yet.</p>
							{/if}
						</div>

						{#if typeBreakdown.length}
							<div>
								<p class="text-xs font-medium text-muted-foreground">By type</p>
								<div class="mt-3 flex flex-wrap gap-2 text-xs">
									{#each typeBreakdown as type (type.type)}
										<span class="rounded-md border border-border px-2.5 py-1 font-mono">
											{type.type} · {type.count}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div>
						<p class="text-xs font-medium text-muted-foreground">Recent activity</p>
						{#if history.length}
							<div class="mt-3 flex items-end gap-1" aria-label="Recent heartbeat activity">
								{#each history as entry (entry.date)}
									<div
										class="w-2 rounded-[1px] bg-primary"
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
					<p class="px-6 pb-5 text-xs text-muted-foreground md:px-8">{statusError}</p>
				{/if}
			</div>
		</section>
	</ContentWrapper>
</div>
