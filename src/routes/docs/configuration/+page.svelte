<script lang="ts">
	import DocsLayout from '$lib/components/DocsLayout.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
</script>

<DocsLayout>
	<h1 class="mb-4 text-3xl font-bold">Arcane Configuration</h1>

	<h3 class="mb-3 text-xl font-semibold">How to Change Settings</h3>

	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Open Arcane in your browser</li>
		<li>Expand the <strong>Settings</strong> section in the sidebar.</li>
		<li>Choose the section of settings you want to change.</li>
		<li>Make your changes and Save</li>
	</ol>

	<h3 class="mb-3 text-xl font-semibold">Environment Variables</h3>

	<Table.Root class="mb-8">
		<Table.Caption>Common Arcane environment variables and their usage.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[220px]">Variable</Table.Head>
				<Table.Head>Purpose</Table.Head>
				<Table.Head>Default/Examples</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">PORT</code></Table.Cell
				>
				<Table.Cell>The port arcane should run on</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">8080</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">DEV_BACKEND_URL</code></Table.Cell
				>
				<Table.Cell>The url of the backend for development</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5">http://localhost:8080</code></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">PUID</code></Table.Cell
				>
				<Table.Cell>File owner user ID</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">2000</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">PGID</code></Table.Cell
				>
				<Table.Cell>File owner group ID</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">2000</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">DOCKER_GID</code></Table.Cell
				>
				<Table.Cell>Docker group ID</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">(auto)</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">ENCRYPTION_KEY</code></Table.Cell
				>
				<Table.Cell>Encryption Key for secure stored sensitive data</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">-</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">JWT_SECRET</code></Table.Cell
				>
				<Table.Cell>Session secret</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">-</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_ENABLED</code></Table.Cell
				>
				<Table.Cell>Enable OIDC login</Table.Cell>
				<Table.Cell><code class="bg-muted rounded px-1 py-0.5">false</code></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_CLIENT_ID</code></Table.Cell
				>
				<Table.Cell>Client ID from your OIDC provider</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5">your_arcane_client_id_from_provider</code
					></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_CLIENT_SECRET</code></Table.Cell
				>
				<Table.Cell>Client Secret from provider</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5">your_client_secret_from_provider</code
					></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_REDIRECT_URI</code></Table.Cell
				>
				<Table.Cell>Redirect URI (must match provider)</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5">http://localhost:3000/auth/oidc/callback</code
					></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_AUTHORIZATION_ENDPOINT</code></Table.Cell
				>
				<Table.Cell>Auth endpoint URL</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5"
						>https://your-provider.com/oauth2/authorize</code
					></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_TOKEN_ENDPOINT</code></Table.Cell
				>
				<Table.Cell>Token endpoint URL</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5">https://your-provider.com/oauth2/token</code
					></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_USERINFO_ENDPOINT</code></Table.Cell
				>
				<Table.Cell>Userinfo endpoint URL</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5"
						>https://your-provider.com/oauth2/userinfo</code
					></Table.Cell
				>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium"
					><code class="bg-muted rounded px-1 py-0.5">OIDC_SCOPES</code></Table.Cell
				>
				<Table.Cell>Scopes to request</Table.Cell>
				<Table.Cell
					><code class="bg-muted rounded px-1 py-0.5">openid email profile</code> (default)</Table.Cell
				>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</DocsLayout>
