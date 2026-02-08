<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import FileText from '@lucide/svelte/icons/file-text';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { generatorConfig, getDefaultConfigValues } from '$lib/config/compose-generator.js';
	import type { GeneratorField } from '$lib/types/compose-generator.type.js';
	import { generateDockerCompose } from '$lib/utils/docker-compose-generator.js';
	import DockerComposeDialog from './docker-compose-dialog.svelte';

	let config = $state<Record<string, string | boolean>>(getDefaultConfigValues());

	let generatedCompose = $state('');
	let dialogOpen = $state(false);

	// Tab animation state
	let activeTab = $state(generatorConfig[0].id);
	let slideDirection = $state<'left' | 'right'>('right');

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
	let nextActionLabel = $derived(isLastStep ? 'Generate Docker Compose' : nextTab?.label ?? 'Next');
	let stepSummary = $derived(
		currentSections
			.map((section) => section.description)
			.filter(Boolean)
			.join(' • ')
	);

	function handleTabChange(newTab: string) {
		const currentIndex = generatorConfig.findIndex((t) => t.id === activeTab);
		const newIndex = generatorConfig.findIndex((t) => t.id === newTab);
		slideDirection = newIndex > currentIndex ? 'right' : 'left';
		activeTab = newTab;
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
		dialogOpen = true;
	}

	function generateRandomKey() {
		return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join(
			''
		);
	}

	function shouldShowField(field: GeneratorField): boolean {
		if (!field.dependsOn) return true;
		return config[field.dependsOn] === true;
	}

	function handleCheckboxChange(key: string, checked: boolean) {
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

	function formatFieldValue(field: GeneratorField): string {
		const value = config[field.key];
		if (field.type === 'checkbox') return value === true ? 'Enabled' : 'Off';
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

<div class="generator-wrapper mx-auto w-full max-w-[1500px] px-0">
	<Tabs.Root value={activeTab} onValueChange={handleTabChange}>
		<div class="wizard-layout">
			<div class="wizard-shell">
				<header class="wizard-header">
					<Tabs.List
						class="wizard-steps no-scrollbar !h-auto !w-full !justify-start !rounded-none !bg-transparent !p-0"
						aria-label="Setup steps"
					>
						{#each generatorConfig as tab, index (tab.id)}
							<Tabs.Trigger
								value={tab.id}
								class="wizard-step !h-auto !flex-none !justify-start !rounded-none !border-0 !bg-transparent !shadow-none"
							>
								<span class="wizard-step__index">{index + 1}</span>
								<span class="wizard-step__title">{tab.label}</span>
							</Tabs.Trigger>
						{/each}
					</Tabs.List>

				<div class="wizard-progress">
					<div class="wizard-progress__track">
						<div class="wizard-progress__fill" style={`width: ${stepProgress}%`}></div>
					</div>
				</div>

				{#if currentTab}
					<div class="wizard-intro">
						<h2 class="wizard-title">{currentTab.label} setup</h2>
						<p class="wizard-subtitle">{stepSummary}</p>
					</div>
				{/if}
				</header>

				<div class="wizard-body">
					<div class="wizard-form">
						<div class="relative overflow-hidden">
							{#key activeTab}
								<div
									class="tab-content space-y-4"
									class:slide-in-right={slideDirection === 'right'}
									class:slide-in-left={slideDirection === 'left'}
								>
									{#each currentSections as section (section.id)}
										<Card.Root class="wizard-panel border-border/40">
											<Card.Header class="wizard-panel__header">
												<Card.Title class="text-lg font-semibold">{section.title}</Card.Title>
												<Card.Description class="text-muted-foreground">{section.description}</Card.Description>
											</Card.Header>
											<Card.Content class="wizard-panel__fields">
												{#each section.fields as field (field.key)}
													{#if shouldShowField(field)}
														{#if field.type === 'checkbox'}
															<div class="wizard-field wizard-field--toggle">
																<div class="wizard-field__meta">
																	<Label for={field.key} class="wizard-field__label">{field.label}</Label>
																	{#if field.description}
																		<p class="wizard-field__hint">{field.description}</p>
																	{/if}
																</div>
																<Checkbox
																	id={field.key}
																	checked={config[field.key] === true}
																	onCheckedChange={(checked) => handleCheckboxChange(field.key, checked === true)}
																/>
															</div>
														{:else if field.type === 'select'}
															<div class="wizard-field">
																<div class="wizard-field__meta">
																	<Label for={field.key} class="wizard-field__label">{field.label}</Label>
																	{#if field.description}
																		<p class="wizard-field__hint">{field.description}</p>
																	{/if}
																</div>
																<div class="wizard-field__control">
																	<Select.Root
																		type="single"
																		value={config[field.key] as string}
																		onValueChange={(value) => handleSelectChange(field.key, value)}
																	>
																		<Select.Trigger
																			class="border-border/50 w-full focus:border-purple-500/50 focus:ring-purple-500/20"
																		>
																			{config[field.key] || field.placeholder || 'Select...'}
																		</Select.Trigger>
																		<Select.Content>
																			{#each field.options || [] as option (option.value)}
																				<Select.Item value={option.value}>{option.label}</Select.Item>
																			{/each}
																		</Select.Content>
																	</Select.Root>
																</div>
															</div>
														{:else if field.canGenerate}
															<div class="wizard-field">
																<div class="wizard-field__meta">
																	<Label for={field.key} class="wizard-field__label">{field.label}</Label>
																	{#if field.description}
																		<p class="wizard-field__hint">{field.description}</p>
																	{/if}
																</div>
																<div class="wizard-field__control">
																	<div class="wizard-field__actions">
																		<Input
																			id={field.key}
																			type={field.type === 'password' ? 'password' : 'text'}
																			bind:value={config[field.key]}
																			placeholder={field.placeholder}
																			class="border-border/50 flex-1 focus:border-purple-500/50 focus:ring-purple-500/20"
																		/>
																		<Button
																			type="button"
																			variant="outline"
																			onclick={() => (config[field.key] = generateRandomKey())}
																			class="border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5"
																		>
																			Generate
																		</Button>
																	</div>
																</div>
															</div>
														{:else}
															<div class="wizard-field">
																<div class="wizard-field__meta">
																	<Label for={field.key} class="wizard-field__label">{field.label}</Label>
																	{#if field.description}
																		<p class="wizard-field__hint">{field.description}</p>
																	{/if}
																</div>
																<div class="wizard-field__control">
																	<Input
																		id={field.key}
																		type={field.type === 'password' ? 'password' : 'text'}
																		bind:value={config[field.key]}
																		placeholder={field.placeholder}
																		class="border-border/50 focus:border-purple-500/50 focus:ring-purple-500/20"
																	/>
																</div>
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
				</div>

			</div>

			<aside class="wizard-summary">
				<div class="wizard-summary__card">
					<div class="wizard-summary__header">
						<p class="wizard-summary__title">Current step summary</p>
						<p class="wizard-summary__subtitle">Review key choices before continuing.</p>
					</div>
					<div class="wizard-summary__content">
						{#if summaryPreview.length}
							<ul class="wizard-summary__list">
								{#each summaryPreview as item (item.label)}
									<li>
										<span>{item.label}</span>
										<strong>{item.value}</strong>
									</li>
								{/each}
							</ul>
							{#if summaryOverflow > 0}
								<p class="wizard-summary__more">+{summaryOverflow} more selections</p>
							{/if}
						{:else}
							<p class="wizard-summary__empty">
								Make a selection in this step to see it summarized here.
							</p>
						{/if}
					</div>
					<div class="wizard-summary__footer">
						<span>Completion</span>
						<strong>{completedStepFields.length}/{visibleStepFields.length}</strong>
					</div>
				</div>

				<div class="wizard-summary__actions">
					<Button
						variant="outline"
						size="sm"
						onclick={goToPrevTab}
						disabled={!canGoPrev}
						class="border-border/50 flex items-center gap-2 hover:border-purple-500/30 disabled:opacity-40"
					>
						<ChevronLeft class="h-4 w-4" />
						Back
					</Button>

					<Button
						variant={isLastStep ? 'default' : 'outline'}
						size="sm"
						onclick={isLastStep ? handleGenerateDockerCompose : goToNextTab}
						disabled={!canGoNext && !isLastStep}
						class="wizard-next border-border/50 flex items-center gap-2 hover:border-purple-500/30 disabled:opacity-40"
					>
						{#if isLastStep}
							<FileText class="h-4 w-4" />
							{nextActionLabel}
						{:else}
							{nextActionLabel}
							<ChevronRight class="h-4 w-4" />
						{/if}
					</Button>
				</div>
			</aside>
		</div>
	</Tabs.Root>
</div>

<DockerComposeDialog bind:open={dialogOpen} {generatedCompose} />

<style>
	.generator-wrapper {
		animation: fadeInUp 0.5s ease-out both;
		padding-left: 0.5rem;
	}

	.wizard-layout {
		display: grid;
		gap: 2rem;
	}

	.wizard-shell {
		display: grid;
		gap: 2rem;
	}

	.wizard-header {
		display: grid;
		gap: 1.5rem;
	}

	.wizard-shell :global(.wizard-steps) {
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-end;
		gap: 1.5rem;
		padding: 0 0 0.45rem;
		border-bottom: 1px solid color-mix(in oklab, var(--border) 60%, transparent);
		overflow-x: auto;
	}

	.wizard-shell :global(.wizard-step) {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0 0.4rem;
		border-radius: 0;
		border: 0;
		background: transparent;
		color: var(--muted-foreground);
		font-size: 0.85rem;
		font-weight: 600;
		text-align: left;
		transition: color 0.2s ease, border-color 0.2s ease;
		white-space: nowrap;
		border-bottom: 2px solid transparent;
		height: auto;
		box-shadow: none;
	}

	.wizard-step__index {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.35rem;
		height: 1.35rem;
		border-radius: 999px;
		font-size: 0.65rem;
		font-weight: 700;
		background: transparent;
		border: 1px solid color-mix(in oklab, var(--border) 65%, transparent);
		color: var(--muted-foreground);
	}

	.wizard-step__title {
		font-size: 0.85rem;
		letter-spacing: 0.01em;
	}

	:global(.wizard-step[data-state='active']) {
		color: var(--foreground);
		border-bottom-color: color-mix(in oklab, var(--primary) 70%, transparent);
		background: transparent;
		box-shadow: none;
	}

	:global(.wizard-step[data-state='active']) .wizard-step__index {
		background: color-mix(in oklab, var(--primary) 60%, transparent);
		color: var(--primary-foreground);
		border-color: transparent;
	}

	.wizard-progress {
		display: grid;
		gap: 0.6rem;
	}

	.wizard-progress__track {
		height: 3px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--muted) 65%, transparent);
		overflow: hidden;
	}

	.wizard-progress__fill {
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, oklch(0.606 0.25 292.717), oklch(0.7 0.23 300));
		transition: width 0.3s ease;
	}

	.wizard-intro {
		display: grid;
		gap: 0.4rem;
	}

	.wizard-title {
		font-size: clamp(1.6rem, 2.5vw, 2.2rem);
		font-weight: 700;
	}

	.wizard-subtitle {
		color: var(--muted-foreground);
		font-size: 0.95rem;
	}

	.wizard-body {
		display: grid;
		gap: 1.5rem;
	}

	.wizard-shell :global(.wizard-panel) {
		border-radius: 1.4rem;
		background: color-mix(in oklab, var(--card) 70%, transparent);
		box-shadow: 0 12px 32px -32px oklch(0 0 0 / 0.35);
	}

	.wizard-shell :global(.wizard-panel__header) {
		padding-bottom: 0.5rem;
	}

	.wizard-shell :global(.wizard-panel__fields) {
		display: grid;
		gap: 1rem;
	}

	.wizard-field {
		display: grid;
		gap: 0.6rem;
		padding: 0.75rem;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in oklab, var(--border) 55%, transparent);
		background: color-mix(in oklab, var(--background) 88%, transparent);
	}

	.wizard-field--toggle {
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
	}

	.wizard-shell :global(.wizard-field__label) {
		font-weight: 600;
	}

	.wizard-field__hint {
		font-size: 0.8rem;
		color: var(--muted-foreground);
	}

	.wizard-field__control {
		width: 100%;
	}

	.wizard-field__actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.wizard-summary {
		align-self: start;
		position: sticky;
		top: calc(var(--header-height) + var(--spacing) * 6);
	}

	.wizard-summary__card {
		border-radius: 1.25rem;
		border: 1px solid color-mix(in oklab, var(--border) 60%, transparent);
		background: color-mix(in oklab, var(--background) 85%, transparent);
		padding: 1.25rem 1.5rem 1.35rem;
		max-height: calc(100vh - var(--header-height) - var(--spacing) * 6);
		overflow: auto;
		box-shadow:
			0 24px 50px -45px oklch(0 0 0 / 0.6),
			0 0 0 1px color-mix(in oklab, var(--border) 25%, transparent);
		animation: summaryFloat 7s ease-in-out infinite;
		transition: transform 0.35s ease, box-shadow 0.35s ease;
		will-change: transform;
	}

	.wizard-summary__card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 28px 60px -45px oklch(0 0 0 / 0.65),
			0 0 0 1px color-mix(in oklab, var(--primary) 30%, transparent);
	}

	.wizard-summary__header {
		display: grid;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.wizard-summary__title {
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.wizard-summary__subtitle {
		color: var(--muted-foreground);
		font-size: 0.85rem;
	}

	.wizard-summary__content {
		display: grid;
		gap: 0.85rem;
	}

	.wizard-summary__list {
		display: grid;
		gap: 0.7rem;
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.wizard-summary__list li {
		display: flex;
		justify-content: space-between;
		gap: 1.2rem;
		align-items: baseline;
	}

	.wizard-summary__list strong {
		color: var(--foreground);
		font-weight: 600;
	}

	.wizard-summary__more {
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	.wizard-summary__empty {
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.wizard-summary__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid color-mix(in oklab, var(--border) 60%, transparent);
		padding-top: 0.9rem;
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.wizard-summary__footer strong {
		color: var(--foreground);
	}

	.wizard-summary__actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 1rem;
	}

	.wizard-shell :global(.wizard-next) {
		min-width: 220px;
	}

	.tab-content {
		animation-duration: 0.4s;
		animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		animation-fill-mode: both;
	}

	.slide-in-right {
		animation-name: slideInRight;
	}

	.slide-in-left {
		animation-name: slideInLeft;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes summaryFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}

	@media (min-width: 768px) {
		.wizard-field {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: center;
		}

		.wizard-field--toggle {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		.wizard-field__actions {
			flex-direction: row;
			align-items: center;
		}
	}

	@media (min-width: 1024px) {
		.wizard-layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 260px);
		}
	}

	@media (max-width: 640px) {
		.wizard-shell :global(.wizard-next) {
			min-width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.generator-wrapper,
		.tab-content {
			animation: none;
		}

		.wizard-summary__card {
			animation: none;
		}

		.wizard-progress__fill {
			transition: none;
		}
	}
</style>
