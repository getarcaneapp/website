<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon } from '#lib/icons/index.js';
	import { trackEvent } from '#lib/analytics.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import { generatorConfig, getDefaultConfigValues } from '#lib/config/compose-generator.js';
	import type { GeneratorField } from '#lib/types/compose-generator.type.js';
	import { generateDockerCompose } from '#lib/utils/docker-compose-generator.js';
	import DockerComposeDialog from './docker-compose-dialog.svelte';

	let config = $state<Record<string, string | boolean>>(getDefaultConfigValues());

	let generatedCompose = $state('');
	let dialogOpen = $state(false);

	// Tab animation state
	let activeTab = $state(generatorConfig[0].id);
	let slideDirection = $state<'left' | 'right'>('right');
	let highestVisitedTabIndex = $state(0);

	// Derived values for navigation
	let currentTabIndex = $derived(generatorConfig.findIndex((t) => t.id === activeTab));
	let canGoPrev = $derived(currentTabIndex > 0);
	let canGoNext = $derived(currentTabIndex < generatorConfig.length - 1);
	let prevTab = $derived(canGoPrev ? generatorConfig[currentTabIndex - 1] : null);
	let nextTab = $derived(canGoNext ? generatorConfig[currentTabIndex + 1] : null);
	let stepCount = generatorConfig.length;
	let currentTab = $derived(generatorConfig[currentTabIndex]);
	let currentSections = $derived(currentTab?.sections ?? []);
	let stepProgress = $derived(Math.round(((currentTabIndex + 1) / stepCount) * 100));
	let isLastStep = $derived(!canGoNext);
	let nextActionLabel = $derived(
		isLastStep ? 'Generate Docker Compose' : (nextTab?.label ?? 'Next')
	);
	let stepSummary = $derived(
		currentSections
			.map((section) => section.description)
			.filter(Boolean)
			.join(' • ')
	);
	let stepProgressText = $derived(`Step ${currentTabIndex + 1} of ${stepCount}`);

	function canAccessTab(index: number): boolean {
		return index <= highestVisitedTabIndex + 1;
	}

	function handleTabChange(newTab: string) {
		const currentIndex = generatorConfig.findIndex((t) => t.id === activeTab);
		const newIndex = generatorConfig.findIndex((t) => t.id === newTab);
		if (newIndex > highestVisitedTabIndex + 1) return;
		slideDirection = newIndex > currentIndex ? 'right' : 'left';
		activeTab = newTab;
		if (newIndex > highestVisitedTabIndex) {
			highestVisitedTabIndex = newIndex;
		}
	}

	function goToPrevTab() {
		if (prevTab) {
			handleTabChange(prevTab.id);
		}
	}

	function goToNextTab() {
		if (nextTab) {
			handleTabChange(nextTab.id);
		}
	}

	function handleGenerateDockerCompose() {
		generatedCompose = generateDockerCompose(config);
		trackEvent('Compose Generated', {
			access_method: config.useSocketProxy === true ? 'socket_proxy' : 'direct_socket',
			socket_proxy_provider: getSocketProxyProviderAnalyticsValue(
				config.useSocketProxy,
				config.socketProxyProvider
			),
			database: config.enableDatabase === true ? 'postgresql' : 'sqlite',
			authentication: config.enableOIDC === true ? 'oidc' : 'local',
			project_storage:
				typeof config.projectsHostPath === 'string' && config.projectsHostPath.trim()
					? 'host_mount'
					: 'named_volume',
			selinux: config.enableSelinux === true ? 'enabled' : 'disabled',
			registry: getRegistryAnalyticsValue(config.registry)
		});
		dialogOpen = true;
	}

	function generateRandomKey() {
		return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
			byte.toString(16).padStart(2, '0')
		).join('');
	}

	function shouldShowField(field: GeneratorField): boolean {
		if (field.key === 'dockerSocket' && config.useSocketProxy === true) {
			return false;
		}
		if (!field.dependsOn) return true;
		return config[field.dependsOn] === true;
	}

	function handleSwitchChange(key: string, checked: boolean) {
		config[key] = checked;
	}

	function handleSelectChange(key: string, value: string | undefined) {
		if (value) {
			config[key] = value;
		}
	}

	function isFieldSet(field: GeneratorField): boolean {
		const value = config[field.key];
		if (field.type === 'checkbox') return value === true;
		if (typeof value === 'string') return value.trim() !== '';
		return false;
	}

	function getSelectLabel(field: GeneratorField, value: string | boolean): string {
		if (typeof value !== 'string') return String(value);
		return field.options?.find((option) => option.value === value)?.label ?? value;
	}

	function getSocketProxyProviderAnalyticsValue(
		enabled: string | boolean,
		provider: string | boolean
	): 'none' | 'wollomatic' | 'tecnativa' {
		if (enabled !== true) return 'none';
		return provider === 'tecnativa' ? 'tecnativa' : 'wollomatic';
	}

	function getRegistryAnalyticsValue(value: string | boolean): 'ghcr' | 'quay' | 'docker' {
		if (value === 'quay' || value === 'docker') return value;
		return 'ghcr';
	}

	function formatFieldValue(field: GeneratorField): string {
		const value = config[field.key];
		if (field.type === 'checkbox') return value === true ? 'Enabled' : 'Off';
		if (field.type === 'select') return getSelectLabel(field, value);
		if (!value) return field.canGenerate ? 'Auto' : '—';
		if (field.type === 'password') return '••••••••';
		return String(value);
	}

	let stepFields = $derived(currentSections.flatMap((section) => section.fields));
	let visibleStepFields = $derived(stepFields.filter(shouldShowField));
	let completedStepFields = $derived(visibleStepFields.filter(isFieldSet));
	let summaryItems = $derived(
		visibleStepFields
			.filter((field) => isFieldSet(field))
			.map((field) => ({
				label: field.label,
				value: formatFieldValue(field),
				description: field.description
			}))
	);
	let summaryPreview = $derived(summaryItems.slice(0, 6));
	let summaryOverflow = $derived(Math.max(summaryItems.length - 6, 0));
