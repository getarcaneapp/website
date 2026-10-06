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

	let stats = $state<StatsResponse | null>(null);
	let statusError = $state<string | null>(null);

	const formatDate = (isoDate: string): string => {
		const date = new Date(`${isoDate}T00:00:00Z`);
		if (Number.isNaN(date.getTime())) return isoDate;
		return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
	};

	const normalizeVersion = (version: string): string => {
		const bare = version.replace(/^v/, '');
		return /^\d/.test(bare) ? `v${bare}` : bare;
	};

	const historyEntries = $derived(Array.isArray(stats?.history) ? stats.history : []);
	const history = $derived(
		[...historyEntries].sort((a, b) => a.date.localeCompare(b.date)).slice(-HISTORY_WINDOW)
	);
	const historyMax = $derived(Math.max(1, ...history.map((entry) => entry.count)));
	const versionBreakdown = $derived.by(() => {
		const normalized: Record<string, number> = {};
		for (const [version, count] of Object.entries(stats?.by_version ?? {})) {
			const key = normalizeVersion(version);
			normalized[key] = (normalized[key] ?? 0) + count;
		}
		return Object.entries(normalized)
			.map(([version, count]) => ({ version, count }))
			.sort((a, b) => b.count - a.count);
	});
	const typeBreakdown = $derived(
		Object.entries(stats?.by_type ?? {})
			.map(([type, count]) => ({ type, count }))
			.sort((a, b) => b.count - a.count)
	);
	const latestDateLabel = $derived.by(() => {
		if (!historyEntries.length) return null;
		const latest = historyEntries.reduce((current, entry) =>
			entry.date > current.date ? entry : current
		);
		return formatDate(latest.date);
	});

	const tiles = $derived([
		{ label: 'Active instances', value: stats ? String(stats.total) : '—' },
		{ label: 'Last update', value: latestDateLabel ?? '—' },
		{ label: 'Versions', value: versionBreakdown.length ? String(versionBreakdown.length) : '—' },
		{ label: 'Most common', value: versionBreakdown[0]?.version ?? '—', mono: true }
	]);

	$effect(() => {
		fetch(STATS_URL, { cache: 'no-store' })
			.then((response) => {
				if (!response.ok) throw new Error(`Unexpected status ${response.status}`);
				return response.json();
			})
			.then((data: StatsResponse) => (stats = data))
			.catch(() => (statusError = 'Status currently unavailable.'));
	});
</script>

<div class="grid grid-cols-2 divide-x divide-border border-b border-border md:grid-cols-4">
	{#each tiles as tile (tile.label)}
		<div class="flex flex-col gap-1.5 px-6 py-6 md:px-8">
			<span class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
				{tile.label}
			</span>
			<span class={['text-3xl font-bold tracking-tight text-foreground', tile.mono && 'font-mono']}>
				{tile.value}
			</span>
		</div>
	{/each}
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
				<p class="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">By type</p>
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
						style:height={`${Math.max(8, Math.round((entry.count / historyMax) * 44))}px`}
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
