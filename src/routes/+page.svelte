<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowRightIcon, ExternalLinkIcon } from '#lib/icons/index.js';
	import { trackEvent } from '#lib/analytics.js';
	import CommunityPreview from '#lib/components/community/community-preview.svelte';
	import RedditComments from '#lib/components/community/reddit-comments.svelte';
	import LogoFull from '#lib/components/logo-full.svelte';
	import MobileBetaCallout from '#lib/components/mobile-beta-callout.svelte';
	import Button from '#lib/components/ui/button/button.svelte';
	import * as Code from '#lib/components/ui/code/index.js';
	import { FeatureCard } from '#lib/components/ui/feature-card/index.js';
	import { features } from '#lib/config/features.js';
	import { MANAGER_IMAGES } from '#lib/utils/docker-compose-generator.js';
	import { resolveInternalPath } from '#lib/utils.js';

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
	const MANAGER_IMAGE_LINES = Object.values(MANAGER_IMAGES);

	let imageIndex = $state(0);
	let imageLineFading = $state(false);
	let composeHovered = $state(false);
	let imageFadeTimer: ReturnType<typeof setTimeout> | undefined;

	const composeFile = $derived(`services:
  arcane:
    image: ${MANAGER_IMAGE_LINES[imageIndex]}
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    environment:
      - ENCRYPTION_KEY=your-32-char-encryption-key
      - TZ=UTC
    cgroup: host
    restart: unless-stopped

volumes:
  arcane-data:`);

	let stats = $state<StatsResponse | null>(null);
	let statusError = $state<string | null>(null);

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

	const buildHistory = (entries: StatsHistoryEntry[]): StatsHistoryEntry[] =>
		[...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-HISTORY_WINDOW);

	const historyEntries = $derived(Array.isArray(stats?.history) ? stats.history : []);
	const history = $derived(buildHistory(historyEntries));
	const historyMax = $derived(Math.max(1, ...history.map((entry) => entry.count)));
	const versionBreakdown = $derived(buildVersionBreakdown(stats?.by_version));
	const typeBreakdown = $derived(
		buildBreakdown(stats?.by_type).map(({ key, count }) => ({ type: key, count }))
	);
	const latestDateLabel = $derived.by(() => {
		const latestDate = selectLatestDate(historyEntries);
		return latestDate ? formatDate(latestDate) : null;
	});

	const pauseComposeCycle = () => {
		composeHovered = true;
		if (imageFadeTimer) {
			clearTimeout(imageFadeTimer);
			imageFadeTimer = undefined;
		}
		imageLineFading = false;
	};

	// Cycles the image line in the compose preview; pauses while it's hovered.
	const cycleComposeImages = () => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const holdMs = reduceMotion ? 5000 : 3200;
		const fadeMs = reduceMotion ? 0 : 280;

		const autoplayTimer = setInterval(() => {
			if (composeHovered) return;

			if (fadeMs === 0) {
				imageIndex = (imageIndex + 1) % MANAGER_IMAGE_LINES.length;
				return;
			}

			imageLineFading = true;
			imageFadeTimer = setTimeout(() => {
				if (composeHovered) {
					imageLineFading = false;
					return;
				}
				imageIndex = (imageIndex + 1) % MANAGER_IMAGE_LINES.length;
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						imageLineFading = false;
					});
				});
			}, fadeMs);
		}, holdMs);

		return () => {
			clearInterval(autoplayTimer);
			if (imageFadeTimer) clearTimeout(imageFadeTimer);
		};
	};

	async function loadStats() {
		try {
			const response = await fetch(STATS_URL, { cache: 'no-store' });
			if (!response.ok) {
				throw new Error(`Unexpected status ${response.status}`);
			}
			stats = await response.json();
		} catch (error) {
			console.error('Failed to load analytics stats:', error);
			statusError = 'Status currently unavailable.';
		}
	}

	// Live install stats are fetched in the browser; the prerendered page shows placeholders.
	if (browser) loadStats();
</script>

