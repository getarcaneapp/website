<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';

	const oidcEnvConfig = [
		{
			name: 'OIDC_ENABLED',
			description: 'Enable OIDC login',
			defaultValue: 'false'
		},
		{
			name: 'OIDC_CLIENT_ID',
			description: 'Client ID from your OIDC provider',
			defaultValue: 'your_arcane_client_id_from_provider'
		},
		{
			name: 'OIDC_CLIENT_SECRET',
			description: 'Client Secret from provider',
			defaultValue: 'your_super_secret_client_secret_from_provider'
		},
		{
			name: 'OIDC_ISSUER_URL',
			description: 'Issuer URL of your OIDC provider, No trailing slash.',
			defaultValue: 'https://your-provider.com'
		},
		{
			name: 'OIDC_SCOPES',
			description: 'Scopes to request',
			defaultValue: 'openid email profile'
		},
		{
			name: 'OIDC_ADMIN_CLAIM',
			description: 'Where to find the admin claim in the OIDC token',
			defaultValue: '',
			exampleValue: 'groups'
		},
		{
			name: 'OIDC_ADMIN_VALUE',
			description: 'Values to check in the OIDC_ADMIN_CLAIM to give a user admin access',
			defaultValue: '',
			exampleValue: '_admin_group,_admin_group2'
		},
		{
			name: 'OIDC_MERGE_ACCOUNTS',
			description: 'Link OIDC logins to existing local accounts based on email address',
			defaultValue: 'false'
		}
	];
</script>

<div class="env-var-table mt-4">
	<Table.Root class="mb-6">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[220px]">Variable</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>Value</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each oidcEnvConfig as env}
				<Table.Row>
					<Table.Cell class="font-medium">
						<code class="bg-muted rounded px-1 py-0.5">{env.name}</code>
					</Table.Cell>
					<Table.Cell>{env.description}</Table.Cell>
					<Table.Cell>
						<div class="flex flex-col gap-1">
							<div class="flex items-center gap-1">
								<span class="text-muted-foreground w-14 text-xs">Default:</span>
								<code class="bg-muted rounded px-1 py-0.5">{env.defaultValue || '—'}</code>
							</div>
							<div class="flex items-center gap-1">
								<span class="text-muted-foreground w-14 text-xs">Example:</span>
								<code class="bg-muted rounded px-1 py-0.5">{env.exampleValue || '—'}</code>
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
