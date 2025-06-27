<script lang="ts">
	import DocsLayout from '$lib/components/DocsLayout.svelte';
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

	<div class="mb-8 overflow-x-auto">
		<table class="w-full border-collapse">
			<thead>
				<tr class="border-border bg-muted text-muted-foreground border-b">
					<th class="p-2 text-left font-semibold">Variable</th>
					<th class="p-2 text-left font-semibold">Purpose</th>
					<th class="p-2 text-left font-semibold">Default/Examples</th>
					<th class="p-2 text-left font-semibold">Notes</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>PORT</code
						></td
					>
					<td class="p-2">The port arcane should run on</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>8080</code
						></td
					>
					<td class="p-2">Optional</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>DEV_BACKEND_URL</code
						></td
					>
					<td class="p-2">The url of the backend for development</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>http://localhost:8080</code
						></td
					>
					<td class="p-2">Development Only</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>PUID</code
						></td
					>
					<td class="p-2">File owner user ID</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>2000</code
						></td
					>
					<td class="p-2">Use your user ID</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>PGID</code
						></td
					>
					<td class="p-2">File owner group ID</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>2000</code
						></td
					>
					<td class="p-2">Use your group ID</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>DOCKER_GID</code
						></td
					>
					<td class="p-2">Docker group ID</td>
					<td class="p-2">(auto)</td>
					<td class="p-2">Only if needed</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>ENCRYPTION_KEY</code
						></td
					>
					<td class="p-2">Encrytion Key for secure stored sensitive data</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>-</code
						></td
					>
					<td class="p-2">Required</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>JWT_SECRET</code
						></td
					>
					<td class="p-2">Session secret</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>-</code
						></td
					>
					<td class="p-2">Required</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_ENABLED</code
						></td
					>
					<td class="p-2">Enable OIDC login</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>false</code
						></td
					>
					<td class="p-2">Sets OIDC Auth to be enabled</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_CLIENT_ID</code
						></td
					>
					<td class="p-2">Client ID from your OIDC provider</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>your_arcane_client_id_from_provider</code
						></td
					>
					<td class="p-2">NA</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_CLIENT_SECRET</code
						></td
					>
					<td class="p-2">Client Secret from provider</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>your_super_secret_client_secret_from_provider</code
						></td
					>
					<td class="p-2">NA</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_REDIRECT_URI</code
						></td
					>
					<td class="p-2">Redirect URI (must match provider)</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>http://localhost:3000/auth/oidc/callback</code
						></td
					>
					<td class="p-2">NA</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_AUTHORIZATION_ENDPOINT</code
						></td
					>
					<td class="p-2">Auth endpoint URL</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>https://your-provider.com/oauth2/authorize</code
						></td
					>
					<td class="p-2">NA</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_TOKEN_ENDPOINT</code
						></td
					>
					<td class="p-2">Token endpoint URL</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>https://your-provider.com/oauth2/token</code
						></td
					>
					<td class="p-2">NA</td>
				</tr>
				<tr class="border-border bg-card border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_USERINFO_ENDPOINT</code
						></td
					>
					<td class="p-2">Userinfo endpoint URL</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>https://your-provider.com/oauth2/userinfo</code
						></td
					>
					<td class="p-2">NA</td>
				</tr>
				<tr class="border-border border-b">
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>OIDC_SCOPES</code
						></td
					>
					<td class="p-2">Scopes to request</td>
					<td class="p-2"
						><code
							class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
							>openid email profile</code
						> (default)</td
					>
					<td class="p-2">NA</td>
				</tr>
			</tbody>
		</table>
	</div>
</DocsLayout>
