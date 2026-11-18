<script lang="ts">
import * as Dialog from '#lib/components/ui/dialog/index.js';
import HistoryChart from './history-chart.svelte';
import ShareBar from './share-bar.svelte';
import {
	compareVersionsDesc,
	fillHistory,
	formatCount,
	formatDate,
	formatPercent,
	isPrerelease,
	latestRelease,
	majorOf,
	OTHER_SHADE,
	type ShareSegment,
	type StatsResponse,
	shadeAt,
	sortHistory,
	type VersionCount
} from './stats';

let { stats, versions }: { stats: StatsResponse; versions: VersionCount[] } = $props();

const COLLAPSED_ROWS = 12;

type VersionSort = 'count' | 'version';
let versionSort = $state<VersionSort>('count');
let majorFilter = $state('all');
let expanded = $state(false);

const percent = (count: number) => formatPercent(count, stats.total);

const sortedHistory = $derived(sortHistory(stats.history));
const history = $derived(fillHistory(sortedHistory));
const updated = $derived(sortedHistory.at(-1));
const latest = $derived(latestRelease(versions));

const typeSegments = $derived<(ShareSegment & { label: string; mono?: boolean })[]>(
	Object.entries(stats.by_type ?? {})
		.map(([type, count]) => ({ key: type, count }))
		.sort((a, b) => (a.key === 'unknown' ? 1 : b.key === 'unknown' ? -1 : b.count - a.count))
		.map((segment, index) => ({
			...segment,
			label: segment.key.charAt(0).toUpperCase() + segment.key.slice(1),
			color: segment.key === 'unknown' ? OTHER_SHADE : shadeAt(index * 2)
		}))
);

const majorSegments = $derived.by(() => {
	const totals: Record<string, number> = {};
	for (const { version, count } of versions) {
		const major = majorOf(version);
		totals[major] = (totals[major] ?? 0) + count;
	}
	return Object.entries(totals)
		.map(([major, count]) => ({ key: major, count }))
		.sort((a, b) => compareVersionsDesc(`${a.key}.0.0`, `${b.key}.0.0`))
		.map((segment, index) => ({
			...segment,
			label: segment.key,
			mono: segment.key !== 'Other',
			color: segment.key === 'Other' ? OTHER_SHADE : shadeAt(index)
		}));
});

const filters = $derived([
	{ value: 'all', label: 'All' },
	...majorSegments.filter((m) => m.key !== 'Other').map((m) => ({ value: m.key, label: m.key }))
]);
const SORTS: { value: VersionSort; label: string }[] = [
	{ value: 'count', label: 'Most used' },
	{ value: 'version', label: 'Newest' }
];

const versionMax = $derived(Math.max(1, versions[0]?.count ?? 0));
const filteredVersions = $derived.by(() => {
	const rows =
		majorFilter === 'all' ? versions : versions.filter((v) => majorOf(v.version) === majorFilter);
	return versionSort === 'count'
		? rows
		: [...rows].sort((a, b) => compareVersionsDesc(a.version, b.version));
});
const visibleVersions = $derived(
	expanded ? filteredVersions : filteredVersions.slice(0, COLLAPSED_ROWS)
);

const segmentButton = (selected: boolean) => [
	'rounded-sm px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary motion-reduce:transition-none',
	selected ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
];
</script>

