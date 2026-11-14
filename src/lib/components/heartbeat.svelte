<script lang="ts">
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
const TOP_VERSIONS = 5;

let stats = $state<StatsResponse | null>(null);
let statusError = $state<string | null>(null);

const formatDate = (isoDate: string): string => {
	const date = new Date(`${isoDate}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return isoDate;
	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

const normalizeVersion = (version: string): string => {
	const bare = version.replace(/^v/, '');
	return /^\d/.test(bare) ? `v${bare}` : bare;
};

const percent = (count: number): number =>
	stats?.total ? Math.round((count / stats.total) * 100) : 0;

const DAY_MS = 24 * 60 * 60 * 1000;

const sortedHistory = $derived(
	[...(stats?.history ?? [])].sort((a, b) => a.date.localeCompare(b.date))
);
// The trailing HISTORY_WINDOW UTC calendar days ending today; days with no record count as 0.
const history = $derived.by((): StatsHistoryEntry[] => {
	if (!sortedHistory.length) return [];
	const counts = new Map(sortedHistory.map((entry) => [entry.date, entry.count]));
	const today = Date.now();
	return Array.from({ length: HISTORY_WINDOW }, (_, i) => {
		const date = new Date(today - (HISTORY_WINDOW - 1 - i) * DAY_MS).toISOString().slice(0, 10);
		return { date, count: counts.get(date) ?? 0 };
	});
});
const historyMax = $derived(Math.max(1, ...history.map((entry) => entry.count)));
const lastCheckIn = $derived(sortedHistory.at(-1));
const versions = $derived.by(() => {
	const normalized: Record<string, number> = {};
	for (const [version, count] of Object.entries(stats?.by_version ?? {})) {
		const key = normalizeVersion(version);
		normalized[key] = (normalized[key] ?? 0) + count;
	}
	return Object.entries(normalized)
		.map(([version, count]) => ({ version, count }))
		.sort((a, b) => b.count - a.count);
});
const topVersions = $derived(versions.slice(0, TOP_VERSIONS));
const otherVersions = $derived(versions.slice(TOP_VERSIONS));
const versionMax = $derived(Math.max(1, versions[0]?.count ?? 0));
const types = $derived(
	Object.entries(stats?.by_type ?? {})
		.map(([type, count]) => ({ type, count }))
		.sort((a, b) => b.count - a.count)
);

const tiles = $derived([
	{
		label: 'Instances',
		value: stats ? String(stats.total) : '—',
		sub: types
			.filter((t) => t.type !== 'unknown')
			.map((t) => `${t.count} ${t.type}s`)
			.join(' · ')
	},
	{
		label: 'Most common',
		value: versions[0]?.version ?? '—',
		sub: versions[0] ? `${percent(versions[0].count)}% of instances` : ''
	},
	{
		label: 'Versions',
		value: versions.length ? String(versions.length) : '—',
		sub: versions.length ? 'in the wild' : ''
	},
	{
		label: 'Last check-in',
		value: lastCheckIn ? formatDate(lastCheckIn.date) : '—',
		sub: lastCheckIn ? `${lastCheckIn.count} servers that day` : ''
	}
]);

$effect(() => {
	fetch(STATS_URL, { cache: 'no-store' })
		.then((response) => {
			if (!response.ok) throw new Error(`Unexpected status ${response.status}`);
			return response.json();
		})
		.then((data: StatsResponse) => (stats = data))
		.catch(() => (statusError = 'Stats are unavailable right now.'));
});
</script>

<header class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
	<div>
		<h2
			id="heartbeat-title"
			class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
		>
			Running Arcane servers
		</h2>
		<p class="mt-2 text-muted-foreground">Counts from anonymous analytics check-ins.</p>
	</div>
	<a
		href="/docs/settings/analytics"
		class="shrink-0 rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
	>
		How analytics work
	</a>
</header>

<dl class="mt-8 flex flex-wrap gap-x-12 gap-y-6">
	{#each tiles as tile (tile.label)}
		<div>
			<dt class="text-xs text-muted-foreground">{tile.label}</dt>
			<dd class="ms-0 mt-1 text-2xl font-medium tracking-tight text-foreground tabular-nums">
				{tile.value}
			</dd>
			<dd class="ms-0 mt-0.5 min-h-4 text-xs text-muted-foreground">{tile.sub}</dd>
		</div>
	{/each}
</dl>

<div class="mt-10 grid gap-10 lg:grid-cols-2">
	<section aria-labelledby="heartbeat-activity">
		<h3 id="heartbeat-activity" class="text-xs text-muted-foreground">
			Daily check-ins · last {HISTORY_WINDOW} days
		</h3>
		{#if history.length}
			<ul
				class="mt-4 flex h-28 items-end gap-1.5"
				aria-label={`Daily check-ins for the last ${HISTORY_WINDOW} days`}
			>
				{#each history as entry (entry.date)}
					<li class="flex h-full flex-1">
						<button
							type="button"
							class="group relative flex h-full w-full cursor-default items-end rounded-t-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							aria-label={`${formatDate(entry.date)}: ${entry.count} ${entry.count === 1 ? 'check-in' : 'check-ins'}`}
						>
							<div
								class={[
									'w-full rounded-t-sm transition-colors motion-reduce:transition-none',
									entry.count
										? 'bg-[color-mix(in_oklab,var(--primary)_80%,var(--background))] group-hover:bg-primary group-focus:bg-primary'
										: 'bg-muted'
								]}
								style:height={entry.count
									? `${Math.max(6, (entry.count / historyMax) * 100)}%`
									: '2px'}
							></div>
							<span
								class="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[11px] whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 motion-reduce:transition-none"
								aria-hidden="true"
								>{`${formatDate(entry.date)} · ${entry.count}`}</span
							>
						</button>
					</li>
				{/each}
			</ul>
			<div class="mt-2 flex justify-between text-xs text-muted-foreground">
				<span>{formatDate(history[0].date)}</span>
				<span>{formatDate(history[history.length - 1].date)}</span>
			</div>
		{:else}
			<p class="mt-4 text-sm text-muted-foreground">{stats ? 'No activity yet.' : 'Loading…'}</p>
		{/if}
	</section>

	<section aria-labelledby="heartbeat-versions">
		<h3 id="heartbeat-versions" class="text-xs text-muted-foreground">Top versions</h3>
		{#if topVersions.length}
			<ul class="mt-4 space-y-2.5">
				{#each topVersions as version (version.version)}
					<li class="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm">
						<span class="truncate font-mono text-xs text-foreground">{version.version}</span>
						<span class="h-1.5 overflow-hidden rounded-full bg-muted">
							<span
								class="block h-full rounded-full bg-primary/70"
								style:width={`${(version.count / versionMax) * 100}%`}
							></span>
						</span>
						<span class="text-right text-xs text-muted-foreground tabular-nums"
							>{version.count}</span
						>
					</li>
				{/each}
				{#if otherVersions.length}
					<li
						class="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-xs text-muted-foreground"
					>
						<span>+{otherVersions.length} more</span>
						<span></span>
						<span class="text-right tabular-nums">
							{otherVersions.reduce((sum, v) => sum + v.count, 0)}
						</span>
					</li>
				{/if}
			</ul>
		{:else}
			<p class="mt-4 text-sm text-muted-foreground">
				{stats ? 'No version data yet.' : 'Loading…'}
			</p>
		{/if}
	</section>
</div>

{#if statusError}
	<p class="mt-6 text-xs text-muted-foreground">
		{statusError}
	</p>
{/if}
