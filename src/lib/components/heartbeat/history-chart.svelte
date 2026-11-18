<script lang="ts">
import { cn } from '#lib/utils.js';
import { formatCount, formatDate, formatTick, niceTicks, type StatsHistoryEntry } from './stats';

let {
	history,
	label,
	axis = false,
	class: className
}: {
	history: StatsHistoryEntry[];
	label: string;
	/** Draws y gridlines plus the first, middle and last dates. */
	axis?: boolean;
	class?: string;
} = $props();

const gradientId = $props.id();

let active = $state<number | null>(null);

const peak = $derived(Math.max(1, ...history.map((entry) => entry.count)));
const ticks = $derived(axis ? niceTicks(peak) : []);
const top = $derived(axis ? (ticks.at(-1) ?? peak) : peak * 1.08);
const step = $derived(history.length > 1 ? 100 / (history.length - 1) : 100);

const points = $derived(
	history.map((entry, index) => ({
		...entry,
		x: history.length > 1 ? index * step : 50,
		y: 100 - (entry.count / top) * 100
	}))
);
const line = $derived(
	points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
);
const shown = $derived(active === null ? undefined : points[active]);
const dot = $derived(shown ?? points.at(-1));
const dateLabels = $derived(
	history.length > 2
		? [history[0], history[Math.floor(history.length / 2)], history[history.length - 1]]
		: history
);

const tooltipAlign = (index: number) =>
	index < 2 ? '' : index >= history.length - 2 ? '-translate-x-full' : '-translate-x-1/2';
</script>

<div class={cn('relative', axis ? 'h-44 ps-9 pb-6' : 'h-24 pe-3 pt-3', className)}>
	{#each ticks as tick (tick)}
		<div
			class="pointer-events-none absolute inset-x-0 ps-9"
			style:bottom={`calc(1.5rem + (100% - 1.5rem) * ${tick / top})`}
			aria-hidden="true"
		>
			<span
				class="absolute start-0 w-7 -translate-y-1/2 text-right text-[11px] text-muted-foreground tabular-nums"
				>{formatTick(tick)}</span
			>
			<span class="block border-t border-dashed border-border"></span>
		</div>
	{/each}

	<div class="relative h-full">
		<svg
			class="absolute inset-0 size-full overflow-visible"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" style:stop-color="var(--primary)" stop-opacity="0.35" />
					<stop offset="1" style:stop-color="var(--primary)" stop-opacity="0" />
				</linearGradient>
			</defs>
			{#if points.length}
				<path d={`${line} L100,100 L0,100 Z`} fill={`url(#${gradientId})`} />
				<path
					d={line}
					fill="none"
					stroke="var(--primary)"
					stroke-width="2"
					stroke-linejoin="round"
					stroke-linecap="round"
					vector-effect="non-scaling-stroke"
				/>
			{/if}
		</svg>

		{#if shown}
			<span
				class="pointer-events-none absolute inset-y-0 border-s border-dashed border-muted-foreground/50"
				style:left={`${shown.x}%`}
				aria-hidden="true"
			></span>
		{/if}
		{#if dot}
			<span
				class="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary"
				style:left={`${dot.x}%`}
				style:top={`${dot.y}%`}
				aria-hidden="true"
			></span>
		{/if}

		<ul class="absolute inset-0" aria-label={label}>
			{#each points as point, index (point.date)}
				<li
					class="absolute inset-y-0"
					style:left={`${index === 0 ? 0 : point.x - step / 2}%`}
					style:right={`${index === points.length - 1 ? 0 : 100 - point.x - step / 2}%`}
				>
					<button
						type="button"
						class="block size-full cursor-default rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						aria-label={`${formatDate(point.date)}: ${formatCount(point.count)} ${point.count === 1 ? 'server' : 'servers'}`}
						onpointerenter={() => (active = index)}
						onpointerleave={() => (active = null)}
						onfocus={() => (active = index)}
						onblur={() => (active = null)}
					></button>
				</li>
			{/each}
		</ul>

		{#if shown && active !== null}
			<span
				class={[
					'pointer-events-none absolute z-10 -mt-2 -translate-y-full rounded bg-foreground px-1.5 py-0.5 text-[11px] whitespace-nowrap text-background tabular-nums',
					tooltipAlign(active)
				]}
				style:left={`${shown.x}%`}
				style:top={`${shown.y}%`}
				aria-hidden="true"
				>{`${formatDate(shown.date)} · ${formatCount(shown.count)}`}</span
			>
		{/if}
	</div>

	{#if axis}
		<div
			class="absolute inset-x-0 bottom-0 flex justify-between ps-9 text-[11px] text-muted-foreground"
			aria-hidden="true"
		>
			{#each dateLabels as entry (entry.date)}
				<span>{formatDate(entry.date)}</span>
			{/each}
		</div>
	{/if}
</div>
