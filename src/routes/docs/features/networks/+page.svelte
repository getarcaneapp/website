<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Network Management</h1>

	<h2 class="mb-3 text-2xl font-semibold">What Can You Do With Networks in Arcane?</h2>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>View Networks:</strong> See a list of all Docker networks on your system, including their
			names, drivers, and subnets.
		</li>
		<li>
			<strong>Create Networks:</strong> Add a new network by choosing a name, driver, and optional settings
			like subnet or gateway.
		</li>
		<li>
			<strong>Inspect Networks:</strong> Click on a network to see details, including connected containers
			and configuration.
		</li>
		<li>
			<strong>Remove Networks:</strong> Delete networks you no longer need. Arcane will warn you if a
			network is in use or is a default Docker network.
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">How to Use</h2>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Viewing Networks</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Go to the <strong>Networks</strong> section in the sidebar.</li>
		<li>You’ll see a table listing all your Docker networks.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Creating a Network</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click the <strong>Create Network</strong> button.</li>
		<li>Enter a name for your network.</li>
		<li>
			(Optional) Choose a driver (like <code class="bg-muted rounded px-1 py-0.5">bridge</code> or
			<code class="bg-muted rounded px-1 py-0.5">overlay</code>) and set advanced options if needed.
		</li>
		<li>Click <strong>Create</strong>. Your new network will appear in the list.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Inspecting a Network</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click on a network’s name in the list.</li>
		<li>
			You’ll see details like its ID, driver, subnet, gateway, and which containers are connected.
		</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Removing a Network</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>In the networks list, find the network you want to remove.</li>
		<li>Click the dropdown, then the <strong>Delete</strong> button (trash icon).</li>
		<li>
			Confirm the deletion in the dialog.<br />
			<span class="text-muted-foreground mt-2 block text-sm">
				<strong>Note:</strong> You cannot remove a network that is currently used by containers or
				is a default Docker network (like <code class="bg-muted rounded px-1 py-0.5">bridge</code>,
				<code class="bg-muted rounded px-1 py-0.5">host</code>, or
				<code class="bg-muted rounded px-1 py-0.5">none</code>).
			</span>
		</li>
	</ol>

	<hr class="my-8 opacity-30" />

	<p class="mb-8">
		For more advanced networking, see the
		<a
			href="https://docs.docker.com/network/"
			target="_blank"
			rel="noopener"
			class="text-primary underline">official Docker documentation</a
		>.
	</p>
</ContentWrapper>
