<script lang="ts">
import * as Dialog from '#lib/components/ui/dialog/index.js';
import { ChartIcon } from '#lib/icons/index.js';
import HistoryChart from './heartbeat/history-chart.svelte';
import {
	fillHistory,
	formatDate,
	groupVersions,
	STATS_URL,
	type StatsResponse,
	sortHistory
} from './heartbeat/stats';
import StatsDialog from './heartbeat/stats-dialog.svelte';

const HISTORY_WINDOW = 14;
const TOP_VERSIONS = 5;

let stats = $state<StatsResponse | null>(null);
let statusError = $state<string | null>(null);

const percent = (count: number): number =>
	stats?.total ? Math.round((count / stats.total) * 100) : 0;

const sortedHistory = $derived(sortHistory(stats?.history));
const history = $derived(fillHistory(sortedHistory, HISTORY_WINDOW));
const lastCheckIn = $derived(sortedHistory.at(-1));
const versions = $derived(groupVersions(stats?.by_version));
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

<Dialog.Root>
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
		<div class="flex shrink-0 items-center gap-5 text-sm">
			<a
				href="/docs/settings/analytics"
				class="rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				How analytics work
			</a>
			<Dialog.Trigger
				disabled={!stats}
				class="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none"
			>
				<ChartIcon class="size-4 text-primary" aria-hidden="true" />
				View all stats
			</Dialog.Trigger>
		</div>
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
				<HistoryChart
					{history}
					class="mt-4"
					label={`Daily check-ins for the last ${HISTORY_WINDOW} days`}
				/>
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
						<li>
							<Dialog.Trigger
								class="grid w-full grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 rounded-sm text-left text-xs text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
								aria-label={`Show all ${versions.length} versions`}
							>
								<span class="underline-offset-4 hover:underline">+{otherVersions.length} more</span>
								<span></span>
								<span class="text-right tabular-nums">
									{otherVersions.reduce((sum, v) => sum + v.count, 0)}
								</span>
							</Dialog.Trigger>
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

	{#if stats}
		<StatsDialog {stats} {versions} />
	{/if}
</Dialog.Root>
