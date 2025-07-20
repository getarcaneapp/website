<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Window } from '$lib/components/ui/window/index.js';
	import { browser } from '$app/environment';

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
			name: 'OIDC_REDIRECT_URI',
			description: 'Redirect URI (must match provider)',
			defaultValue: 'http://localhost:3000/auth/oidc/callback'
		},
		{
			name: 'OIDC_AUTHORIZATION_ENDPOINT',
			description: 'Auth endpoint URL',
			defaultValue: 'https://your-provider.com/oauth2/authorize'
		},
		{
			name: 'OIDC_TOKEN_ENDPOINT',
			description: 'Token endpoint URL',
			defaultValue: 'https://your-provider.com/oauth2/token'
		},
		{
			name: 'OIDC_USERINFO_ENDPOINT',
			description: 'Userinfo endpoint URL',
			defaultValue: 'https://your-provider.com/oauth2/userinfo'
		},
		{
			name: 'OIDC_SCOPES',
			description: 'Scopes to request',
			defaultValue: 'openid email profile (default)'
		}
	];
</script>

{#if browser}
	<Window>
		<Table.Root class="mb-6">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[220px]">Variable</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head>Default/Example</Table.Head>
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
							<code class="bg-muted rounded px-1 py-0.5">{env.defaultValue}</code>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Window>
{:else}
	<!-- Fallback for SSR -->
	<Table.Root class="mb-6">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[220px]">Variable</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>Default/Example</Table.Head>
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
						<code class="bg-muted rounded px-1 py-0.5">{env.defaultValue}</code>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
