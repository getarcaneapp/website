<script lang="ts">
export interface Flag {
	name: string;
	description: string;
	default?: string;
}

export interface Command {
	name: string;
	description: string;
	aliases?: string[];
	usage: string;
	flags: Flag[];
	globalFlags?: Flag[];
	subcommands?: Array<{ name: string; description: string }>;
	examples?: string[];
}

let { command }: { command: Command } = $props();
</script>

<div class="space-y-6">
	<div>
		<p class="text-foreground/90">{command.description}</p>
	</div>

	<div>
		<h3 class="mb-2 text-lg font-semibold">Usage</h3>
		<pre class="bg-muted overflow-x-auto rounded-lg p-4"><code>{command.usage}</code></pre>
	</div>

	{#if command.aliases && command.aliases.length > 0}
		<div>
			<h3 class="mb-2 text-lg font-semibold">Aliases</h3>
			<p class="text-foreground/80 font-mono">{command.aliases.join(', ')}</p>
		</div>
	{/if}

	{#if command.subcommands && command.subcommands.length > 0}
		<div>
			<h3 class="mb-2 text-lg font-semibold">Available Commands</h3>
			<ul class="space-y-1">
				{#each command.subcommands as subcmd}
					<li class="text-foreground/90">
						<code class="font-mono">{subcmd.name}</code>
						<span class="text-foreground/70"> — {subcmd.description}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if command.flags && command.flags.length > 0}
		<div>
			<h3 class="mb-2 text-lg font-semibold">Flags</h3>
			<div class="space-y-2">
				{#each command.flags as flag}
					<div>
						<code class="text-primary font-mono text-sm">{flag.name}</code>
						<p class="text-foreground/80 ml-4 text-sm">
							{flag.description}
							{#if flag.default}
								<span class="text-foreground/60"> (default: <code class="font-mono">{flag.default}</code>)</span>
							{/if}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if command.globalFlags && command.globalFlags.length > 0}
		<div>
			<h3 class="mb-2 text-lg font-semibold">Global Flags</h3>
			<div class="space-y-2">
				{#each command.globalFlags as flag}
					<div>
						<code class="text-primary font-mono text-sm">{flag.name}</code>
						<p class="text-foreground/80 ml-4 text-sm">
							{flag.description}
							{#if flag.default}
								<span class="text-foreground/60"> (default: <code class="font-mono">{flag.default}</code>)</span>
							{/if}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if command.examples && command.examples.length > 0}
		<div>
			<h3 class="mb-2 text-lg font-semibold">Examples</h3>
			<div class="space-y-3">
				{#each command.examples as example}
					<pre class="bg-muted overflow-x-auto rounded-lg p-4"><code>{example}</code></pre>
				{/each}
			</div>
		</div>
	{/if}
</div>
