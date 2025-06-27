<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import * as Code from '$lib/components/ui/code';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Compose Projects Overview</h1>

	<h2 class="mb-3 text-2xl font-semibold">What is a Compose Project?</h2>
	<p class="mb-6">
		A <strong>Compose Project</strong> is a collection of services defined in a
		<code class="bg-muted rounded px-1 py-0.5">compose.yaml</code> file. For example, a compose project
		might include a web server, a database, and a cache, all running together.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">What Can You Do With Compose Projects in Arcane?</h2>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>View Compose Projects:</strong> See all your managed compose projects and any external
			compose projects detected on your Docker host.
		</li>
		<li>
			<strong>Create Compose Projects:</strong> Add a new compose project by giving it a name and
			pasting your <code class="bg-muted rounded px-1 py-0.5">compose.yaml</code> content.
		</li>
		<li>
			<strong>Edit Environment Variables:</strong> Use the built-in
			<code class="bg-muted rounded px-1 py-0.5">.env</code> editor to manage environment variables for
			your compose project.
		</li>
		<li>
			<strong>Start/Stop Compose Projects:</strong> Easily start or stop all services in a compose project
			with one click.
		</li>
		<li>
			<strong>Restart or Redeploy:</strong> Restart a compose project or redeploy it to pull the latest
			images for your services.
		</li>
		<li>
			<strong>Update Compose Projects:</strong> Change the compose project’s name, update its compose
			file, or modify its environment variables.
		</li>
		<li>
			<strong>Remove Compose Projects:</strong> Delete a compose project and its definition from Arcane.
		</li>
		<li>
			<strong>Import External Compose Projects:</strong> Bring existing compose projects (not yet managed
			by Arcane) under Arcane’s control.
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">How to Use Compose Projects</h2>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Viewing Compose Projects</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Go to the <strong>Compose Projects</strong> section in the sidebar.</li>
		<li>
			You’ll see a list of all compose projects, including their names, status (running, partially
			running, stopped), and how many services are running.
		</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Creating a Compose Project</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click the <strong>Create Compose Project</strong> button.</li>
		<li>Enter a name for your compose project.</li>
		<li>
			Paste or write your <code class="bg-muted rounded px-1 py-0.5">compose.yaml</code> content.
		</li>
		<li>
			(Optional) Use the <strong>Environment Configuration (.env)</strong> editor to define
			environment variables for your compose project.<br />
			These variables will be saved in a <code class="bg-muted rounded px-1 py-0.5">.env</code> file
			alongside your compose file.
		</li>
		<li>
			Click <strong>Create</strong>. Arcane will save your compose project and try to start it.
		</li>
	</ol>

	<div class="border-border bg-muted/40 text-muted-foreground mb-6 rounded border p-4 text-sm">
		<strong>Note:</strong><br />
		To use environment variables from your <code class="bg-muted rounded px-1 py-0.5">.env</code>
		file in your services, you must still reference the file in your
		<code class="bg-muted rounded px-1 py-0.5">compose.yaml</code>
		using the <code class="bg-muted rounded px-1 py-0.5">env_file</code> property.<br />
		Example:
		<Code.Root
			lang="yaml"
			class="mt-2"
			code={`services:\n  web:\n    image: nginx\n    env_file:\n      - .env`}
		/>
	</div>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Controlling a Compose Project</h3>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>Start:</strong> Click the <strong>Start</strong> button to launch all services in the compose
			project.
		</li>
		<li>
			<strong>Stop:</strong> Click <strong>Stop</strong> to stop and remove all containers in the compose
			project.
		</li>
		<li>
			<strong>Restart:</strong> Click <strong>Restart</strong> to stop and then start the compose project
			again.
		</li>
		<li>
			<strong>Redeploy:</strong> Click <strong>Redeploy</strong> to pull the latest images and restart
			the compose project.
		</li>
	</ul>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Updating or Removing a Compose Project</h3>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			To update, open the compose project and click <strong>Edit</strong>. Change the name, compose
			file, or environment variables, then save.
		</li>
		<li>
			To remove, click the <strong>Remove</strong> button. Confirm the action to delete the compose project
			from Arcane.
		</li>
	</ul>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Importing External Compose Projects</h3>
	<p class="mb-6">
		If Arcane detects a compose project running on your Docker host that it doesn’t manage yet,
		you’ll see an <strong>Import</strong> option. Click it to bring the compose project under Arcane’s
		management.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Where Are My Compose Projects Stored?</h2>
	<p class="mb-8">
		Arcane saves your compose project definitions (compose files, <code
			class="bg-muted rounded px-1 py-0.5">.env</code
		>
		files, and metadata) in its data directory (by default
		<code class="bg-muted rounded px-1 py-0.5">/app/data/compose-projects</code>).<br />
		<strong>Tip:</strong> To keep your compose projects safe, make sure to mount this directory as a
		Docker volume if you’re running Arcane in a container.
	</p>
</ContentWrapper>
