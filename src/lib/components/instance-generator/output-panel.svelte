<script lang="ts">
	import {
		AlertTriangleIcon,
		BookOpenIcon,
		DownloadIcon,
		FileTextIcon,
		TerminalIcon
	} from '#lib/icons/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Code from '#lib/components/ui/code/index.js';
	import { CopyButton } from '#lib/components/ui/copy-button/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import type {
		DeploymentTarget,
		GeneratedFile,
		GeneratorField
	} from '#lib/types/instance-generator.type.js';

	interface Props {
		target: DeploymentTarget;
		files: GeneratedFile[];
		missing: GeneratorField[];
		onExport: (method: 'copy' | 'download') => void;
	}

	let { target, files, missing, onExport }: Props = $props();

	const STEPS_TAB = 'steps';

	let selectedTab = $state('');
	let documents = $derived(files.filter((file) => file.filename));
	let tabIds = $derived([...documents.map((file) => file.id), STEPS_TAB]);
	let activeTab = $derived(tabIds.includes(selectedTab) ? selectedTab : tabIds[0]);

	function downloadFile(file: GeneratedFile) {
		if (!file.filename) return;
		const url = URL.createObjectURL(new Blob([file.code], { type: 'text/plain' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = file.filename;
		link.click();
		URL.revokeObjectURL(url);
		onExport('download');
	}

	function handleCopy(status: 'success' | 'failure' | undefined) {
		if (status === 'success') onExport('copy');
	}

	function focusField(key: string) {
		document.getElementById(key)?.focus();
	}
</script>

<div
	class="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--surface-shadow-lg)] lg:max-h-below-header"
>
	<div class="flex items-start justify-between gap-4 border-b border-border px-4 pt-3.5 pb-3">
		<div class="grid min-w-0 gap-0.5">
			<p class="text-sm font-semibold">{target.label}</p>
			<p class="text-xs leading-snug text-muted-foreground">{target.resultDescription}</p>
		</div>
		<a
			href={target.docsHref}
			class="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
		>
			<BookOpenIcon class="size-3.5" />
			<span class="hidden sm:inline">{target.docsLabel}</span>
			<span class="sm:hidden">Docs</span>
		</a>
	</div>

	{#if missing.length > 0}
		<div
			class="flex items-start gap-2 border-b border-border bg-warning/10 px-4 py-2 text-xs leading-relaxed"
		>
			<AlertTriangleIcon class="mt-0.5 size-3.5 shrink-0 text-warning" />
			<p>
				<span class="text-muted-foreground">Placeholders in use for</span>
				{#each missing as field, index (field.key)}
					<button
						type="button"
						class="font-medium underline decoration-dotted underline-offset-2 hover:text-primary"
						onclick={() => focusField(field.key)}>{field.label}</button
					>{index < missing.length - 1 ? ', ' : ''}
				{/each}
			</p>
		</div>
	{/if}

	<Tabs.Root
		value={activeTab}
		onValueChange={(next) => (selectedTab = next)}
		class="flex min-h-0 flex-1 flex-col"
	>
		<div
			class="flex items-center justify-between gap-2 border-b border-border bg-muted/40 pr-2 pl-1"
		>
			<Tabs.List
				class="flex h-auto w-auto min-w-0 flex-wrap items-stretch justify-start gap-0 rounded-none bg-transparent p-0"
			>
				{#each documents as file (file.id)}
					<Tabs.Trigger
						value={file.id}
						class="relative inline-flex h-auto flex-none items-center gap-1.5 rounded-none border-0 px-3 py-2.5 font-mono text-xs font-medium whitespace-nowrap text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-primary dark:data-[state=active]:bg-transparent"
					>
						<FileTextIcon class="size-3.5" />
						{file.filename}
					</Tabs.Trigger>
				{/each}
				<Tabs.Trigger
					value={STEPS_TAB}
					class="relative inline-flex h-auto flex-none items-center gap-1.5 rounded-none border-0 px-3 py-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-primary dark:data-[state=active]:bg-transparent"
				>
					<TerminalIcon class="size-3.5" />
					Setup steps
				</Tabs.Trigger>
			</Tabs.List>
			{#each documents as file (file.id)}
				{#if activeTab === file.id}
					<div class="flex shrink-0 items-center gap-1">
						<CopyButton
							text={file.code}
							variant="ghost"
							size="xs"
							tabindex={0}
							class="h-7 rounded-md px-2 text-xs"
							onCopy={handleCopy}
						>
							<span class="hidden sm:inline">Copy</span>
						</CopyButton>
						<Button
							variant="ghost"
							size="xs"
							class="h-7 rounded-md px-2 text-xs"
							onclick={() => downloadFile(file)}
						>
							<DownloadIcon class="size-3.5" />
							<span class="hidden sm:inline">Download</span>
						</Button>
					</div>
				{/if}
			{/each}
		</div>

		{#each documents as file (file.id)}
			<Tabs.Content value={file.id} class="min-h-0 flex-1 overflow-hidden">
				<Code.Root
					lang={file.lang}
					code={file.code}
					variant="embedded"
					class="max-h-[70vh] text-[0.8125rem] lg:max-h-none [&_pre_.line]:py-0!"
				/>
			</Tabs.Content>
		{/each}

		<Tabs.Content value={STEPS_TAB} class="min-h-0 flex-1 overflow-y-auto">
			<ol class="grid gap-5 p-4">
				{#each files as file, index (file.id)}
					<li class="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 gap-y-2">
						<span
							class="grid size-6 place-items-center rounded-full border border-border bg-muted text-2xs font-semibold text-muted-foreground"
							>{index + 1}</span
						>
						<div class="grid gap-0.5 pt-0.5">
							<p class="text-sm leading-snug font-medium">
								{file.filename ? `Save ${file.filename}` : file.title}
							</p>
							{#if file.description}
								<p class="text-xs leading-snug text-muted-foreground">{file.description}</p>
							{/if}
						</div>
						<div class="col-start-2">
							{#if file.filename}
								<div class="flex flex-wrap gap-2">
									<Button
										variant="outline"
										size="xs"
										class="rounded-md"
										onclick={() => (selectedTab = file.id)}
									>
										<FileTextIcon class="size-3.5" />
										View {file.filename}
									</Button>
									<Button
										variant="outline"
										size="xs"
										class="rounded-md"
										onclick={() => downloadFile(file)}
									>
										<DownloadIcon class="size-3.5" />
										Download
									</Button>
								</div>
							{:else}
								<Code.Root lang={file.lang} code={file.code} hideLines class="text-[0.8125rem]">
									<Code.CopyButton
										size="icon"
										variant="ghost"
										tabindex={0}
										class="top-1 right-1 size-8"
										onCopy={handleCopy}
									/>
								</Code.Root>
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		</Tabs.Content>
	</Tabs.Root>
</div>
