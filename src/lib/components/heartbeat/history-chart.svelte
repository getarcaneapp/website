<script lang="ts">
import { cn } from '#lib/utils.js';
import { formatDate, type StatsHistoryEntry } from './stats';

let {
	history,
	label,
	class: className
}: { history: StatsHistoryEntry[]; label: string; class?: string } = $props();

const max = $derived(Math.max(1, ...history.map((entry) => entry.count)));
const middle = $derived(history.length > 20 ? history[Math.floor(history.length / 2)] : undefined);
</script>

<ul class={cn('flex h-28 items-end gap-1.5', className)} aria-label={label}>
	{#each history as entry, index (entry.date)}
		<li class="flex h-full min-w-0 flex-1">
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
					style:height={entry.count ? `${Math.max(6, (entry.count / max) * 100)}%` : '2px'}
				></div>
				<span
					class={[
						'pointer-events-none absolute -top-7 z-10 rounded bg-foreground px-1.5 py-0.5 text-[11px] whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 motion-reduce:transition-none',
						index < 2
							? 'left-0'
							: index >= history.length - 2
								? 'right-0'
								: 'left-1/2 -translate-x-1/2'
					]}
					aria-hidden="true"
					>{`${formatDate(entry.date)} · ${entry.count}`}</span
				>
			</button>
		</li>
	{/each}
</ul>
{#if history.length}
	<div class="mt-2 flex justify-between text-xs text-muted-foreground">
		<span>{formatDate(history[0].date)}</span>
		{#if middle}
			<span>{formatDate(middle.date)}</span>
		{/if}
		<span>{formatDate(history[history.length - 1].date)}</span>
	</div>
{/if}
