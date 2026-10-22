<script lang="ts">
import { onMount, tick } from 'svelte';
import { trackEvent } from '#lib/analytics.js';
import { Switch } from '#lib/components/ui/switch/index.js';
import {
	generatorConfig,
	getActiveFields,
	getDefaultConfigValues,
	getDeploymentTarget,
	getTabsForTarget,
	isFieldVisible
} from '#lib/config/instance-generator.js';
import { ChevronDownIcon } from '#lib/icons/index.js';
import type {
	DeploymentTargetId,
	GeneratorField,
	GeneratorSection,
	GeneratorValues
} from '#lib/types/instance-generator.type.js';
import { generateInstance, generateRandomKey } from '#lib/utils/instance-generator.js';
import GeneratorFieldInput from './instance-generator/generator-field.svelte';
import OutputPanel, { type FieldIssue } from './instance-generator/output-panel.svelte';
import TargetPicker from './instance-generator/target-picker.svelte';

type FieldRun = { kind: 'inputs' | 'switches'; fields: GeneratorField[] };

type View = 'configure' | 'output';

const views: { id: View; label: string }[] = [
	{ id: 'configure', label: 'Configure' },
	{ id: 'output', label: 'Output' }
];
const focusRing =
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

let target = $state<DeploymentTargetId>('docker');
let config = $state<GeneratorValues>(getDefaultConfigValues());

// Fill blank auto-generated secrets once, on first load. They stay fixed until the user
// clicks Generate, so output stays a pure function of `config`.
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
let view = $state<View>('configure');
let root = $state<HTMLDivElement>();
let activeFields = $derived(getActiveFields({ target, config }));
let fieldErrors = $derived(
	Object.fromEntries(
		activeFields.flatMap((field) => {
			const value = config[field.key];
			const error = typeof value === 'string' ? field.validate?.(value) : undefined;
			return error ? [[field.key, error]] : [];
		})
	) as Record<string, string>
);
let issues = $derived(
	activeFields.flatMap((field): FieldIssue[] => {
		const missing = field.required && !String(config[field.key]).trim();
		const message = missing
			? field.canGenerate
				? 'Required. Click Generate to create one.'
				: 'Required.'
			: fieldErrors[field.key];
		return message ? [{ key: field.key, label: field.label, message }] : [];
	})
);

async function showView(next: View) {
	view = next;
	await tick();
	if (root && root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: 'start' });
}

async function focusField(key: string) {
	await showView('configure');
	const element = document.getElementById(key);
	for (
		let details = element?.closest('details');
		details;
		details = details.parentElement?.closest('details')
	) {
		details.open = true;
	}
	element?.scrollIntoView({ block: 'center' });
	element?.focus({ preventScroll: true });
}

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
		runs.push({ kind, fields: [field] });
		return runs;
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
		<div class={run.kind === 'inputs' ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4'}>
			{#each run.fields as field (field.key)}
				<GeneratorFieldInput
					{field}
					bind:value={config[field.key]}
					error={fieldErrors[field.key]}
				/>
			{/each}
		</div>
	{/each}
{/snippet}

<div bind:this={root} class="grid scroll-mt-[var(--sl-nav-height,4rem)] gap-6">
	<div
		class="sticky top-[var(--sl-nav-height,4rem)] z-10 -mx-4 border-b border-border bg-background px-4 py-2 lg:hidden"
	>
		<fieldset class="m-0 grid min-w-0 grid-cols-2 gap-1 rounded-lg border-0 bg-muted p-1">
			<legend class="sr-only">Show</legend>
			{#each views as option (option.id)}
				<button
					type="button"
					aria-pressed={view === option.id}
					class={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs ${focusRing}`}
					onclick={() => showView(option.id)}
				>
					{option.label}
					{#if option.id === 'output' && issues.length > 0}
						<span
							class="grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-2xs font-semibold text-white dark:text-background"
						>
							{issues.length}<span class="sr-only"> to fix</span>
						</span>
					{/if}
				</button>
			{/each}
		</fieldset>
	</div>

	<div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:gap-12">
		<form
			aria-label="Configure"
			class={`min-w-0 ${view === 'output' ? 'max-lg:hidden' : ''}`}
			novalidate
			onsubmit={(event) => event.preventDefault()}
		>
			<section aria-labelledby="generator-deployment" class="grid gap-4 pb-6">
				<h2 id="generator-deployment" class="text-base font-semibold">Deployment</h2>
				<TargetPicker bind:value={target} />
			</section>

			{#each tabs as tab (tab.id)}
				{#each tab.sections as section (section.id)}
					{@const toggle = toggleField(section)}
					{@const fields = visibleFields(section)}
					{@const basic = fields.filter((field) => !field.advanced)}
					{@const advanced = fields.filter((field) => field.advanced)}
					{#if toggle || fields.length > 0}
						<section
							aria-labelledby={`section-${section.id}`}
							class="grid gap-4 border-t border-border py-6"
						>
							<div class="flex items-start justify-between gap-4">
								<div class="grid gap-0.5">
									<h2 id={`section-${section.id}`} class="text-base font-semibold">
										{tab.label}
									</h2>
									<p
										id={`section-${section.id}-hint`}
										class="text-[0.8125rem] leading-snug text-muted-foreground"
									>
										{section.description}
									</p>
								</div>
								{#if toggle}
									<Switch
										id={toggle.key}
										class={`mt-1 ${focusRing}`}
										aria-label={toggle.label}
										aria-describedby={`section-${section.id}-hint`}
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
								<details class="group/advanced -mb-2 border-t border-border">
									<summary
										class={`flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors select-none hover:text-foreground [&::-webkit-details-marker]:hidden ${focusRing}`}
									>
										<ChevronDownIcon
											class="size-4 -rotate-90 transition-transform group-open/advanced:rotate-0 motion-reduce:transition-none"
										/>
										More options ({advanced.length})
									</summary>
									<div class="grid gap-4 pt-2 pb-4">
										{@render fieldRuns(advanced)}
									</div>
								</details>
							{/if}
						</section>
					{/if}
				{/each}
			{/each}
		</form>

		<section
			id="generator-output"
			aria-label="Output"
			class={`min-w-0 lg:sticky lg:top-below-header ${view === 'configure' ? 'max-lg:hidden' : ''}`}
		>
			<OutputPanel
				target={currentTarget}
				{files}
				{issues}
				onExport={trackExport}
				onFixField={focusField}
			/>
		</section>
	</div>
</div>
