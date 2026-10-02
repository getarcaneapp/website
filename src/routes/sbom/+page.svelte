<script lang="ts">
	import { browser } from '$app/env';
	import {
		AlertTriangleIcon,
		BoxIcon,
		CpuIcon,
		DownloadIcon,
		SecurityIcon
	} from '#lib/icons/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import type { SpdxDocument, DisplayPackage, SbomMetadata } from '#lib/types/sbom.type.js';
	import { extractDisplayPackages } from '#lib/types/sbom.type.js';

	const archFiles = {
		amd64: 'linux_amd64.spdx.json',
		arm64: 'linux_arm64.spdx.json',
		armv7: 'linux_armv7.spdx.json',
		riscv64: 'linux_riscv64.spdx.json'
	} as const;

	const archLabels = {
		amd64: 'linux/amd64',
		arm64: 'linux/arm64',
		armv7: 'linux/arm/v7',
		riscv64: 'linux/riscv64'
	} as const;

	type Arch = keyof typeof archFiles;

	const arches = Object.keys(archFiles) as Arch[];

	type ArchSboms = Record<Arch, SpdxDocument | null>;

	interface SbomData {
		metadata: SbomMetadata | null;
		manager: ArchSboms;
		agent: ArchSboms;
	}

	function emptyArchSboms(): ArchSboms {
		return { amd64: null, arm64: null, armv7: null, riscv64: null };
	}

	let sbomData = $state<SbomData>({
		metadata: null,
		manager: emptyArchSboms(),
		agent: emptyArchSboms()
	});

	let loading = $state(true);
	let error = $state<string | null>(null);

	let selectedImage = $state<'manager' | 'agent'>('manager');
	let selectedArch = $state<Arch>('amd64');
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
		debPackages: packages.filter((p) => p.type === 'deb').length
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
			await Promise.all(
				(['manager', 'agent'] as const).flatMap((image) =>
					arches.map(async (arch) => {
						const res = await fetch(`/sbom/${image}/${archFiles[arch]}`);
						sbomData[image][arch] = res.ok ? await res.json() : null;
					})
				)
			);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load SBOM data';
		} finally {
			loading = false;
		}
	}

	if (browser) loadSbomData();

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

