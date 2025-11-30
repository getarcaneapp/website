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

<div class="container mx-auto flex min-w-0 flex-1 px-4 py-6 lg:py-8">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
		<!-- Header -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-3">
				<Shield class="text-primary size-8" />
				<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight">Software Bill of Materials</h1>
			</div>
			<p class="text-muted-foreground text-lg text-balance">
				Full transparency into all packages and dependencies included in Arcane container images.
			</p>
		</div>

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
				<div class="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
					<div class="flex items-center gap-4">
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
					<Button variant="outline" size="sm" onclick={downloadSbom} disabled={!currentSbom}>
						<Download class="mr-2 size-4" />
						Download SPDX JSON
					</Button>
				</div>
			{/if}

			<!-- Image & Architecture Selection -->
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

				<Tabs.Root bind:value={selectedArch}>
					<Tabs.List>
						<Tabs.Trigger value="amd64">linux/amd64</Tabs.Trigger>
						<Tabs.Trigger value="arm64">linux/arm64</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>

			<!-- Stats -->
			<div class="grid grid-cols-3 gap-4">
				<div class="bg-card rounded-lg border p-4">
					<p class="text-muted-foreground text-sm">Total Packages</p>
					<p class="text-2xl font-semibold">{packageCounts.total}</p>
				</div>
				<div class="bg-card rounded-lg border p-4">
					<p class="text-muted-foreground text-sm">Go Modules</p>
					<p class="text-2xl font-semibold">{packageCounts.goModules}</p>
				</div>
				<div class="bg-card rounded-lg border p-4">
					<p class="text-muted-foreground text-sm">System Packages</p>
					<p class="text-2xl font-semibold">{packageCounts.debPackages}</p>
				</div>
			</div>

			<!-- Filters -->
			<div class="flex flex-col gap-4 sm:flex-row">
				<input
					type="text"
					placeholder="Search packages..."
					bind:value={searchQuery}
					class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none sm:max-w-xs"
				/>
				<Tabs.Root bind:value={packageFilter}>
					<Tabs.List>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="go-module">Go Modules</Tabs.Trigger>
						<Tabs.Trigger value="deb">System</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>

			<!-- Package Table -->
			<div class="rounded-lg border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[300px]">Package</Table.Head>
							<Table.Head class="w-[150px]">Version</Table.Head>
							<Table.Head class="w-[100px]">Type</Table.Head>
							<Table.Head>License</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each filteredPackages as pkg (pkg.name + pkg.version)}
							<Table.Row>
								<Table.Cell class="font-mono text-sm">{pkg.name}</Table.Cell>
								<Table.Cell class="font-mono text-sm">{pkg.version}</Table.Cell>
								<Table.Cell>
									<Badge variant={getTypeColor(pkg.type)}>
										{pkg.type === 'go-module' ? 'Go' : pkg.type === 'deb' ? 'Deb' : 'Other'}
									</Badge>
								</Table.Cell>
								<Table.Cell class="text-muted-foreground max-w-[300px] truncate text-sm">
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
