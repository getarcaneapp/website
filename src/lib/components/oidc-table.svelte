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
			defaultValue: '—',
			exampleValue: 'your_arcane_client_id_from_provider'
		},
		{
			name: 'OIDC_CLIENT_SECRET',
			description: 'Client Secret from provider',
			defaultValue: '—',
			exampleValue: 'your_super_secret_client_secret_from_provider'
		},
		{
			name: 'OIDC_ISSUER_URL',
			description: 'Issuer URL of your OIDC provider. No trailing slash.',
			defaultValue: '—',
			exampleValue: 'https://your-provider.com'
		},
		{
			name: 'OIDC_SCOPES',
			description: 'Scopes to request',
			defaultValue: 'openid email profile'
		},
		{
			name: 'OIDC_ADMIN_CLAIM',
			description: 'Where to find the admin claim in the OIDC token',
			defaultValue: '—',
			exampleValue: 'groups'
		},
		{
			name: 'OIDC_ADMIN_VALUE',
			description:
				'Values to check in the OIDC_ADMIN_CLAIM to give a user admin access. Multiple values can be comma-separated.',
			defaultValue: '—',
			exampleValue: '_admin_group,_admin_group2'
		},
		{
			name: 'OIDC_MERGE_ACCOUNTS',
			description: 'Link OIDC logins to existing local accounts based on email address',
			defaultValue: 'false'
		},
		{
			name: 'OIDC_SKIP_TLS_VERIFY',
			description: 'Skip TLS verification for the OIDC provider (use with caution)',
			defaultValue: 'false'
		},
		{
			name: 'OIDC_AUTO_REDIRECT_TO_PROVIDER',
			description: 'Automatically redirect users to the OIDC provider on login',
			defaultValue: 'false'
		},
		{
			name: 'OIDC_PROVIDER_NAME',
			description: 'Provider display name shown on the login screen',
			defaultValue: '—'
		},
		{
			name: 'OIDC_PROVIDER_LOGO_URL',
			description: 'Provider logo URL shown on the login screen',
			defaultValue: '—'
		}
	];

	const oidcManualConfig = [
		{
			name: 'OIDC_AUTHORIZATION_ENDPOINT',
			description: 'Override/Manual authorization URL (e.g., https://provider.com/auth)',
			defaultValue: '—'
		},
		{
			name: 'OIDC_TOKEN_ENDPOINT',
			description: 'Override/Manual token URL (e.g., https://provider.com/token)',
			defaultValue: '—'
		},
		{
			name: 'OIDC_USERINFO_ENDPOINT',
			description: 'Override/Manual userinfo URL (e.g., https://provider.com/userinfo)',
			defaultValue: '—'
		},
		{
			name: 'OIDC_JWKS_ENDPOINT',
			description: 'Override/Manual JWKS URL for token verification (e.g., https://provider.com/jwks)',
			defaultValue: '—'
		}
	];

	const oidcArcaneEndpoints = [
		{
			type: 'Redirect URI',
			value: '{APP_URL}/auth/oidc/callback',
			description: 'The URL to register with your OIDC provider'
		}
	];
</script>

<div class="mt-4 space-y-8">
	<div class="env-var-table">
		<h3 class="mb-3 text-lg font-semibold">Primary Configuration</h3>
		<Table.Root class="mb-6">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-55">Variable</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head>Value</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
			{#each oidcEnvConfig as env (env.name)}
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
								{#if env.exampleValue}
									<div class="flex items-center gap-1">
										<span class="text-muted-foreground w-14 text-xs">Example:</span>
										<code class="bg-muted rounded px-1 py-0.5">{env.exampleValue}</code>
									</div>
								{/if}
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="manual-config-table">
		<h3 class="mb-3 text-lg font-semibold">Manual Endpoint Overrides (Advanced)</h3>
		<p class="text-muted-foreground mb-4 text-sm">
			Use these if your OIDC provider does not support standard discovery via the Issuer URL.
		</p>
		<Table.Root class="mb-6">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-55">Variable</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head>Value</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
			{#each oidcManualConfig as env (env.name)}
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
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="endpoint-table">
		<h3 class="mb-3 text-lg font-semibold">Arcane Configuration Values</h3>
		<Table.Root class="mb-6">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-37.5">Type</Table.Head>
					<Table.Head>Value</Table.Head>
					<Table.Head>Description</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
			{#each oidcArcaneEndpoints as endpoint (endpoint.type)}
					<Table.Row>
						<Table.Cell class="font-medium">{endpoint.type}</Table.Cell>
						<Table.Cell>
							<code class="bg-muted rounded px-1 py-0.5">{endpoint.value}</code>
						</Table.Cell>
						<Table.Cell>{endpoint.description}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
