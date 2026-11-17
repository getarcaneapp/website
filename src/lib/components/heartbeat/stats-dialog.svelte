<script lang="ts">
import * as Dialog from '#lib/components/ui/dialog/index.js';
import HistoryChart from './history-chart.svelte';
import {
	compareVersionsDesc,
	fillHistory,
	formatDate,
	majorOf,
	type StatsResponse,
	sortHistory,
	type VersionCount
} from './stats';

let { stats, versions }: { stats: StatsResponse; versions: VersionCount[] } = $props();

type VersionSort = 'count' | 'version';
let versionSort = $state<VersionSort>('count');

const percentOf = (count: number): string => {
	if (!stats.total) return '0%';
	const value = (count / stats.total) * 100;
	return value > 0 && value < 1 ? '<1%' : `${Math.round(value)}%`;
};

const sortedHistory = $derived(sortHistory(stats.history));
const history = $derived(fillHistory(sortedHistory));
const lastCheckIn = $derived(sortedHistory.at(-1));
const peak = $derived(
	sortedHistory.reduce<(typeof sortedHistory)[number] | undefined>(
		(best, entry) => (!best || entry.count > best.count ? entry : best),
		undefined
	)
);

const types = $derived(
	Object.entries(stats.by_type ?? {})
		.map(([type, count]) => ({ type, count }))
		.sort((a, b) => b.count - a.count)
);
const typeCount = (type: string) => types.find((t) => t.type === type)?.count ?? 0;
const typeMax = $derived(Math.max(1, types[0]?.count ?? 0));

const majors = $derived.by(() => {
	const totals: Record<string, number> = {};
	for (const { version, count } of versions) {
		const major = majorOf(version);
		totals[major] = (totals[major] ?? 0) + count;
	}
	return Object.entries(totals)
		.map(([major, count]) => ({ major, count }))
		.sort((a, b) => compareVersionsDesc(`${a.major}.0.0`, `${b.major}.0.0`));
});
const majorSum = $derived(
	Math.max(
		1,
		majors.reduce((sum, m) => sum + m.count, 0)
	)
);
const MAJOR_SHADES = ['bg-primary', 'bg-primary/60', 'bg-primary/35', 'bg-primary/20'];
const majorShade = (index: number, major: string) =>
	major === 'Other'
		? 'bg-muted-foreground/40'
		: MAJOR_SHADES[Math.min(index, MAJOR_SHADES.length - 1)];

const versionMax = $derived(Math.max(1, versions[0]?.count ?? 0));
const sortedVersions = $derived(
	versionSort === 'count'
		? versions
		: [...versions].sort((a, b) => compareVersionsDesc(a.version, b.version))
);

const tiles = $derived([
	{ label: 'Instances', value: stats.total, sub: 'checking in now' },
	{
		label: 'Managers',
		value: typeCount('manager'),
		sub: `${percentOf(typeCount('manager'))} of instances`
	},
	{
		label: 'Agents',
		value: typeCount('agent'),
		sub: `${percentOf(typeCount('agent'))} of instances`
	},
	{ label: 'Versions', value: versions.length, sub: 'in the wild' },
	{
		label: 'Peak day',
		value: peak ? peak.count : '—',
		sub: peak ? formatDate(peak.date, true) : ''
	}
]);

const SORTS: { value: VersionSort; label: string }[] = [
	{ value: 'count', label: 'Most used' },
	{ value: 'version', label: 'Newest' }
];
</script>

