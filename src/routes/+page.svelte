<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Introduction to Arcane</h1>

	<p class="text-muted-foreground mb-4">Welcome to the documentation for Arcane!</p>

	<p class="mb-4">
		Arcane is a <strong>Simple and Elegant Docker Management UI</strong> written in SvelteKit and GoLang.
		It aims to provide an intuitive interface for managing your Docker containers, images, volumes, and
		networks.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Key Features</h2>

	<ul class="mb-6 list-disc space-y-2 pl-6">
		<li>
			<strong>Modern UI Interface</strong> - Clean, intuitive design that makes Docker management a breeze
		</li>
		<li>
			<strong>Real-time Monitoring</strong> - Live updates of container status, resource usage, and logs
		</li>
		<li>
			<strong>Container Management</strong> - Start, stop, restart, and inspect containers with ease
		</li>
		<li><strong>Image Management</strong> - Pull, and manage Docker images</li>
		<li><strong>Network Configuration</strong> - Create and configure Docker networks</li>
		<li>
			<strong>Volume Management</strong> - Create and manage persistent data with Docker volumes
		</li>
		<li>
			<strong>Resource Visualization</strong> - Visual graphs for CPU, memory, and network usage
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">Getting Started</h2>

	<p class="mb-6">
		To get started with Arcane, head over to the
		<a href="/docs/setup" class="text-primary font-semibold underline">Installation</a> guide.
	</p>

	<!-- Pro Tip Callout -->
	<div class="mt-8 flex items-center rounded-lg border border-purple-300 bg-purple-100/10 p-4">
		<div class="text-primary mr-4 text-xl">💡</div>
		<div>
			<strong class="font-semibold">Pro Tip:</strong> Arcane works best with Docker version 20.10.0
			or higher. Check your version with
			<code
				class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
				>docker --version</code
			>.
		</div>
	</div>

	<!-- Moved the note to the bottom -->
	<p class="text-muted-foreground mt-8 italic">
		I loved the style of the shadcn-svelte docs so much, I wanted to use a similar look and feel for
		this project's documentation.
	</p>
</ContentWrapper>
