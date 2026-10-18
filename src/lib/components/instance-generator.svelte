<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import {
		ChevronDownIcon,
		DatabaseIcon,
		FolderIcon,
		KeyIcon,
		LinkIcon,
		ServerIcon,
		SlidersIcon,
		TerminalIcon,
		UserIdIcon
	} from '#lib/icons/index.js';
	import { trackEvent } from '#lib/analytics.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import {
		getActiveFields,
		getDefaultConfigValues,
		generatorConfig,
		getDeploymentTarget,
		getTabsForTarget,
		isFieldVisible
	} from '#lib/config/instance-generator.js';
	import type {
		DeploymentTargetId,
		GeneratorField,
		GeneratorSection,
		GeneratorValues
	} from '#lib/types/instance-generator.type.js';
	import { generateInstance, generateRandomKey } from '#lib/utils/instance-generator.js';
	import GeneratorFieldInput from './instance-generator/generator-field.svelte';
	import OutputPanel from './instance-generator/output-panel.svelte';
	import TargetPicker from './instance-generator/target-picker.svelte';

	type FieldRun = { kind: 'inputs' | 'switches'; fields: GeneratorField[] };

	const sectionIcons: Record<string, Component> = {
		basic: SlidersIcon,
		agent: LinkIcon,
		hostAccess: ServerIcon,
		projectStorage: FolderIcon,
		runtime: TerminalIcon,
		secrets: KeyIcon,
		database: DatabaseIcon,
		auth: UserIdIcon
	};

	let target = $state<DeploymentTargetId>('docker');
	let config = $state<GeneratorValues>(getDefaultConfigValues());

	onMount(() => {
		config = {
			...config,
			...Object.fromEntries(
				generatorConfig
					.flatMap((tab) => tab.sections.flatMap((section) => section.fields))
					.filter((field) => field.canGenerate && !String(config[field.key]).trim())
					.map((field) => [field.key, generateRandomKey()])
			)
		};
	});

	let currentTarget = $derived(getDeploymentTarget(target));
	let tabs = $derived(getTabsForTarget(target));
	let files = $derived(generateInstance(target, config));
	let missing = $derived(
		getActiveFields({ target, config }).filter(
			(field) => field.required && !String(config[field.key]).trim()
		)
	);

	function visibleFields(section: GeneratorSection): GeneratorField[] {
		return section.fields.filter(
			(field) => field.key !== section.toggleKey && isFieldVisible(field, { target, config })
		);
	}

	function toggleField(section: GeneratorSection): GeneratorField | undefined {
		return section.fields.find(
			(field) => field.key === section.toggleKey && isFieldVisible(field, { target, config })
		);
	}

	function toRuns(fields: GeneratorField[]): FieldRun[] {
		return fields.reduce<FieldRun[]>((runs, field) => {
			const kind = field.type === 'checkbox' ? 'switches' : 'inputs';
			const last = runs.at(-1);
			if (last?.kind === kind) {
				last.fields.push(field);
				return runs;
			}
			return [...runs, { kind, fields: [field] }];
		}, []);
	}

	function getSocketProxyProviderAnalyticsValue(
		enabled: boolean,
		provider: string | boolean
	): 'none' | 'wollomatic' | 'tecnativa' {
		if (!enabled) return 'none';
		return provider === 'tecnativa' ? 'tecnativa' : 'wollomatic';
	}

	function getRegistryAnalyticsValue(value: string | boolean): 'ghcr' | 'quay' | 'docker' {
		if (value === 'quay' || value === 'docker') return value;
		return 'ghcr';
	}

	function trackExport(method: 'copy' | 'download') {
		const usesSocketProxy = target === 'docker' && config.useSocketProxy === true;
		trackEvent('Compose Generated', {
			deployment: target,
			access_method: usesSocketProxy ? 'socket_proxy' : 'direct_socket',
			socket_proxy_provider: getSocketProxyProviderAnalyticsValue(
				usesSocketProxy,
				config.socketProxyProvider
			),
			database: target === 'docker' && config.enableDatabase === true ? 'postgresql' : 'sqlite',
			authentication: config.enableOIDC === true ? 'oidc' : 'local',
			project_storage:
				typeof config.projectsHostPath === 'string' && config.projectsHostPath.trim()
					? 'host_mount'
					: 'named_volume',
			selinux: target === 'docker' && config.enableSelinux === true ? 'enabled' : 'disabled',
			registry: getRegistryAnalyticsValue(config.registry)
		});
		trackEvent('Compose Exported', { deployment: target, method });
	}
