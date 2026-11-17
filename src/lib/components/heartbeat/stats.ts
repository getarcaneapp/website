export interface StatsHistoryEntry {
	date: string;
	count: number;
}

export interface StatsResponse {
	total: number;
	by_type?: Record<string, number>;
	by_version?: Record<string, number>;
	history?: StatsHistoryEntry[];
}

export interface VersionCount {
	version: string;
	count: number;
}

export const STATS_URL = 'https://checkin.getarcane.app/stats';

const DAY_MS = 24 * 60 * 60 * 1000;

export const formatDate = (isoDate: string, withYear = false): string => {
	const date = new Date(`${isoDate}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return isoDate;
	return date.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: withYear ? 'numeric' : undefined,
		timeZone: 'UTC'
	});
};

export const normalizeVersion = (version: string): string => {
	const bare = version.replace(/^v/, '');
	return /^\d/.test(bare) ? `v${bare}` : bare;
};

export const sortHistory = (history: StatsHistoryEntry[] = []): StatsHistoryEntry[] =>
	[...history].sort((a, b) => a.date.localeCompare(b.date));

/**
 * One entry per UTC calendar day ending today; days with no record count as 0.
 * Covers the last `days` days, or everything since the first record when omitted.
 */
export const fillHistory = (sorted: StatsHistoryEntry[], days?: number): StatsHistoryEntry[] => {
	if (!sorted.length) return [];
	const counts = new Map(sorted.map((entry) => [entry.date, entry.count]));
	const today = Date.parse(new Date().toISOString().slice(0, 10));
	const first = Date.parse(sorted[0].date);
	const length = days ?? Math.max(1, Math.round((today - first) / DAY_MS) + 1);
	return Array.from({ length }, (_, i) => {
		const date = new Date(today - (length - 1 - i) * DAY_MS).toISOString().slice(0, 10);
		return { date, count: counts.get(date) ?? 0 };
	});
};

/** Merges `1.2.3` and `v1.2.3` and sorts by count, highest first. */
export const groupVersions = (byVersion: Record<string, number> = {}): VersionCount[] => {
	const normalized: Record<string, number> = {};
	for (const [version, count] of Object.entries(byVersion)) {
		const key = normalizeVersion(version);
		normalized[key] = (normalized[key] ?? 0) + count;
	}
	return Object.entries(normalized)
		.map(([version, count]) => ({ version, count }))
		.sort((a, b) => b.count - a.count);
};

const versionParts = (version: string): number[] | null => {
	const match = /^v(\d+)\.(\d+)\.(\d+)/.exec(version);
	return match ? match.slice(1).map(Number) : null;
};

/** Newest release first, prereleases below their release, non-semver labels last. */
export const compareVersionsDesc = (a: string, b: string): number => {
	const pa = versionParts(a);
	const pb = versionParts(b);
	if (!pa || !pb) return pa ? -1 : pb ? 1 : a.localeCompare(b);
	for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
	const preA = a.includes('-');
	const preB = b.includes('-');
	if (preA !== preB) return preA ? 1 : -1;
	return b.localeCompare(a, undefined, { numeric: true });
};

export const majorOf = (version: string): string => {
	const parts = versionParts(version);
	return parts ? `v${parts[0]}` : 'Other';
};