</script>

{#snippet fieldMeta(field: GeneratorField)}
	<div>
		<Label for={field.key}>{field.label}</Label>
		{#if field.description}
			<p class="mt-1.5 text-sm text-muted-foreground">{field.description}</p>
		{/if}
	</div>
{/snippet}

<div class="mx-auto w-full max-w-375 animate-fade-in-up pl-2 motion-reduce:animate-none">
	<Tabs.Root value={activeTab} onValueChange={handleTabChange}>
		<div class="grid gap-8 lg:grid-cols-wizard">
			<div class="grid gap-8">
				<header class="grid gap-6">
					<Tabs.List variant="steps" aria-label="Setup steps">
						{#each generatorConfig as tab, index (tab.id)}
							<Tabs.Trigger variant="steps" value={tab.id} disabled={!canAccessTab(index)}>
								<span
									class="inline-grid size-6 place-items-center rounded-full border border-border/65 text-3xs leading-none font-bold text-muted-foreground group-data-[state=active]:border-transparent group-data-[state=active]:bg-primary/60 group-data-[state=active]:text-primary-foreground"
									>{index + 1}</span
								>
								<span>{tab.label}</span>
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
					<p class="text-xs tracking-wider text-muted-foreground">{stepProgressText}</p>

					<div class="h-0.75 overflow-hidden rounded-full bg-muted/65">
						<div
							class="h-full w-(--step-progress) rounded-full bg-linear-to-r from-primary to-primary-tint transition-all duration-300 motion-reduce:transition-none"
							style={`--step-progress: ${stepProgress}%`}
						></div>
					</div>

					{#if currentTab}
						<div class="grid gap-1.5">
							<h2 class="text-2xl font-bold md:text-3xl lg:text-4xl">{currentTab.label} setup</h2>
							<p class="text-base text-muted-foreground">{stepSummary}</p>
						</div>
					{/if}
				</header>

				<div class="relative overflow-hidden">
					{#key activeTab}
						<div
							class={[
								'space-y-4 motion-reduce:animate-none',
								slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
							]}
						>
							{#each currentSections as section (section.id)}
								<Card.Root variant="panel">
									<Card.Header>
										<Card.Title>{section.title}</Card.Title>
										<Card.Description>{section.description}</Card.Description>
									</Card.Header>
									<Card.Content>
										{#each section.fields as field (field.key)}
											{#if shouldShowField(field)}
												{#if field.type === 'checkbox'}
													<div
														class="grid grid-cols-content-action items-center gap-2.5 rounded-2xl border border-border/55 bg-background/88 p-3"
													>
														{@render fieldMeta(field)}
														<Switch
															id={field.key}
															checked={config[field.key] === true}
															onCheckedChange={(checked) =>
																handleSwitchChange(field.key, checked === true)}
														/>
													</div>
												{:else}
													<div
														class="grid gap-2.5 rounded-2xl border border-border/55 bg-background/88 p-3 md:grid-cols-2 md:items-center"
													>
														{@render fieldMeta(field)}
														{#if field.type === 'select'}
															<Select.Root
																type="single"
																value={config[field.key] as string}
																onValueChange={(value: string) =>
																	handleSelectChange(field.key, value)}
															>
																<Select.Trigger class="w-full">
																	{getSelectLabel(field, config[field.key]) ||
																		field.placeholder ||
																		'Select...'}
																</Select.Trigger>
																<Select.Content>
																	{#each field.options || [] as option (option.value)}
																		<Select.Item value={option.value}>{option.label}</Select.Item>
																	{/each}
																</Select.Content>
															</Select.Root>
														{:else}
															<div class="flex w-full flex-col gap-2 md:flex-row md:items-center">
																<Input
																	id={field.key}
																	type={field.type === 'password' ? 'password' : 'text'}
																	bind:value={config[field.key]}
																	placeholder={field.placeholder}
																	class="flex-1"
																/>
																{#if field.canGenerate}
																	<Button
																		type="button"
																		variant="outline"
																		onclick={() => (config[field.key] = generateRandomKey())}
																	>
																		Generate
																	</Button>
																{/if}
															</div>
														{/if}
													</div>
												{/if}
											{/if}
										{/each}
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					{/key}
				</div>
			</div>

			<aside class="sticky top-below-header self-start">
				<div
					class="max-h-below-header overflow-auto rounded-2xl border border-border/60 bg-background/85 px-6 pt-5 pb-5.5 shadow-wizard transition duration-300 will-change-transform hover:-translate-y-1 hover:shadow-wizard-hover motion-reduce:animate-none"
				>
					<div class="mb-4 grid gap-1.5">
						<p class="text-sm font-bold tracking-wider uppercase">Current step summary</p>
						<p class="text-sm text-muted-foreground">Review key choices before continuing.</p>
					</div>
					<div class="grid gap-3.5">
						{#if summaryPreview.length}
							<ul class="grid gap-3 text-sm text-muted-foreground">
								{#each summaryPreview as item (item.label)}
									<li class="flex items-baseline justify-between gap-5">
										<span>{item.label}</span>
										<strong class="font-semibold text-foreground">{item.value}</strong>
									</li>
								{/each}
							</ul>
							{#if summaryOverflow > 0}
								<p class="text-xs text-muted-foreground">+{summaryOverflow} more selections</p>
							{/if}
						{:else}
							<p class="text-sm text-muted-foreground">
								Make a selection in this step to see it summarized here.
							</p>
						{/if}
					</div>
					<div
						class="mt-3.5 flex items-center justify-between border-t border-border/60 pt-3.5 text-sm text-muted-foreground"
					>
						<span>Completion</span>
						<strong class="text-foreground"
							>{completedStepFields.length}/{visibleStepFields.length}</strong
						>
					</div>
				</div>

				<div class="mt-4 flex flex-wrap items-center justify-center gap-3">
					<Button variant="outline" size="sm" onclick={goToPrevTab} disabled={!canGoPrev}>
						<ArrowLeftIcon class="h-4 w-4" />
						Back
					</Button>

					<Button
						variant={isLastStep ? 'default' : 'outline'}
						size="sm"
						onclick={isLastStep ? handleGenerateDockerCompose : goToNextTab}
						disabled={!canGoNext && !isLastStep}
						class="min-w-full sm:min-w-55"
					>
						{#if isLastStep}
							<FileTextIcon class="h-4 w-4" />
							{nextActionLabel}
						{:else}
							{nextActionLabel}
							<ArrowRightIcon class="h-4 w-4" />
						{/if}
					</Button>
				</div>
			</aside>
		</div>
	</Tabs.Root>
</div>

<DockerComposeDialog bind:open={dialogOpen} {generatedCompose} />
