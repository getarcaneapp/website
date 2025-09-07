<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import Settings from '@lucide/svelte/icons/settings';
	import Database from '@lucide/svelte/icons/database';
	import FileText from '@lucide/svelte/icons/file-text';
	import { generateDockerCompose } from '$lib/utils/docker-compose-generator.js';
	import type { DockerComposeConfig } from '$lib/types/compose-config.type.js';
	import DockerComposeDialog from './docker-compose-dialog.svelte';

	let config = $state<DockerComposeConfig>({
		// Basic settings
		appUrl: 'http://localhost:3552',
		port: '3552',
		puid: '1000',
		pgid: '1000',
		dataPath: 'arcane-data',
		dockerSocket: '/var/run/docker.sock',
		encryptionKey: '',
		jwtSecret: '',

		// Database settings
		enableDatabase: false,
		dbType: 'postgres',
		dbName: 'arcane',
		dbUser: 'arcane',
		dbPassword: 'your_secure_password',
		dbPort: '5432',

		// Authentication
		enableOIDC: false,
		oidcClientId: '',
		oidcClientSecret: '',
		oidcIssuerUrl: 'https://your-provider.com',
		oidcScopes: 'openid email profile'
	});

	let generatedCompose = $state('');
	let dialogOpen = $state(false);

	function handleGenerateDockerCompose() {
		generatedCompose = generateDockerCompose(config);
		dialogOpen = true;
	}

	function generateRandomKey() {
		return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join(
			''
		);
	}
</script>

<div class="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6">
	<div class="space-y-6">
		<Tabs.Root value="basic">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="basic">
					<Settings class="mr-2 size-4" />
					Basic
				</Tabs.Trigger>
				<Tabs.Trigger value="database">
					<Database class="mr-2 size-4" />
					<span class="hidden sm:inline">Database & Auth</span>
					<span class="sm:hidden">DB & Auth</span>
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="basic">
				<Card.Root class="mt-6">
					<Card.Header>
						<Card.Title>Basic Configuration</Card.Title>
						<Card.Description>Core Arcane settings</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div class="space-y-2">
								<Label for="appUrl">App URL</Label>
								<Input id="appUrl" bind:value={config.appUrl} placeholder="http://localhost:3552" />
							</div>
							<div class="space-y-2">
								<Label for="port">Port</Label>
								<Input id="port" bind:value={config.port} placeholder="8080" />
							</div>
							<div class="space-y-2">
								<Label for="dataPath">Data Volume</Label>
								<Input id="dataPath" bind:value={config.dataPath} placeholder="arcane-data" />
							</div>
							<div class="space-y-2">
								<Label for="puid">PUID (User ID)</Label>
								<Input id="puid" bind:value={config.puid} placeholder="1000" />
							</div>
							<div class="space-y-2">
								<Label for="pgid">PGID (Group ID)</Label>
								<Input id="pgid" bind:value={config.pgid} placeholder="1000" />
							</div>
						</div>
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div class="space-y-2">
								<Label for="encryptionKey">Encryption Key (Optional)</Label>
								<div class="flex flex-col gap-2 sm:flex-row">
									<Input
										id="encryptionKey"
										bind:value={config.encryptionKey}
										placeholder="Auto-generated if empty"
										class="flex-1"
									/>
									<Button
										type="button"
										variant="outline"
										onclick={() => (config.encryptionKey = generateRandomKey())}
										class="w-full sm:w-auto"
									>
										Generate
									</Button>
								</div>
							</div>
							<div class="space-y-2">
								<Label for="jwtSecret">JWT Secret (Optional)</Label>
								<div class="flex flex-col gap-2 sm:flex-row">
									<Input
										id="jwtSecret"
										bind:value={config.jwtSecret}
										placeholder="Auto-generated if empty"
										class="flex-1"
									/>
									<Button
										type="button"
										variant="outline"
										onclick={() => (config.jwtSecret = generateRandomKey())}
										class="w-full sm:w-auto"
									>
										Generate
									</Button>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="database" class="space-y-4">
				<Card.Root class="mt-6">
					<Card.Header>
						<Card.Title>Database Configuration</Card.Title>
						<Card.Description
							>By default, Arcane uses SQLite. Enable this for external PostgreSQL database.</Card.Description
						>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="flex items-center space-x-2">
							<Checkbox id="enableDatabase" bind:checked={config.enableDatabase} />
							<Label for="enableDatabase" class="text-sm sm:text-base">Use external PostgreSQL database</Label>
						</div>

						{#if config.enableDatabase}
							<div class="space-y-4">
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="space-y-2">
										<Label for="dbName">Database Name</Label>
										<Input id="dbName" bind:value={config.dbName} />
									</div>
									<div class="space-y-2">
										<Label for="dbUser">Database User</Label>
										<Input id="dbUser" bind:value={config.dbUser} />
									</div>
									<div class="space-y-2">
										<Label for="dbPassword">Database Password</Label>
										<Input id="dbPassword" type="password" bind:value={config.dbPassword} />
									</div>
									<div class="space-y-2">
										<Label for="dbPort">Database Port</Label>
										<Input id="dbPort" bind:value={config.dbPort} />
									</div>
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>OIDC Authentication</Card.Title>
						<Card.Description>Single Sign-On configuration</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="flex items-center space-x-2">
							<Checkbox id="enableOIDC" bind:checked={config.enableOIDC} />
							<Label for="enableOIDC" class="text-sm sm:text-base">Enable OIDC Authentication</Label>
						</div>

						{#if config.enableOIDC}
							<div class="space-y-4">
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="space-y-2">
										<Label for="oidcClientId">Client ID</Label>
										<Input id="oidcClientId" bind:value={config.oidcClientId} />
									</div>
									<div class="space-y-2">
										<Label for="oidcClientSecret">Client Secret</Label>
										<Input id="oidcClientSecret" type="password" bind:value={config.oidcClientSecret} />
									</div>
								</div>
								<div class="space-y-2">
									<Label for="oidcIssuerUrl">OIDC Issuer URL</Label>
									<Input id="oidcIssuerUrl" bind:value={config.oidcIssuerUrl} placeholder="https://sso.example.com" />
								</div>
								<div class="space-y-2">
									<Label for="oidcScopes">Scopes</Label>
									<Input id="oidcScopes" bind:value={config.oidcScopes} placeholder="openid email profile" />
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>

		<div class="flex justify-center">
			<Button onclick={handleGenerateDockerCompose} size="lg" class="w-full sm:w-auto sm:min-w-48">
				<FileText class="mr-2 h-4 w-4" />
				Generate Docker Compose
			</Button>
		</div>
	</div>
</div>

<DockerComposeDialog bind:open={dialogOpen} {generatedCompose} />
