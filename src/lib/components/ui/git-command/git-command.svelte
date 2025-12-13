<!--
	Installed from @ieedan/shadcn-svelte-extras
	Modified to use git commands instead of package manager commands by Kyle Mendell
-->

<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	const style = tv({
		base: 'border-border w-full rounded-lg border',
		variants: {
			variant: {
				default: 'bg-card',
				secondary: 'bg-secondary/50 border-transparent'
			}
		}
	});

	type Variant = VariantProps<typeof style>['variant'];

	export type GitCommandProps = {
		variant?: Variant;
		class?: string;
		agents?: string[];
		agent?: string;
		repo?: string;
		command?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import CopyButton from '$lib/components/ui/copy-button/copy-button.svelte';
	import { ClipboardIcon, TerminalIcon } from '@lucide/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	type ChildProps = { props: Record<string, unknown> };

	let {
		variant = 'default',
		class: className,
		agents = ['https', 'ssh', 'gh'],
		agent = $bindable('https'),
		repo = $bindable('getarcaneapp/arcane'),
		command = ''
	}: GitCommandProps = $props();

	function getCommand(agent: string, repo: string, command: string) {
		if (command && command.trim() !== '') {
			return command;
		}
		switch (agent) {
			case 'https':
				return `git clone https://github.com/${repo}.git`;
			case 'ssh':
				return `git clone git@github.com:${repo}.git`;
			case 'gh':
				return `gh repo clone ${repo}`;
			default:
				return '';
		}
	}

	const commandText = $derived(getCommand(agent, repo, command));
</script>

<div class={cn(style({ variant }), className)}>
	<div class="border-border flex place-items-center justify-between gap-2 border-b py-1 pr-2">
		<div class="flex place-items-center gap-2 px-2">
			<div class="bg-foreground flex size-4 place-items-center justify-center opacity-50">
				<TerminalIcon class="text-background size-3" />
			</div>
			<Tabs.Root bind:value={agent}>
				<Tabs.List class="h-auto bg-transparent p-0">
					{#each agents as pm (pm)}
						<Tabs.Trigger value={pm} class="h-7 font-mono text-sm font-light">
							{pm}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</Tabs.Root>
		</div>
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props }: ChildProps)}
						<CopyButton {...props} text={commandText} class="size-6 [&_svg]:size-3" variant="ghost" size="sm">
							{#snippet icon()}
								<ClipboardIcon />
							{/snippet}
						</CopyButton>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Copy to Clipboard</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
	<div class="no-scrollbar overflow-x-auto p-3">
		<span class="text-muted-foreground font-mono text-sm leading-none font-light text-nowrap">
			{commandText}
		</span>
	</div>
</div>

<style>
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
