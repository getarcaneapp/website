<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import Package from '@lucide/svelte/icons/package';
	import Cpu from '@lucide/svelte/icons/cpu';
	import Shield from '@lucide/svelte/icons/shield';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { SpdxDocument, DisplayPackage, SbomMetadata } from '$lib/types/sbom.type.js';
	import { extractDisplayPackages } from '$lib/types/sbom.type.js';

	interface SbomData {
		metadata: SbomMetadata | null;
		manager: {
			amd64: SpdxDocument | null;
			arm64: SpdxDocument | null;
		};
		agent: {
			amd64: SpdxDocument | null;
			arm64: SpdxDocument | null;
		};
	}

	let sbomData = $state<SbomData>({
		metadata: null,
		manager: { amd64: null, arm64: null },
		agent: { amd64: null, arm64: null },
	});

	let loading = $state(true);
	let error = $state<string | null>(null);

	let selectedImage = $state<'manager' | 'agent'>('manager');
	let selectedArch = $state<'amd64' | 'arm64'>('amd64');
	let packageFilter = $state<'all' | 'go-module' | 'deb'>('all');
	let searchQuery = $state('');

	const currentSbom = $derived(sbomData[selectedImage][selectedArch]);
	const packages = $derived(currentSbom ? extractDisplayPackages(currentSbom) : []);

	const filteredPackages = $derived(
		packages.filter((pkg) => {
			const matchesFilter = packageFilter === 'all' || pkg.type === packageFilter;
			const matchesSearch =
				searchQuery === '' ||
				pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pkg.version.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesFilter && matchesSearch;
		})
	);

	const packageCounts = $derived({
		total: packages.length,
		goModules: packages.filter((p) => p.type === 'go-module').length,
		debPackages: packages.filter((p) => p.type === 'deb').length,
	});

	async function loadSbomData() {
		loading = true;
		error = null;

		try {
			// Load metadata first
			const metaRes = await fetch('/sbom/metadata.json');
			if (!metaRes.ok) {
				throw new Error('SBOM data not available. Please check back later.');
			}
			sbomData.metadata = await metaRes.json();

			// Load all SBOM files in parallel
			const [managerAmd64, managerArm64, agentAmd64, agentArm64] = await Promise.all([
				fetch('/sbom/manager/linux_amd64.spdx.json').then((r) => (r.ok ? r.json() : null)),
				fetch('/sbom/manager/linux_arm64.spdx.json').then((r) => (r.ok ? r.json() : null)),
				fetch('/sbom/agent/linux_amd64.spdx.json').then((r) => (r.ok ? r.json() : null)),
				fetch('/sbom/agent/linux_arm64.spdx.json').then((r) => (r.ok ? r.json() : null)),
			]);

			sbomData.manager.amd64 = managerAmd64;
			sbomData.manager.arm64 = managerArm64;
			sbomData.agent.amd64 = agentAmd64;
			sbomData.agent.arm64 = agentArm64;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load SBOM data';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadSbomData();
	});

	function formatLicense(license: string): string {
		if (license === 'NOASSERTION' || !license) return '—';
		// Truncate long license strings
		if (license.length > 50) {
			return license.slice(0, 47) + '...';
		}
		return license;
	}

	function getTypeColor(type: string): 'default' | 'secondary' | 'outline' {
		switch (type) {
			case 'go-module':
				return 'default';
			case 'deb':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	function downloadSbom() {
		if (!currentSbom) return;
		const filename = `arcane-${selectedImage}-${selectedArch}.spdx.json`;
		const blob = new Blob([JSON.stringify(currentSbom, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>SBOM - Software Bill of Materials | Arcane</title>
	<meta
		name="description"
		content="View the Software Bill of Materials (SBOM) for Arcane container images. Full transparency into all packages and dependencies."
	/>
</svelte:head>

<div class="docs-theme relative isolate">
	<div class="docs-shell pointer-events-none" aria-hidden="true"></div>
	<div class="container mx-auto flex min-w-0 flex-1 px-4 py-6 lg:py-8">
		<div class="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
			<!-- Header -->
			<header class="sbom-hero">
				<div class="sbom-hero__title">
					<div class="sbom-hero__icon">
						<Shield class="size-6 text-white" />
					</div>
					<div>
						<p class="sbom-eyebrow">Security transparency</p>
						<h1 class="font-heading scroll-m-20 text-4xl font-semibold tracking-tight">Software Bill of Materials</h1>
					</div>
				</div>
				<p class="sbom-hero__subtitle">
					Full visibility into every package and dependency shipped inside Arcane images.
				</p>
			</header>

		{#if loading}
			<div class="flex flex-col items-center justify-center gap-4 py-16">
				<div class="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent"></div>
				<p class="text-muted-foreground">Loading SBOM data...</p>
			</div>
		{:else if error}
			<div class="bg-destructive/10 border-destructive/20 flex flex-col items-center gap-4 rounded-lg border p-8">
				<AlertTriangle class="text-destructive size-12" />
				<p class="text-destructive text-center">{error}</p>
				<p class="text-muted-foreground text-center text-sm">
					SBOM data is generated from the latest release. If this is a new deployment, it may take a few minutes for
					the data to be available.
				</p>
			</div>
		{:else}
			<!-- Version info -->
			{#if sbomData.metadata}
				<div class="sbom-meta">
					<div class="sbom-meta__left">
						<div class="sbom-meta__pill">
							<Badge variant="outline" class="font-mono">
								{sbomData.metadata.version}
							</Badge>
							<span class="text-muted-foreground text-sm">
								Updated {new Date(sbomData.metadata.updated).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</span>
						</div>
						<p class="sbom-meta__note">Export the raw SPDX 2.3 JSON if you need to automate audits.</p>
					</div>
					<Button variant="outline" size="sm" onclick={downloadSbom} disabled={!currentSbom} class="sbom-download">
						<Download class="mr-2 size-4" />
						Download SPDX JSON
					</Button>
				</div>
			{/if}

			<!-- Image & Architecture Selection -->
			<div class="sbom-controls">
				<div class="sbom-control">
					<p class="sbom-control__label">Image</p>
					<Tabs.Root bind:value={selectedImage} class="w-full sm:w-auto">
						<Tabs.List>
							<Tabs.Trigger value="manager">
								<Package class="mr-2 size-4" />
								Arcane (Manager)
							</Tabs.Trigger>
							<Tabs.Trigger value="agent">
								<Cpu class="mr-2 size-4" />
								Arcane Headless (Agent)
							</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
				</div>

				<div class="sbom-control">
					<p class="sbom-control__label">Architecture</p>
					<Tabs.Root bind:value={selectedArch}>
						<Tabs.List>
							<Tabs.Trigger value="amd64">linux/amd64</Tabs.Trigger>
							<Tabs.Trigger value="arm64">linux/arm64</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
				</div>
			</div>

			<!-- Stats -->
			<div class="sbom-stats">
				<div class="sbom-stat">
					<p class="sbom-stat__label">Total Packages</p>
					<p class="sbom-stat__value">{packageCounts.total}</p>
				</div>
				<div class="sbom-stat">
					<p class="sbom-stat__label">Go Modules</p>
					<p class="sbom-stat__value">{packageCounts.goModules}</p>
				</div>
				<div class="sbom-stat">
					<p class="sbom-stat__label">System Packages</p>
					<p class="sbom-stat__value">{packageCounts.debPackages}</p>
				</div>
			</div>

			<!-- Filters -->
			<div class="sbom-filters">
				<label class="sbom-search">
					<span class="sbom-search__label">Filter packages</span>
					<input
						type="text"
						placeholder="Search packages..."
						bind:value={searchQuery}
						class="sbom-search__input"
					/>
				</label>
				<div class="sbom-filter-tabs">
					<p class="sbom-control__label">Package type</p>
					<Tabs.Root bind:value={packageFilter}>
						<Tabs.List>
							<Tabs.Trigger value="all">All</Tabs.Trigger>
							<Tabs.Trigger value="go-module">Go Modules</Tabs.Trigger>
							<Tabs.Trigger value="deb">System</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
				</div>
			</div>

			<!-- Package Table -->
			<div class="sbom-table">
				<Table.Root>
					<Table.Header>
						<Table.Row class="sbom-table__head">
							<Table.Head class="w-[320px]">Package</Table.Head>
							<Table.Head class="w-[170px]">Version</Table.Head>
							<Table.Head class="w-[120px]">Type</Table.Head>
							<Table.Head>License</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each filteredPackages as pkg (pkg.name + pkg.version)}
							<Table.Row class="sbom-table__row">
								<Table.Cell class="sbom-table__package">{pkg.name}</Table.Cell>
								<Table.Cell class="sbom-table__version">{pkg.version}</Table.Cell>
								<Table.Cell>
									<Badge variant={getTypeColor(pkg.type)}>
										{pkg.type === 'go-module' ? 'Go' : pkg.type === 'deb' ? 'Deb' : 'Other'}
									</Badge>
								</Table.Cell>
								<Table.Cell class="sbom-table__license">
									{formatLicense(pkg.license)}
								</Table.Cell>
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={4} class="text-muted-foreground py-8 text-center">
									No packages found matching your search.
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<!-- Footer info -->
			<div class="text-muted-foreground text-center text-sm">
				<p>
					SBOM generated using <a
						href="https://depot.dev"
						target="_blank"
						rel="noopener noreferrer"
						class="text-foreground underline underline-offset-4">Depot</a
					>
					during the container build process.
				</p>
				<p>Format: SPDX 2.3 JSON</p>
			</div>
		{/if}
		</div>
	</div>
</div>

<style>
	.sbom-hero {
		display: grid;
		gap: 0.85rem;
		padding: 1.5rem;
		border-radius: 1.5rem;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		background: color-mix(in oklab, var(--card) 75%, transparent);
		box-shadow: 0 28px 60px -50px oklch(0 0 0 / 0.45);
	}

	.sbom-hero__title {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.sbom-hero__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: linear-gradient(135deg, oklch(0.606 0.25 292.717), oklch(0.7 0.23 300));
		box-shadow: 0 16px 30px -20px oklch(0.6 0.2 292 / 0.6);
	}

	.sbom-eyebrow {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.32em;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.sbom-hero__subtitle {
		color: var(--muted-foreground);
		font-size: 1rem;
		max-width: 52rem;
	}

	.sbom-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1rem 1.25rem;
		border-radius: 1.25rem;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		background: color-mix(in oklab, var(--background) 90%, transparent);
	}

	.sbom-meta__left {
		display: grid;
		gap: 0.35rem;
	}

	.sbom-meta__pill {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.sbom-meta__note {
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	:global(.sbom-download) {
		border-color: color-mix(in oklab, var(--primary) 35%, transparent);
	}

	.sbom-controls {
		display: grid;
		gap: 1.5rem;
	}

	.sbom-control {
		display: grid;
		gap: 0.4rem;
	}

	.sbom-control__label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.26em;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.sbom-stats {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}

	.sbom-stat {
		border-radius: 1.1rem;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		background: color-mix(in oklab, var(--card) 75%, transparent);
		padding: 1rem 1.1rem;
	}

	.sbom-stat__label {
		font-size: 0.8rem;
		color: var(--muted-foreground);
	}

	.sbom-stat__value {
		font-size: 1.6rem;
		font-weight: 700;
		margin-top: 0.25rem;
	}

	.sbom-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		align-items: end;
	}

	.sbom-search {
		display: grid;
		gap: 0.45rem;
		flex: 1 1 260px;
	}

	.sbom-search__label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.26em;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.sbom-search__input {
		height: 42px;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		background: color-mix(in oklab, var(--background) 92%, transparent);
		padding: 0 0.9rem;
		font-size: 0.95rem;
		color: var(--foreground);
	}

	.sbom-search__input:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent);
		border-color: color-mix(in oklab, var(--primary) 40%, transparent);
	}

	.sbom-filter-tabs {
		display: grid;
		gap: 0.45rem;
	}

	.sbom-table {
		border-radius: 1.25rem;
		border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
		overflow: hidden;
		background: color-mix(in oklab, var(--card) 75%, transparent);
	}

	:global(.sbom-table__head) {
		background: color-mix(in oklab, var(--background) 85%, transparent);
	}

	:global(.sbom-table__head) :global(th) {
		font-size: 0.7rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	:global(.sbom-table__row) {
		border-color: color-mix(in oklab, var(--border) 60%, transparent);
	}

	:global(.sbom-table__package),
	:global(.sbom-table__version) {
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}

	:global(.sbom-table__license) {
		color: var(--muted-foreground);
		max-width: 320px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.85rem;
	}

	@media (min-width: 768px) {
		.sbom-controls {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: start;
		}
	}

	@media (max-width: 640px) {
		.sbom-meta {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
