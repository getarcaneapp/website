<script lang="ts">
	import { onMount } from 'svelte';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { envConfig, getRuntimeEnvConfig } from '#lib/config/pages/runtime-config.js';

	const searchId = $props.id();
	let query = $state('');
	let tableConfig = $state(envConfig);
	const search = $derived(query.trim().toLowerCase());
	const filteredConfig = $derived(
		tableConfig.filter((env) => `${env.name} ${env.description}`.toLowerCase().includes(search))
	);

	onMount(() => {
		void (async () => {
			tableConfig = await getRuntimeEnvConfig();
		})();
	});
</script>

<div class="env-var-table mt-4">
	<div class="mb-3 flex flex-col gap-2">
		<Label for={searchId}>Search environment variables</Label>
		<Input
			id={searchId}
			type="search"
			bind:value={query}
			placeholder="Name or description, e.g. backup"
		/>
	</div>
	<p class="mb-3 text-sm text-muted-foreground" role="status">
		{filteredConfig.length} of {tableConfig.length} variables
	</p>
	<Table.Root class="mb-6 table-fixed">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-72 whitespace-nowrap md:w-80 lg:w-96">Variable</Table.Head>
				<Table.Head class="whitespace-normal">Details</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredConfig as env (env.name)}
				<Table.Row>
					<Table.Cell class="align-top font-medium whitespace-nowrap">
						<code
							class="inline-block max-w-full overflow-x-auto rounded bg-muted px-1.5 py-1 text-xs whitespace-nowrap sm:text-sm"
						>
							{env.name}
						</code>
					</Table.Cell>
					<Table.Cell class="align-top whitespace-normal">
						<div class="space-y-2.5">
							<p class="max-w-xl text-sm leading-5 wrap-break-word">{env.description}</p>

							{#if env.deprecated}
								<span
									class="inline-block rounded-full bg-red-500/12 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400"
								>
									Deprecated
								</span>
							{/if}

							<div class="grid gap-2 sm:grid-cols-[minmax(5rem,auto)_1fr] sm:items-center">
								<span
									class="self-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
								>
									Default
								</span>
								<code
									class="inline-block rounded bg-muted px-2 py-1 text-xs break-all whitespace-normal sm:text-sm"
								>
									{env.defaultValue || '—'}
								</code>

								{#if env.exampleValue}
									<span
										class="self-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
									>
										Example
									</span>
									<code
										class="inline-block rounded bg-muted px-2 py-1 text-xs break-all whitespace-normal sm:text-sm"
									>
										{env.exampleValue}
									</code>
								{/if}
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={2}
						>No variables match. Try a shorter name or clear the search.</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
