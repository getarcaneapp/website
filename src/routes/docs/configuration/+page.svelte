<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Window } from '$lib/components/ui/window';
	import { envConfig } from '$lib/config/pages/env-config';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Arcane Configuration</h1>

	<h3 class="mb-3 text-xl font-semibold">How to Change Settings</h3>

	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Open Arcane in your browser</li>
		<li>Expand the <strong>Settings</strong> section in the sidebar.</li>
		<li>Choose the section of settings you want to change.</li>
		<li>Make your changes and Save</li>
	</ol>

	<h3 class="mb-3 text-xl font-semibold">Environment Variables</h3>
	<Window>
		<Table.Root class="mb-8">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[220px]">Variable</Table.Head>
					<Table.Head>Purpose</Table.Head>
					<Table.Head>Default/Examples</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each envConfig as env}
					<Table.Row>
						<Table.Cell class="font-medium">
							<code class="bg-muted rounded px-1 py-0.5">{env.name}</code>
						</Table.Cell>
						<Table.Cell>{env.description}</Table.Cell>
						<Table.Cell>
							<code class="bg-muted rounded px-1 py-0.5">{env.value}</code>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Window>
</ContentWrapper>
