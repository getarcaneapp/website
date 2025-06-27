<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Image Management</h1>

	<h2 class="mb-3 text-2xl font-semibold">What Can You Do With Images in Arcane?</h2>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>View Images:</strong> See a list of all Docker images on your system, including their tags,
			size, and when they were created.
		</li>
		<li>
			<strong>Pull Images:</strong> Download new images from Docker Hub or another registry by
			entering the image name and tag (like
			<code class="bg-muted rounded px-1 py-0.5">nginx:latest</code>).
		</li>
		<li>
			<strong>Inspect Images:</strong> Click on an image to see more details, such as its ID, tags, creation
			date, and configuration.
		</li>
		<li>
			<strong>Remove Images:</strong> Delete images you no longer need. Arcane will warn you if an image
			is in use by a container.
		</li>
		<li>
			<strong>Prune Images:</strong> Clean up unused images to free up disk space. You can remove dangling
			images (those without tags) or all images not used by any container.
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">How to Use</h2>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Viewing Images</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Go to the <strong>Images</strong> section in the sidebar.</li>
		<li>
			You’ll see a table listing all your Docker images with their tags, size, and creation date.
		</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Pulling a New Image</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Click the <strong>Pull Image</strong> button.</li>
		<li>
			Enter the image name and tag (for example, <code class="bg-muted rounded px-1 py-0.5"
				>redis:latest</code
			>).
		</li>
		<li>Click <strong>Pull</strong>. The image will be downloaded and added to your list.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Inspecting an Image</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>Find the image you want to inspect in the list.</li>
		<li>Click on its name, ID, or the <strong>Inspect</strong> button to see more details.</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Removing an Image</h3>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>In the images list, find the image you want to remove.</li>
		<li>Click the <strong>Remove</strong> button (trash icon) next to it.</li>
		<li>
			Confirm the deletion in the dialog.<br />
			<span class="text-muted-foreground mt-2 block text-sm">
				<strong>Note:</strong> You cannot remove images that are currently used by running containers.
			</span>
		</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Pruning Images</h3>
	<ol class="mb-8 list-decimal space-y-2 pl-6">
		<li>Click the <strong>Prune Images</strong> button.</li>
		<li>Choose whether to remove only dangling images or all unused images.</li>
		<li>Confirm the action to free up disk space.</li>
	</ol>
</ContentWrapper>
