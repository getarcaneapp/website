<script lang="ts" module>
export interface FieldIssue {
	key: string;
	label: string;
	message: string;
}
</script>

<script lang="ts">
import { Button } from '#lib/components/ui/button/index.js';
import * as Code from '#lib/components/ui/code/index.js';
import { CopyButton } from '#lib/components/ui/copy-button/index.js';
import * as Tabs from '#lib/components/ui/tabs/index.js';
import {
	AlertTriangleIcon,
	BookOpenIcon,
	DownloadIcon,
	FileTextIcon,
	TerminalIcon
} from '#lib/icons/index.js';
import type { DeploymentTarget, GeneratedFile } from '#lib/types/instance-generator.type.js';

interface Props {
	target: DeploymentTarget;
	files: GeneratedFile[];
	issues: FieldIssue[];
	onExport: (method: 'copy' | 'download') => void;
	onFixField: (key: string) => void;
}

let { target, files, issues, onExport, onFixField }: Props = $props();

const STEPS_TAB = 'steps';
const focusRing =
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
const tabClass = `relative inline-flex min-h-11 flex-none items-center gap-1.5 rounded-none border-0 px-3 py-2 text-xs font-medium whitespace-nowrap text-muted-foreground shadow-none transition-colors hover:text-foreground sm:min-h-10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-primary dark:data-[state=active]:bg-transparent ${focusRing}`;
const actionClass = `h-11 rounded-md px-3 text-xs sm:h-8 ${focusRing}`;

let selectedTab = $state('');
let blocked = $derived(issues.length > 0);
let documents = $derived(files.filter((file) => file.filename));
let tabIds = $derived([...documents.map((file) => file.id), STEPS_TAB]);
let activeTab = $derived(tabIds.includes(selectedTab) ? selectedTab : tabIds[0]);

function downloadFile(file: GeneratedFile) {
	if (!file.filename || blocked) return;
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
</script>

<div class="flex min-h-0 flex-col gap-3 lg:max-h-below-header">
	<div class="flex items-start justify-between gap-4">
		<div class="grid min-w-0 gap-0.5">
			<h2 class="text-base font-semibold">{target.label}</h2>
			<p class="text-[0.8125rem] leading-snug text-muted-foreground">
				{target.resultDescription}
			</p>
		</div>
		<a
			href={target.docsHref}
			class={`-my-1 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-primary hover:underline sm:min-h-8 dark:text-primary-tint ${focusRing}`}
		>
			<BookOpenIcon class="size-3.5" />
			<span class="hidden sm:inline">{target.docsLabel}</span>
			<span class="sm:hidden">Docs</span>
		</a>
	</div>

	<div aria-live="polite">
		{#if blocked}
			<div
				class="grid gap-1.5 border-l-2 border-destructive py-1 pl-3 text-[0.8125rem] leading-snug"
			>
				<p class="flex items-center gap-1.5 font-medium">
					<AlertTriangleIcon class="size-3.5 shrink-0 text-destructive" />
					Fix {issues.length === 1 ? 'this field' : `these ${issues.length} fields`} to copy or
					download:
				</p>
				<ul class="grid gap-1">
					{#each issues as issue (issue.key)}
						<li>
							<a
								href={`#${issue.key}`}
								class={`rounded-sm font-medium text-foreground underline underline-offset-2 hover:text-primary ${focusRing}`}
								onclick={(event) => {
									event.preventDefault();
									onFixField(issue.key);
								}}
								>{issue.label}</a
							>
							<span class="text-muted-foreground">: {issue.message}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	<Tabs.Root
		value={activeTab}
		onValueChange={(next) => (selectedTab = next)}
		class="flex min-h-0 flex-1 flex-col gap-0"
	>
		<div class="flex flex-wrap items-center justify-between gap-x-2 border-b border-border">
			<Tabs.List
				class="-mb-px flex h-auto w-auto min-w-0 flex-wrap items-stretch justify-start gap-0 rounded-none bg-transparent p-0"
			>
				{#each documents as file (file.id)}
					<Tabs.Trigger value={file.id} class={`${tabClass} font-mono`}>
						<FileTextIcon class="size-3.5" />
						{file.filename}
					</Tabs.Trigger>
				{/each}
				<Tabs.Trigger value={STEPS_TAB} class={tabClass}>
					<TerminalIcon class="size-3.5" />
					Setup steps
				</Tabs.Trigger>
			</Tabs.List>
			{#each documents as file (file.id)}
				{#if activeTab === file.id}
					<div class="flex shrink-0 items-center gap-1 py-1">
						<CopyButton
							text={file.code}
							variant="ghost"
							size="xs"
							tabindex={0}
							disabled={blocked}
							class={actionClass}
							onCopy={handleCopy}
						>
							<span aria-hidden="true">Copy</span>
						</CopyButton>
						<Button
							variant="ghost"
							size="xs"
							class={actionClass}
							disabled={blocked}
							aria-label={`Download ${file.filename}`}
							onclick={() => downloadFile(file)}
						>
							<DownloadIcon class="size-3.5" />
							<span>Download</span>
						</Button>
					</div>
				{/if}
			{/each}
		</div>

		{#each documents as file (file.id)}
			<Tabs.Content value={file.id} class="mt-3 min-h-0 flex-1 overflow-hidden">
				<Code.Root lang={file.lang} code={file.code} class="text-[0.8125rem] [&_pre_.line]:py-0!" />
			</Tabs.Content>
		{/each}

		<Tabs.Content value={STEPS_TAB} class="mt-3 min-h-0 flex-1 overflow-y-auto">
			<ol class="grid gap-5 py-1">
				{#each files as file, index (file.id)}
					<li class="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 gap-y-2">
						<span
							class="grid size-6 place-items-center rounded-full border border-border text-2xs font-semibold text-muted-foreground"
							>{index + 1}</span
						>
						<div class="grid gap-0.5 pt-0.5">
							<p class="text-sm leading-snug font-medium">
								{file.filename ? `Save ${file.filename}` : file.title}
							</p>
							{#if file.description}
								<p class="text-[0.8125rem] leading-snug text-muted-foreground">
									{file.description}
								</p>
							{/if}
						</div>
						<div class="col-start-2">
							{#if file.filename}
								<div class="flex flex-wrap gap-2">
									<Button
										variant="outline"
										size="xs"
										class={actionClass}
										onclick={() => (selectedTab = file.id)}
									>
										<FileTextIcon class="size-3.5" />
										View {file.filename}
									</Button>
									<Button
										variant="outline"
										size="xs"
										class={actionClass}
										disabled={blocked}
										aria-label={`Download ${file.filename}`}
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
										class={`top-1 right-1 size-10 sm:size-8 ${focusRing}`}
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
