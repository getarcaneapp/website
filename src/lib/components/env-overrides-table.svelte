<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { envSettingsOverrides } from '#lib/config/pages/runtime-config.js';

	const searchId = $props.id();
	let query = $state('');
	const search = $derived(query.trim().toLowerCase());
	const filteredOverrides = $derived(
		envSettingsOverrides.filter((item) =>
			`${item.env} ${item.settingKey} ${item.description}`.toLowerCase().includes(search)
		)
	);
</script>

<div class="env-var-table mt-4">
	<div class="mb-3 flex flex-col gap-2">
		<Label for={searchId}>Search setting overrides</Label>
		<Input
			id={searchId}
			type="search"
			bind:value={query}
			placeholder="Name or description, e.g. backup"
		/>
	</div>
	<p class="mb-3 text-sm text-muted-foreground" role="status">
		{filteredOverrides.length} of {envSettingsOverrides.length} setting overrides
	</p>
	<Table.Root class="mb-6 table-fixed">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-72 whitespace-nowrap md:w-80 lg:w-96">Env Var</Table.Head>
				<Table.Head class="whitespace-normal">Details</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each filteredOverrides as item (item.env)}
				<Table.Row>
					<Table.Cell class="align-top whitespace-nowrap">
						<code
							class="inline-block max-w-full overflow-x-auto rounded bg-muted px-1.5 py-1 text-xs font-medium whitespace-nowrap sm:text-sm"
						>
							{item.env}
						</code>
					</Table.Cell>
					<Table.Cell class="align-top whitespace-normal">
						<div class="space-y-2.5">
							<div class="grid gap-2 sm:grid-cols-label-auto sm:items-center">
								<span
									class="self-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
								>
									Setting
								</span>
								<code
									class="inline-block max-w-full overflow-x-auto rounded bg-muted px-2 py-1 text-xs whitespace-nowrap sm:text-sm"
								>
									{item.settingKey}
								</code>
							</div>

							<p class="max-w-xl text-sm leading-5 wrap-break-word">{item.description}</p>

							{#if item.requires}
								<div class="text-xs leading-5 wrap-break-word text-muted-foreground">
									<span class="font-medium tracking-wide uppercase">Requires:</span>
									{item.requires}
								</div>
							{/if}

							{#if item.note}
								<div class="text-xs leading-5 wrap-break-word text-muted-foreground">
									{item.note}
								</div>
							{/if}

							{#if item.sensitive || item.deprecated}
								<div class="flex flex-wrap gap-2">
									{#if item.sensitive}
										<span
											class="rounded-full bg-warning/12 px-2 py-1 text-xs font-medium text-warning"
										>
											Sensitive
										</span>
									{/if}
									{#if item.deprecated}
										<span
											class="rounded-full bg-destructive/12 px-2 py-1 text-xs font-medium text-destructive"
										>
											Deprecated
										</span>
									{/if}
								</div>
							{/if}
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={2}
						>No setting overrides match. Try a shorter name or clear the search.</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
