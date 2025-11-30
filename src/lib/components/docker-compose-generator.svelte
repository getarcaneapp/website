<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Database from '@lucide/svelte/icons/database';
	import FileText from '@lucide/svelte/icons/file-text';
	import Key from '@lucide/svelte/icons/key';
	import Settings from '@lucide/svelte/icons/settings';
	import Shield from '@lucide/svelte/icons/shield';
	import Cog from '@lucide/svelte/icons/cog';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { generatorConfig, getDefaultConfigValues } from '$lib/config/compose-generator.js';
	import type { GeneratorField, GeneratorSection } from '$lib/types/compose-generator.type.js';
	import { generateDockerCompose } from '$lib/utils/docker-compose-generator.js';
	import DockerComposeDialog from './docker-compose-dialog.svelte';

	// Icon mapping
	const icons: Record<string, typeof Settings> = {
		settings: Settings,
		database: Database,
		key: Key,
		shield: Shield,
		cog: Cog
	};

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

	function getIcon(iconName: string) {
		return icons[iconName] || Settings;
	}

	function handleCheckboxChange(key: string, checked: boolean) {
		config[key] = checked;
	}

	function handleSelectChange(key: string, value: string | undefined) {
		if (value) {
			config[key] = value;
		}
	}
</script>

<div class="generator-wrapper mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6">
	<div class="space-y-6">
		<Tabs.Root value={activeTab} onValueChange={handleTabChange}>
			<Tabs.List class="grid w-full grid-cols-3">
				{#each generatorConfig as tab}
					{@const IconComponent = getIcon(tab.icon)}
					<Tabs.Trigger value={tab.id}>
						<IconComponent class="mr-2 size-4" />
						<span class="hidden sm:inline">{tab.label}</span>
						<span class="sm:hidden">{tab.shortLabel || tab.label}</span>
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			<div class="relative overflow-hidden">
				{#each generatorConfig as tab (tab.id)}
					{#if activeTab === tab.id}
						<div
							class="tab-content space-y-4"
							class:slide-in-right={slideDirection === 'right'}
							class:slide-in-left={slideDirection === 'left'}
						>
							{#each tab.sections as section}
								<Card.Root class="mt-6">
									<Card.Header>
										<Card.Title>{section.title}</Card.Title>
										<Card.Description>{section.description}</Card.Description>
									</Card.Header>
									<Card.Content class="space-y-4">
										{#each section.fields as field}
											{#if shouldShowField(field)}
												{#if field.type === 'checkbox'}
													<div class="flex items-center space-x-2">
														<Checkbox
															id={field.key}
															checked={config[field.key] === true}
															onCheckedChange={(checked) => handleCheckboxChange(field.key, checked === true)}
														/>
														<Label for={field.key} class="text-sm sm:text-base">{field.label}</Label>
													</div>
												{:else if field.type === 'select'}
													<div class="space-y-2">
														<Label for={field.key}>{field.label}</Label>
														<Select.Root
															type="single"
															value={config[field.key] as string}
															onValueChange={(value) => handleSelectChange(field.key, value)}
														>
															<Select.Trigger class="w-full">
																{config[field.key] || field.placeholder || 'Select...'}
															</Select.Trigger>
															<Select.Content>
																{#each field.options || [] as option}
																	<Select.Item value={option.value}>{option.label}</Select.Item>
																{/each}
															</Select.Content>
														</Select.Root>
													</div>
												{:else if field.canGenerate}
													<div class="space-y-2">
														<Label for={field.key}>{field.label}</Label>
														<div class="flex flex-col gap-2 sm:flex-row">
															<Input
																id={field.key}
																type={field.type === 'password' ? 'password' : 'text'}
																bind:value={config[field.key]}
																placeholder={field.placeholder}
																class="flex-1"
															/>
															<Button
																type="button"
																variant="outline"
																onclick={() => (config[field.key] = generateRandomKey())}
																class="w-full sm:w-auto"
															>
																Generate
															</Button>
														</div>
													</div>
												{:else}
													<div class="space-y-2">
														<Label for={field.key}>{field.label}</Label>
														<Input
															id={field.key}
															type={field.type === 'password' ? 'password' : 'text'}
															bind:value={config[field.key]}
															placeholder={field.placeholder}
														/>
													</div>
												{/if}
											{/if}
										{/each}
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		</Tabs.Root>

		<!-- Navigation arrows -->
		<div class="flex items-center justify-between gap-4">
			<Button variant="outline" size="sm" onclick={goToPrevTab} disabled={!canGoPrev} class="flex items-center gap-2">
				<ChevronLeft class="h-4 w-4" />
				<span class="hidden sm:inline">{prevTab?.label || 'Previous'}</span>
			</Button>

			<Button
				onclick={handleGenerateDockerCompose}
				data-umami-event="compose-generated"
				size="lg"
				class="flex-1 sm:min-w-48 sm:flex-none"
			>
				<FileText class="mr-2 h-4 w-4" />
				Generate Docker Compose
			</Button>

			<Button variant="outline" size="sm" onclick={goToNextTab} disabled={!canGoNext} class="flex items-center gap-2">
				<span class="hidden sm:inline">{nextTab?.label || 'Next'}</span>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>

<DockerComposeDialog bind:open={dialogOpen} {generatedCompose} />

<style>
	.generator-wrapper {
		animation: fadeInUp 0.5s ease-out both;
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
</style>
