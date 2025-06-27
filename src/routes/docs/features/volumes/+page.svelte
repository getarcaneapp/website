<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Volume Management</h1>

	<h2 class="mb-3 text-2xl font-semibold">What Can You Do With Volumes in Arcane?</h2>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>View Volumes:</strong> See a list of all Docker volumes on your system, along with details
			like name, driver, and usage.
		</li>
		<li>
			<strong>Create Volumes:</strong> Add a new volume by providing a name and (optionally) driver or
			labels.
		</li>
		<li>
			<strong>Remove Volumes:</strong> Delete volumes you no longer need. Arcane will warn you if a volume
			is currently in use by a container.
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">How to Use</h2>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Viewing Volumes</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Go to the <strong>Volumes</strong> section in the sidebar.</li>
		<li>You’ll see a table listing all your Docker volumes.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Creating a Volume</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click the <strong>Create Volume</strong> button.</li>
		<li>Enter a name for your new volume.</li>
		<li>(Optional) Choose a driver or add labels if needed.</li>
		<li>Click <strong>Create</strong>. Your new volume will appear in the list.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Removing a Volume</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>In the volumes list, find the volume you want to remove.</li>
		<li>Click the dropdown then the <strong>Delete</strong> button (trash icon) in the list.</li>
		<li>
			Confirm the deletion in the dialog.<br />
			<span class="text-muted-foreground mt-2 block text-sm">
				<strong>Note:</strong> You cannot remove a volume that is currently used by a container.
			</span>
		</li>
	</ol>
</ContentWrapper>