{#snippet breakdown(
	id: string,
	title: string,
	segments: (ShareSegment & { label: string; mono?: boolean })[]
)}
	<section aria-labelledby={id} class="flex flex-col gap-4">
		<h3 {id} class="text-sm text-muted-foreground">{title}</h3>
		<ShareBar
			{segments}
			class="h-4 rounded-md"
			label={segments.map((s) => `${s.label} ${percent(s.count)}`).join(', ')}
		/>
		<ul class="space-y-2 text-sm">
			{#each segments as segment (segment.key)}
				<li class="grid grid-cols-[0.625rem_minmax(0,1fr)_auto_3rem] items-center gap-2.5">
					<span class="size-2.5 rounded-[3px]" style:background={segment.color}></span>
					<span class={['truncate text-foreground', segment.mono && 'font-mono text-xs']}
						>{segment.label}</span
					>
					<span class="text-right text-foreground tabular-nums">{formatCount(segment.count)}</span>
					<span class="text-right text-muted-foreground tabular-nums"
						>{percent(segment.count)}</span
					>
				</li>
			{/each}
		</ul>
	</section>
{/snippet}

<Dialog.Content class="max-h-[85dvh] gap-10 overflow-y-auto sm:max-w-4xl sm:p-8">
	<Dialog.Header class="text-left sm:pe-6">
		<Dialog.Title class="text-xl tracking-tight">Server stats</Dialog.Title>
		<Dialog.Description class="flex flex-wrap gap-x-2.5">
			{#if updated}
				<span>Updated {formatDate(updated.date, true)}</span>
				<span aria-hidden="true">·</span>
			{/if}
			<a
				href="/docs/settings/analytics"
				class="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>How analytics work</a
			>
		</Dialog.Description>
	</Dialog.Header>

	<section
		class="grid items-end gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10"
		aria-labelledby="heartbeat-dialog-instances"
	>
		<div>
			<h3 id="heartbeat-dialog-instances" class="text-sm text-muted-foreground">Instances</h3>
			<p class="mt-1 text-6xl font-semibold tracking-tighter text-foreground tabular-nums">
				{formatCount(stats.total)}
			</p>
		</div>
		{#if history.length}
			<HistoryChart
				{history}
				axis
				label={`Instances per day for the last ${history.length} days`}
			/>
		{/if}
	</section>

	<div class="grid gap-10 md:grid-cols-2">
		{@render breakdown('heartbeat-dialog-types', 'Server types', typeSegments)}
		{@render breakdown('heartbeat-dialog-majors', 'Major versions', majorSegments)}
	</div>

	<section aria-labelledby="heartbeat-dialog-versions">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h3 id="heartbeat-dialog-versions" class="text-base font-semibold text-foreground">
				Versions
				<span class="font-normal text-muted-foreground tabular-nums">{versions.length}</span>
			</h3>
			<div class="flex flex-wrap gap-2 text-xs">
				<fieldset class="m-0 flex min-w-0 gap-0.5 rounded-md border border-border p-0.5">
					<legend class="sr-only">Filter by major version</legend>
					{#each filters as filter (filter.value)}
						<button
							type="button"
							class={segmentButton(majorFilter === filter.value)}
							aria-pressed={majorFilter === filter.value}
							onclick={() => {
								majorFilter = filter.value;
								expanded = false;
							}}
						>
							{filter.label}
						</button>
					{/each}
				</fieldset>
				<fieldset class="m-0 flex min-w-0 gap-0.5 rounded-md border border-border p-0.5">
					<legend class="sr-only">Sort versions</legend>
					{#each SORTS as sort (sort.value)}
						<button
							type="button"
							class={segmentButton(versionSort === sort.value)}
							aria-pressed={versionSort === sort.value}
							onclick={() => (versionSort = sort.value)}
						>
							{sort.label}
						</button>
					{/each}
				</fieldset>
			</div>
		</div>

		<ul class="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
			{#each visibleVersions as version (version.version)}
				<li
					class="relative grid grid-cols-[minmax(0,1fr)_auto_3rem] items-center gap-2.5 overflow-hidden rounded-md bg-muted/70 px-2.5 py-1.5 text-sm"
				>
					<span
						class="absolute inset-y-0 start-0 bg-primary/25"
						style:width={`${Math.max(0.5, (version.count / versionMax) * 100)}%`}
						aria-hidden="true"
					></span>
					<span class="relative flex min-w-0 items-center gap-2">
						<span class="truncate font-mono text-xs text-foreground" title={version.version}
							>{version.version}</span
						>
						{#if version.version === latest}
							<span
								class="shrink-0 rounded-full bg-success/15 px-1.5 text-[11px] leading-5 font-medium text-success"
								>latest</span
							>
						{:else if isPrerelease(version.version)}
							<span
								class="shrink-0 rounded-full bg-muted px-1.5 text-[11px] leading-5 text-muted-foreground"
								>pre</span
							>
						{/if}
					</span>
					<span class="relative text-right text-foreground tabular-nums"
						>{formatCount(version.count)}</span
					>
					<span class="relative text-right text-muted-foreground tabular-nums"
						>{percent(version.count)}</span
					>
				</li>
			{/each}
		</ul>

		{#if !expanded && filteredVersions.length > COLLAPSED_ROWS}
			<button
				type="button"
				class="mt-4 w-full rounded-md border border-dashed border-border py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
				onclick={() => (expanded = true)}
			>
				Show all {filteredVersions.length} versions
			</button>
		{/if}
	</section>
</Dialog.Content>
