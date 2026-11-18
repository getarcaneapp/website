<script lang="ts">
import * as Dialog from '#lib/components/ui/dialog/index.js';
import { ChartIcon } from '#lib/icons/index.js';
import HistoryChart from './heartbeat/history-chart.svelte';
import ShareBar from './heartbeat/share-bar.svelte';
import {
	fillHistory,
	formatCount,
	formatPercent,
	groupVersions,
	OTHER_SHADE,
	STATS_URL,
	type StatsResponse,
	shadeAt,
	sortHistory
} from './heartbeat/stats';
import StatsDialog from './heartbeat/stats-dialog.svelte';

const HISTORY_WINDOW = 14;
const TOP_VERSIONS = 3;
const DONUT_RADIUS = 44;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

let stats = $state<StatsResponse | null>(null);
let statusError = $state<string | null>(null);

const history = $derived(fillHistory(sortHistory(stats?.history), HISTORY_WINDOW));
const versions = $derived(groupVersions(stats?.by_version));
const total = $derived(stats?.total ?? 0);

const versionSlices = $derived.by(() => {
	const top = versions.slice(0, TOP_VERSIONS).map((v, index) => ({
		key: v.version,
		label: v.version,
		count: v.count,
		color: shadeAt(index)
	}));
	const rest = versions.slice(TOP_VERSIONS).reduce((sum, v) => sum + v.count, 0);
	const slices = rest
		? [...top, { key: 'others', label: 'Others', count: rest, color: OTHER_SHADE }]
		: top;
	const sum = Math.max(
		1,
		slices.reduce((acc, s) => acc + s.count, 0)
	);
	return slices.map((slice, index) => ({
		...slice,
		length: (slice.count / sum) * DONUT_CIRCUMFERENCE,
		offset:
			(slices.slice(0, index).reduce((acc, s) => acc + s.count, 0) / sum) * DONUT_CIRCUMFERENCE
	}));
});

const typeSegments = $derived(
	Object.entries(stats?.by_type ?? {})
		.map(([type, count]) => ({ key: type, count }))
		.sort((a, b) => (a.key === 'unknown' ? 1 : b.key === 'unknown' ? -1 : b.count - a.count))
		.map((segment, index) => ({
			...segment,
			color: segment.key === 'unknown' ? OTHER_SHADE : shadeAt(index * 2)
		}))
);
const knownTypes = $derived(typeSegments.filter((t) => t.key !== 'unknown').slice(0, 2));
const unknownCount = $derived(typeSegments.find((t) => t.key === 'unknown')?.count ?? 0);

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
	<header class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
		<h2
			id="heartbeat-title"
			class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
		>
			Running Arcane servers
		</h2>
		<div class="flex shrink-0 items-center gap-5 text-sm">
			<a
				href="/docs/settings/analytics"
				class="rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				How analytics work
			</a>
			<Dialog.Trigger
				disabled={!stats}
				class="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-primary/20 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none"
			>
				<ChartIcon class="size-4 text-primary" aria-hidden="true" />
				All stats
			</Dialog.Trigger>
		</div>
	</header>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<section
			class="relative flex min-h-52 flex-col overflow-hidden rounded-xl border border-border bg-card p-5 sm:col-span-2 lg:col-span-1"
			aria-labelledby="heartbeat-instances"
		>
			<h3 id="heartbeat-instances" class="text-sm text-muted-foreground">Instances</h3>
			<p
				class="mt-2 text-5xl font-semibold tracking-tighter text-foreground tabular-nums lg:text-6xl"
			>
				{stats ? formatCount(total) : '—'}
			</p>
			{#if history.length}
				<HistoryChart
					{history}
					class="absolute inset-x-0 bottom-0"
					label={`Instances per day for the last ${HISTORY_WINDOW} days`}
				/>
			{/if}
		</section>

		<section
			class="flex min-h-52 flex-col rounded-xl border border-border bg-card p-5"
			aria-labelledby="heartbeat-versions"
		>
			<h3 id="heartbeat-versions" class="text-sm text-muted-foreground">Versions in use</h3>
			{#if versionSlices.length}
				<div class="mt-4 grid flex-1 grid-cols-[7rem_minmax(0,1fr)] items-center gap-5">
					<svg
						viewBox="0 0 112 112"
						class="size-28"
						role="img"
						aria-label={versionSlices
							.map((s) => `${s.label} ${formatPercent(s.count, total)}`)
							.join(', ')}
					>
						{#each versionSlices as slice (slice.key)}
							<circle
								cx="56"
								cy="56"
								r={DONUT_RADIUS}
								fill="none"
								stroke-width="14"
								style:stroke={slice.color}
								stroke-dasharray={`${Math.max(0, slice.length - 2)} ${DONUT_CIRCUMFERENCE}`}
								stroke-dashoffset={-slice.offset}
								transform="rotate(-90 56 56)"
							/>
						{/each}
						<text
							x="56"
							y="60"
							text-anchor="middle"
							class="fill-foreground text-[22px] font-semibold tabular-nums"
						>
							{versions.length}
						</text>
						<text x="56" y="75" text-anchor="middle" class="fill-muted-foreground text-[10px]">
							versions
						</text>
					</svg>
					<ul class="space-y-2 text-sm">
						{#each versionSlices as slice (slice.key)}
							<li class="flex items-center gap-2.5">
								<span class="size-2.5 shrink-0 rounded-[3px]" style:background={slice.color}></span>
								<span
									class={[
										'min-w-0 truncate text-foreground',
										slice.key !== 'others' && 'font-mono text-xs'
									]}
									>{slice.label}</span
								>
								<span class="ms-auto text-muted-foreground tabular-nums"
									>{formatPercent(slice.count, total)}</span
								>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<p class="mt-4 text-sm text-muted-foreground">
					{stats ? 'No version data yet.' : 'Loading…'}
				</p>
			{/if}
		</section>

		<section
			class="flex min-h-52 flex-col rounded-xl border border-border bg-card p-5"
			aria-labelledby="heartbeat-types"
		>
			<h3 id="heartbeat-types" class="text-sm text-muted-foreground">Server types</h3>
			{#if knownTypes.length}
				<dl class="mt-4 grid grid-cols-2 gap-4">
					{#each knownTypes as type (type.key)}
						<div class="flex flex-col-reverse">
							<dt class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
								<span class="size-2.5 shrink-0 rounded-[3px]" style:background={type.color}></span>
								<span class="tabular-nums">{formatCount(type.count)} {type.key}s</span>
							</dt>
							<dd class="ms-0 text-4xl font-semibold tracking-tight text-foreground tabular-nums">
								{formatPercent(type.count, total)}
							</dd>
						</div>
					{/each}
				</dl>
				<div class="mt-auto pt-5">
					<ShareBar
						segments={typeSegments}
						label={typeSegments.map((t) => `${formatPercent(t.count, total)} ${t.key}`).join(', ')}
					/>
					{#if unknownCount}
						<p class="mt-2 text-xs text-muted-foreground tabular-nums">
							{formatCount(unknownCount)}
							unknown
						</p>
					{/if}
				</div>
			{:else}
				<p class="mt-4 text-sm text-muted-foreground">{stats ? 'No type data yet.' : 'Loading…'}</p>
			{/if}
		</section>
	</div>

	{#if statusError}
		<p class="mt-6 text-xs text-muted-foreground">{statusError}</p>
	{/if}

	{#if stats}
		<StatsDialog {stats} {versions} />
	{/if}
</Dialog.Root>