</script>

{#snippet fieldRuns(fields: GeneratorField[])}
	{#each toRuns(fields) as run, index (index)}
		{#if run.kind === 'inputs'}
			<div class="grid gap-x-4 gap-y-4 sm:grid-cols-2">
				{#each run.fields as field (field.key)}
					<GeneratorFieldInput {field} bind:value={config[field.key]} />
				{/each}
			</div>
		{:else}
			<div class="grid gap-3">
				{#each run.fields as field (field.key)}
					<GeneratorFieldInput {field} bind:value={config[field.key]} />
				{/each}
			</div>
		{/if}
	{/each}
{/snippet}

<div
	class="grid animate-fade-in-up items-start gap-6 motion-reduce:animate-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:gap-8"
>
	<div class="grid min-w-0 gap-6">
		<section aria-labelledby="generator-deployment" class="grid gap-3">
			<div class="flex items-center justify-between gap-3">
				<h2 id="generator-deployment" class="text-base font-semibold">Deployment</h2>
				<a
					href="#generator-output"
					class="-my-2 inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary hover:underline lg:hidden dark:text-primary-tint"
				>
					Jump to output
					<ChevronDownIcon class="size-3.5" />
				</a>
			</div>
			<TargetPicker bind:value={target} />
		</section>

		<div class="overflow-hidden rounded-xl border border-border bg-card">
			{#each tabs as tab (tab.id)}
				{#each tab.sections as section (section.id)}
					{@const Icon = sectionIcons[tab.id] ?? SlidersIcon}
					{@const toggle = toggleField(section)}
					{@const fields = visibleFields(section)}
					{@const basic = fields.filter((field) => !field.advanced)}
					{@const advanced = fields.filter((field) => field.advanced)}
					{#if toggle || fields.length > 0}
						<section
							aria-labelledby={`section-${section.id}`}
							class="grid gap-4 border-b border-border p-4 last:border-b-0 sm:p-5"
						>
							<div class="flex items-start justify-between gap-4">
								<div class="flex items-start gap-3">
									<span
										class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"
									>
										<Icon class="size-3.5" />
									</span>
									<div class="grid gap-0.5">
										<h3 id={`section-${section.id}`} class="text-sm font-semibold">
											{tab.label}
										</h3>
										<p class="text-[0.8125rem] leading-snug text-muted-foreground">
											{section.description}
										</p>
									</div>
								</div>
								{#if toggle}
									<Switch
										id={toggle.key}
										class="mt-1"
										aria-label={toggle.label}
										checked={config[toggle.key] === true}
										onCheckedChange={(checked) => (config[toggle.key] = checked === true)}
									/>
								{/if}
							</div>
							{#if basic.length > 0}
								<div class="grid gap-4">
									{@render fieldRuns(basic)}
								</div>
							{/if}
							{#if advanced.length > 0}
								<details class="group/advanced rounded-lg border border-dashed border-border">
									<summary
										class="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors select-none hover:text-foreground [&::-webkit-details-marker]:hidden"
									>
										<span>Advanced · {advanced.length}</span>
										<ChevronDownIcon
											class="size-3.5 transition-transform group-open/advanced:rotate-180"
										/>
									</summary>
									<div class="grid gap-4 border-t border-dashed border-border p-3">
										{@render fieldRuns(advanced)}
									</div>
								</details>
							{/if}
						</section>
					{/if}
				{/each}
			{/each}
		</div>
	</div>

	<aside
		id="generator-output"
		aria-label="Generated output"
		class="min-w-0 scroll-mt-below-header lg:sticky lg:top-below-header"
	>
		<OutputPanel target={currentTarget} {files} {missing} onExport={trackExport} />
	</aside>
</div>