<div class="relative isolate overflow-hidden">
	<div
		class="pointer-events-none absolute -inset-x-40 -top-40 h-150 opacity-60 dark:opacity-40"
		aria-hidden="true"
	>
		<div class="absolute inset-0 glow-top"></div>
	</div>

	<div class="mx-auto w-full max-w-screen-2xl px-4 pt-6 sm:pt-10 lg:px-6">
		<section
			class="relative grid items-center gap-12 pt-10 pb-16 md:pt-14 md:pb-20 lg:min-h-screen-70 lg:grid-cols-2 lg:gap-16"
		>
			<div class="pointer-events-none absolute inset-0 hero-dot-grid" aria-hidden="true"></div>

			<div class="relative flex flex-col items-center text-center lg:items-start lg:text-left">
				<MobileBetaCallout class="mb-8" />

				<LogoFull class="mb-8 h-16 w-auto sm:h-20 lg:h-24" />

				<h1 class="text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
					<span
						class="bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
					>
						Modern Docker management,
					</span>
					<br />
					<span
						class="bg-linear-to-r from-primary via-primary-tint to-primary-soft bg-clip-text text-transparent"
					>
						designed for everyone.
					</span>
				</h1>

				<div class="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
					<Button
						size="lg"
						href="/docs/get-started/installation"
						onclick={() =>
							trackEvent('CTA Clicked', { cta: 'get_started', placement: 'home_hero' })}
						class="group"
					>
						Get Started
						<ArrowRightIcon
							class="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
						/>
					</Button>
					<Button
						variant="outline"
						size="lg"
						href="https://demo.getarcane.app"
						target="_blank"
						onclick={() => trackEvent('CTA Clicked', { cta: 'demo', placement: 'home_hero' })}
						class="group"
					>
						Try the Demo
						<ExternalLinkIcon
							class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</Button>
				</div>

				<p class="mt-5 text-sm font-medium tracking-wide text-primary">
					Always free. Forever. Never changing.
				</p>
			</div>

			<div class="relative mx-auto w-full max-w-2xl lg:max-w-none">
				<div
					class="pointer-events-none absolute -inset-4 rounded-2xl glow-center opacity-60 dark:opacity-40"
					aria-hidden="true"
				></div>

				<div
					class="group/preview relative overflow-hidden rounded-xl border border-primary/20 bg-code shadow-lg shadow-primary/5 [&_.line--highlighted]:bg-primary/14 [&_.line--highlighted_span]:transition-opacity [&_.line--highlighted_span]:duration-280 data-swapping:[&_.line--highlighted_span]:opacity-0 motion-reduce:[&_.line--highlighted_span]:transition-none"
					data-swapping={imageLineFading || undefined}
					{@attach cycleComposeImages}
					role="region"
					aria-label="Docker Compose example"
					onmouseenter={pauseComposeCycle}
					onmouseleave={() => (composeHovered = false)}
				>
					<div class="flex items-center gap-3 border-b border-primary/10 bg-surface/80 px-5 py-3">
						<div class="flex items-center gap-1.5">
							<span class="size-2.5 rounded-full bg-destructive/80"></span>
							<span class="size-2.5 rounded-full bg-warning/80"></span>
							<span class="size-2.5 rounded-full bg-success/80"></span>
						</div>
						<span class="font-mono text-xs text-muted-foreground/70">compose.yaml</span>
					</div>
					<Code.Root
						lang="yaml"
						code={composeFile}
						highlight={[3]}
						data-code-overflow
						variant="embedded"
					>
						<Code.CopyButton size="sm" variant="ghost" />
					</Code.Root>
				</div>
			</div>
		</section>
	</div>

	<RedditComments />

	<div class="mx-auto w-full max-w-screen-2xl px-4 pb-6 sm:pb-10 lg:px-6">
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
								href={resolveInternalPath('/docs/settings/analytics')}
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

				<div class="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-content-aside-60">
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
										class="h-(--bar-height) w-2.5 rounded-sm bg-primary/60 transition-all duration-200 hover:bg-primary"
										style={`--bar-height: ${Math.max(8, Math.round((entry.count / historyMax) * 44))}px`}
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
	</div>
</div>
