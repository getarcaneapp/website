<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import * as Code from '$lib/components/ui/code';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';

	const composeFile = `services:
  arcane:
    # ... image, ports, volumes ...
    environment:
      # ....
      - OIDC_ENABLED=true
      - OIDC_CLIENT_ID=your_arcane_client_id_from_provider
      - OIDC_CLIENT_SECRET=your_super_secret_client_secret_from_provider
      - OIDC_REDIRECT_URI=http://your-arcane-address/auth/oidc/callback
      - OIDC_AUTHORIZATION_ENDPOINT=https://your-provider.com/oauth2/authorize
      - OIDC_TOKEN_ENDPOINT=https://your-provider.com/oauth2/token
      - OIDC_USERINFO_ENDPOINT=https://your-provider.com/oauth2/userinfo
      - OIDC_SCOPES=openid email profile
`;
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">User Management &amp; Single Sign-On (OIDC)</h1>

	<p class="mb-6">
		Arcane supports both local user management and Single Sign-On (OIDC) for flexible, secure access
		control.
	</p>

	<h2 class="mt-8 mb-3 text-2xl font-semibold">Single Sign-On (OIDC)</h2>

	<Alert.Root class="mb-4">
		<Alert.Title>ℹ️ Introduced in version 0.9.0</Alert.Title>
		<Alert.Description>This feature was added in Arcane v0.9.0.</Alert.Description>
	</Alert.Root>

	<h3 class="mt-6 mb-2 text-xl font-semibold">Recommended: Configure OIDC in the UI</h3>

	<Alert.Root class="mb-4">
		<Alert.Title>⚠️ PKCE Required</Alert.Title>
		<Alert.Description>Arcane requires the use of PKCE for OIDC Authentication.</Alert.Description>
	</Alert.Root>

	<ul class="mb-4 list-inside list-disc space-y-1">
		<li>Go to <strong>Settings → Authentication</strong> in Arcane.</li>
		<li>
			Enter your OIDC provider details (Issuer URL, Client ID, Client Secret, Redirect URI, etc).
		</li>
		<li>Save and test the connection.</li>
		<li>The UI will guide you through any missing or invalid fields.</li>
	</ul>

	<p class="mb-6">
		OIDC users are auto-provisioned on first login. You can disable local login for stricter
		security.
	</p>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Alternative: Environment Variables</h3>

	<p class="mb-2">You can also configure OIDC using environment variables:</p>

	<Table.Root class="mb-6">
		<Table.Caption>OIDC environment variables and their usage.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[220px]">Variable</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>Default/Example</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_ENABLED</code>
				</Table.Cell>
				<Table.Cell>Enable OIDC login</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5">false</code>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_CLIENT_ID</code>
				</Table.Cell>
				<Table.Cell>Client ID from your OIDC provider</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5">your_arcane_client_id_from_provider</code>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_CLIENT_SECRET</code>
				</Table.Cell>
				<Table.Cell>Client Secret from provider</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5"
						>your_super_secret_client_secret_from_provider</code
					>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_REDIRECT_URI</code>
				</Table.Cell>
				<Table.Cell>Redirect URI (must match provider)</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5">http://localhost:3000/auth/oidc/callback</code>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_AUTHORIZATION_ENDPOINT</code>
				</Table.Cell>
				<Table.Cell>Auth endpoint URL</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5"
						>https://your-provider.com/oauth2/authorize</code
					>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_TOKEN_ENDPOINT</code>
				</Table.Cell>
				<Table.Cell>Token endpoint URL</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5">https://your-provider.com/oauth2/token</code>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_USERINFO_ENDPOINT</code>
				</Table.Cell>
				<Table.Cell>Userinfo endpoint URL</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5">https://your-provider.com/oauth2/userinfo</code
					>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="font-medium">
					<code class="bg-muted rounded px-1 py-0.5">OIDC_SCOPES</code>
				</Table.Cell>
				<Table.Cell>Scopes to request</Table.Cell>
				<Table.Cell>
					<code class="bg-muted rounded px-1 py-0.5">openid email profile</code> (default)
				</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>

	<h4 class="mt-8 mb-2 text-lg font-semibold">Example docker-compose</h4>

	<div class="mb-8">
		<Code.Root lang="yaml" class="w-full" code={composeFile}>
			<Code.CopyButton size="sm" variant="ghost" />
		</Code.Root>
	</div>

	<p class="mb-4">
		<strong>Note:</strong> Env vars always override UI settings. The Redirect URI in Arcane and your
		OIDC provider must match exactly.
	</p>

	<hr class="my-8" />

	<p class="text-gray-700">
		For troubleshooting, check both your OIDC provider and Arcane logs for errors.
	</p>
</ContentWrapper>
