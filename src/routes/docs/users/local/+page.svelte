<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Snippet } from '$lib/components/ui/snippet';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">User Management &amp; Single Sign-On (OIDC)</h1>

	<p class="mb-6">
		Arcane supports both local user management and Single Sign-On (OIDC) for flexible, secure access
		control.
	</p>

	<h2 class="mt-8 mb-3 text-2xl font-semibold">Local User Management</h2>

	<Alert.Root class="mb-4">
		<Alert.Title>ℹ️ Default Admin User</Alert.Title>
		<Alert.Description>
			On first run, Arcane creates a default admin user if no users exist. You must change this
			password during onboarding.
		</Alert.Description>
	</Alert.Root>

	<div class="mb-4 flex max-w-xs flex-col gap-2">
		<div>
			<strong>Username:</strong>
			<Snippet text="arcane" class="ml-2 max-w-[300px]" />
		</div>
		<div>
			<strong>Password:</strong>
			<Snippet text="arcane-admin" class="ml-2 max-w-[300px]" />
		</div>
	</div>

	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			To add users: Go to <strong>Settings → User Management</strong> and click
			<strong>Create User</strong>. Fill in username, display name, email, and password.
		</li>
	</ul>

	<hr class="my-8" />

	<p class="text-gray-700">
		For more secure authentication, see the Single Sign-On (OIDC) section.
	</p>
</ContentWrapper>