<div class="relative isolate">
	<div class="container mx-auto flex min-w-0 flex-1 px-4 py-6 lg:py-8">
		<div class="mx-auto flex w-full max-w-400 flex-col gap-8">
			<header class="grid gap-3.5 border-b border-border pb-6">
				<div class="flex flex-wrap items-center gap-4">
					<SecurityIcon class="size-6 text-muted-foreground" />
					<div>
						<p class="font-mono text-xs font-medium text-primary">Security transparency</p>
						<h1 class="scroll-m-20 font-heading text-3xl font-semibold tracking-tight">
							Software Bill of Materials
						</h1>
					</div>
				</div>
				<p class="max-w-208 text-base text-muted-foreground">
					Full visibility into every package and dependency shipped inside Arcane images.
				</p>
			</header>

			{#if loading}
				<div class="flex flex-col items-center justify-center gap-4 py-16">
					<div
						class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
					></div>
					<p class="text-muted-foreground">Loading SBOM data...</p>
				</div>
			{:else if error}
				<div
					class="flex flex-col items-center gap-4 rounded-xl border border-destructive/20 bg-destructive/10 p-8"
				>
					<AlertTriangleIcon class="size-12 text-destructive" />
					<p class="text-center text-destructive">{error}</p>
					<p class="text-center text-sm text-muted-foreground">
						SBOM data is generated from the latest release. If this is a new deployment, it may take
						a few minutes for the data to be available.
					</p>
				</div>
			{:else}
				{#if sbomData.metadata}
					<div
						class="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-background px-5 py-4 sm:flex-row sm:items-center"
					>
						<div class="grid gap-1.5">
							<div class="flex flex-wrap items-center gap-3">
								<Badge variant="outline" mono>
									{sbomData.metadata.version}
								</Badge>
								<span class="text-sm text-muted-foreground">
									Updated {new Date(sbomData.metadata.updated).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</span>
							</div>
							<p class="text-sm text-muted-foreground">
								Export the raw SPDX 2.3 JSON if you need to automate audits.
							</p>
						</div>
						<Button variant="outline" size="sm" onclick={downloadSbom} disabled={!currentSbom}>
							<DownloadIcon class="mr-2 size-4" />
							Download SPDX JSON
						</Button>
					</div>
				{/if}

				<div class="grid gap-6 md:grid-cols-2 md:items-start">
					<div class="grid gap-1.5">
						<p class="text-xs font-medium text-muted-foreground">Image</p>
						<Tabs.Root bind:value={selectedImage} class="w-full sm:w-auto">
							<Tabs.List>
								<Tabs.Trigger value="manager">
									<BoxIcon class="mr-2 size-4" />
									Arcane (Manager)
								</Tabs.Trigger>
								<Tabs.Trigger value="agent">
									<CpuIcon class="mr-2 size-4" />
									Arcane Headless (Agent)
								</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
					</div>

					<div class="grid gap-1.5">
						<p class="text-xs font-medium text-muted-foreground">Architecture</p>
						<Tabs.Root bind:value={selectedArch}>
							<Tabs.List>
								{#each arches as arch (arch)}
									<Tabs.Trigger value={arch}>{archLabels[arch]}</Tabs.Trigger>
								{/each}
							</Tabs.List>
						</Tabs.Root>
					</div>
				</div>

				<div class="grid grid-cols-auto-fit-45 gap-4">
					<div class="rounded-lg border border-border bg-background px-4.5 py-4">
						<p class="text-sm text-muted-foreground">Total Packages</p>
						<p class="mt-1 text-2xl font-bold">{packageCounts.total}</p>
					</div>
					<div class="rounded-lg border border-border bg-background px-4.5 py-4">
						<p class="text-sm text-muted-foreground">Go Modules</p>
						<p class="mt-1 text-2xl font-bold">{packageCounts.goModules}</p>
					</div>
					<div class="rounded-lg border border-border bg-background px-4.5 py-4">
						<p class="text-sm text-muted-foreground">System Packages</p>
						<p class="mt-1 text-2xl font-bold">{packageCounts.debPackages}</p>
					</div>
				</div>

				<div class="flex flex-wrap items-end gap-6">
					<label class="grid flex-1 basis-64 gap-2">
						<span class="text-xs font-medium text-muted-foreground">Filter packages</span>
						<input
							type="text"
							placeholder="Search packages..."
							bind:value={searchQuery}
							class="h-9.5 rounded-md border border-border bg-background px-3.5 text-sm text-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none"
						/>
					</label>
					<div class="grid gap-2">
						<p class="text-xs font-medium text-muted-foreground">Package type</p>
						<Tabs.Root bind:value={packageFilter}>
							<Tabs.List>
								<Tabs.Trigger value="all">All</Tabs.Trigger>
								<Tabs.Trigger value="go-module">Go Modules</Tabs.Trigger>
								<Tabs.Trigger value="deb">System</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg border border-border bg-background">
					<Table.Root>
						<Table.Header>
							<Table.Row variant="surface">
								<Table.Head class="w-80">Package</Table.Head>
								<Table.Head class="w-42.5">Version</Table.Head>
								<Table.Head class="w-30">Type</Table.Head>
								<Table.Head>License</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredPackages as pkg (pkg.name + pkg.version)}
								<Table.Row>
									<Table.Cell><span class="font-mono text-sm">{pkg.name}</span></Table.Cell>
									<Table.Cell><span class="font-mono text-sm">{pkg.version}</span></Table.Cell>
									<Table.Cell>
										<Badge variant={getTypeColor(pkg.type)}>
											{pkg.type === 'go-module' ? 'Go' : pkg.type === 'deb' ? 'Deb' : 'Other'}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<span class="block max-w-80 truncate text-sm text-muted-foreground">
											{formatLicense(pkg.license)}
										</span>
									</Table.Cell>
								</Table.Row>
							{:else}
								<Table.Row>
									<Table.Cell colspan={4} class="text-center">
										<p class="py-6 whitespace-normal text-muted-foreground">
											{currentSbom
												? 'No packages found matching your search.'
												: `SBOM for ${archLabels[selectedArch]} is not available yet. It is generated with the next release.`}
										</p>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>

				<div class="text-center text-sm text-muted-foreground">
					<p>
						SBOMs are generated during the container image build and extracted from the attestations
						attached to the published images, so they reflect exactly what ships.
					</p>
					<p>Format: SPDX 2.3 JSON</p>
				</div>
			{/if}
		</div>
	</div>
</div>
