<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { envSettingsOverrides } from '$lib/config/pages/env-settings-overrides.js';
</script>

<div class="env-var-table mt-4">
	<Table.Root class="mb-6">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[220px]">Env Var</Table.Head>
				<Table.Head>Maps To Setting</Table.Head>
				<Table.Head>Description / Notes</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each envSettingsOverrides as item}
				<Table.Row>
					<Table.Cell class="font-medium">
						<code class="bg-muted rounded px-1 py-0.5">{item.env}</code>
					</Table.Cell>
					<Table.Cell>
						<code class="bg-muted rounded px-1 py-0.5">{item.settingKey}</code>
					</Table.Cell>
					<Table.Cell>
						{item.description}
						{#if item.requires}
							<div class="text-muted-foreground mt-1 text-xs">Requires: {item.requires}</div>
						{/if}
						{#if item.note}
							<div class="text-muted-foreground mt-1 text-xs">{item.note}</div>
						{/if}
						{#if item.sensitive}
							<div class="mt-1 text-xs text-amber-500">Sensitive</div>
						{/if}
						{#if item.deprecated}
							<div class="mt-1 text-xs text-red-500">Deprecated</div>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
