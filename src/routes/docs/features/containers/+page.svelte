<script lang="ts">
	import DocsLayout from '$lib/components/DocsLayout.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
</script>

<DocsLayout>
	<h1 class="mb-4 text-3xl font-bold">Containers Overview</h1>

	<h2 class="mb-3 text-2xl font-semibold">What Can You Do With Containers in Arcane?</h2>
	<ul class="mb-8 list-inside list-disc space-y-2">
		<li>
			<strong>View Containers:</strong> See all containers on your Docker host, including their names,
			IDs, images, and current status (like running or stopped).
		</li>
		<li>
			<strong>Create Containers:</strong> Launch new containers from existing images. You can set the
			name, image, ports, volumes, environment variables, and more using a guided form.
		</li>
		<li>
			<strong>Start/Stop/Restart Containers:</strong> Easily control the state of your containers with
			one click.
		</li>
		<li>
			<strong>Inspect Containers:</strong> Click on a container to see detailed information, including
			configuration, network settings, mounts, and logs.
		</li>
		<li>
			<strong>Remove Containers:</strong> Delete containers you no longer need. You can only remove stopped
			containers (unless you use the force option).
		</li>
		<li>
			<strong>View Logs:</strong> Check the output and error logs for each container to help with troubleshooting.
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">How to Use</h2>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Viewing Containers</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Go to the <strong>Containers</strong> section in the sidebar.</li>
		<li>
			You’ll see a table listing all your Docker containers with their names, IDs, images, and
			status.
		</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Creating a Container</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click the <strong>Create Container</strong> button.</li>
		<li>Fill out the form with the required details (name, image, etc.).</li>
		<li>(Optional) Set advanced options like ports, volumes, environment variables, and more.</li>
		<li>Click <strong>Create</strong> to launch your new container.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Controlling a Container</h3>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>Start:</strong> Click the <strong>Start</strong> button to run a stopped container.
		</li>
		<li>
			<strong>Stop:</strong> Click the <strong>Stop</strong> button to stop a running container.
		</li>
		<li>
			<strong>Restart:</strong> Click the <strong>Restart</strong> button to quickly restart a container.
		</li>
	</ul>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Inspecting a Container</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click on a container’s name or the <strong>Inspect</strong> button.</li>
		<li>
			View detailed information about the container’s configuration, state, network, mounts, and
			logs.
		</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Removing a Container</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>In the containers list, find the container you want to remove.</li>
		<li>Click the <strong>Remove</strong> button (trash icon).</li>
		<li>Confirm the deletion in the dialog.</li>
	</ol>
	<Alert.Root class="mb-6">
		<Alert.Title>Note</Alert.Title>
		<Alert.Description>
			You can only remove stopped containers unless you use the force option.
		</Alert.Description>
	</Alert.Root>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Viewing Logs</h3>
	<ol class="mb-8 list-decimal space-y-2 pl-6">
		<li>Click on a container to open its details.</li>
		<li>Go to the <strong>Logs</strong> tab to see the container’s output and error logs.</li>
	</ol>
</DocsLayout>