<Dialog.Content class="max-h-[85dvh] gap-8 overflow-y-auto sm:max-w-4xl sm:p-8">
	<Dialog.Header class="text-left sm:pe-6">
		<Dialog.Title class="text-xl tracking-tight">Arcane server stats</Dialog.Title>
		<Dialog.Description>
			Everything the anonymous check-in service reports{lastCheckIn
				? `, as of ${formatDate(lastCheckIn.date, true)}`
				: ''}.
			<a
				href="/docs/settings/analytics"
				class="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>How analytics work</a
			>
		</Dialog.Description>
	</Dialog.Header>

	<dl class="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
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

	{#if history.length}
		<section aria-labelledby="heartbeat-dialog-activity">
			<h3 id="heartbeat-dialog-activity" class="text-xs text-muted-foreground">
				Daily check-ins · last {history.length} days
			</h3>
			<HistoryChart
				{history}
				class="mt-8 h-40 gap-1"
				label={`Daily check-ins for the last ${history.length} days`}
			/>
		</section>
	{/if}

	<div class="grid gap-8 md:grid-cols-2">
		<section aria-labelledby="heartbeat-dialog-types">
			<h3 id="heartbeat-dialog-types" class="text-xs text-muted-foreground">Server types</h3>
			<ul class="mt-4 space-y-2.5">
				{#each types as type (type.type)}
					<li class="grid grid-cols-[5.5rem_1fr_2.5rem_2.5rem] items-center gap-3 text-sm">
						<span class="truncate text-xs text-foreground capitalize">{type.type}</span>
						<span class="h-1.5 overflow-hidden rounded-full bg-muted">
							<span
								class="block h-full rounded-full bg-primary/70"
								style:width={`${(type.count / typeMax) * 100}%`}
							></span>
						</span>
						<span class="text-right text-xs text-foreground tabular-nums">{type.count}</span>
						<span class="text-right text-xs text-muted-foreground tabular-nums"
							>{percentOf(type.count)}</span
						>
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="heartbeat-dialog-majors">
			<h3 id="heartbeat-dialog-majors" class="text-xs text-muted-foreground">Major versions</h3>
			<div class="mt-4 flex h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
				{#each majors as major, index (major.major)}
					<span
						class={['h-full', majorShade(index, major.major)]}
						style:width={`${(major.count / majorSum) * 100}%`}
					></span>
				{/each}
			</div>
			<ul class="mt-4 space-y-2">
				{#each majors as major, index (major.major)}
					<li class="flex items-center gap-2 text-xs">
						<span class={['size-2.5 shrink-0 rounded-sm', majorShade(index, major.major)]}></span>
						<span class="font-mono text-foreground">
							{major.major === 'Other' ? 'Other' : `${major.major}.x`}
						</span>
						<span class="ms-auto text-foreground tabular-nums">{major.count}</span>
						<span class="w-10 text-right text-muted-foreground tabular-nums"
							>{percentOf(major.count)}</span
						>
					</li>
				{/each}
			</ul>
		</section>
	</div>

	<section aria-labelledby="heartbeat-dialog-versions">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h3 id="heartbeat-dialog-versions" class="text-xs text-muted-foreground">
				All versions · {versions.length}
			</h3>
			<fieldset class="m-0 flex min-w-0 rounded-md border border-border p-0.5 text-xs">
				<legend class="sr-only">Sort versions</legend>
				{#each SORTS as sort (sort.value)}
					<button
						type="button"
						class={[
							'rounded-sm px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary motion-reduce:transition-none',
							versionSort === sort.value
								? 'bg-muted text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						]}
						aria-pressed={versionSort === sort.value}
						onclick={() => (versionSort = sort.value)}
					>
						{sort.label}
					</button>
				{/each}
			</fieldset>
		</div>
		<ul class="mt-4 gap-x-10 sm:columns-2">
			{#each sortedVersions as version (version.version)}
				<li
					class="mb-2.5 grid break-inside-avoid grid-cols-[6.5rem_1fr_2.5rem_2.5rem] items-center gap-3 text-sm"
				>
					<span class="truncate font-mono text-xs text-foreground" title={version.version}
						>{version.version}</span
					>
					<span class="h-1.5 overflow-hidden rounded-full bg-muted">
						<span
							class="block h-full min-w-0.5 rounded-full bg-primary/70"
							style:width={`${(version.count / versionMax) * 100}%`}
						></span>
					</span>
					<span class="text-right text-xs text-foreground tabular-nums">{version.count}</span>
					<span class="text-right text-xs text-muted-foreground tabular-nums"
						>{percentOf(version.count)}</span
					>
				</li>
			{/each}
		</ul>
	</section>
</Dialog.Content>
