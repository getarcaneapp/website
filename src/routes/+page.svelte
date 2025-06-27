<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { BookOpenIcon } from '@lucide/svelte';
</script>

<ContentWrapper>
	<section class="mt-12 mb-12 flex flex-col items-center text-center">
		<h1 class="mb-2 flex items-end gap-0 text-6xl font-black tracking-tight">
			<span
				class="ml-[-0.18em] bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text align-bottom text-transparent drop-shadow-[0_2px_16px_rgba(109,40,217,0.5)]"
			>
				Arcane
			</span>
		</h1>
		<p class="text-muted-foreground mx-auto mt-2 mb-8 max-w-2xl text-2xl font-light">
			Modern Docker Management, <span class="text-primary font-medium">Designed for Everyone.</span>
		</p>
		<Button variant="default" size="lg" href="/docs/intro">
			<BookOpenIcon />
			Get Started
		</Button>
	</section>

	<section class="mb-12">
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			<div
				class="bg-card border-border rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg"
			>
				<span class="mb-2 block text-2xl">✨</span>
				<strong>Modern UI Interface</strong>
				<p class="text-muted-foreground mt-2 text-sm">
					Clean, intuitive design that makes Docker management a breeze.
				</p>
			</div>
			<div
				class="bg-card border-border rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg"
			>
				<span class="mb-2 block text-2xl">⏱️</span>
				<strong>Real-time Monitoring</strong>
				<p class="text-muted-foreground mt-2 text-sm">
					Live updates of container status, resource usage, and logs.
				</p>
			</div>
			<div
				class="bg-card border-border rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg"
			>
				<span class="mb-2 block text-2xl">🛠️</span>
				<strong>Container Management</strong>
				<p class="text-muted-foreground mt-2 text-sm">
					Start, stop, restart, and inspect containers with ease.
				</p>
			</div>
			<div
				class="bg-card border-border rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg"
			>
				<span class="mb-2 block text-2xl">📦</span>
				<strong>Image Management</strong>
				<p class="text-muted-foreground mt-2 text-sm">Pull, and manage Docker images.</p>
			</div>
			<div
				class="bg-card border-border rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg"
			>
				<span class="mb-2 block text-2xl">🌐</span>
				<strong>Network Configuration</strong>
				<p class="text-muted-foreground mt-2 text-sm">Create and configure Docker networks.</p>
			</div>
			<div
				class="bg-card border-border rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg"
			>
				<span class="mb-2 block text-2xl">💾</span>
				<strong>Volume Management</strong>
				<p class="text-muted-foreground mt-2 text-sm">
					Create and manage persistent data with Docker volumes.
				</p>
			</div>
			<div
				class="bg-card border-border col-span-full rounded-lg border p-6 shadow transition hover:scale-105 hover:shadow-lg sm:col-span-2 md:col-span-3"
			>
				<span class="mb-2 block text-2xl">📊</span>
				<strong>Resource Visualization</strong>
				<p class="text-muted-foreground mt-2 text-sm">
					Visual graphs for CPU, memory, and network usage.
				</p>
			</div>
		</div>
	</section>

	<div
		class="mx-auto mt-8 flex max-w-2xl items-center rounded-lg border border-purple-300 bg-purple-100/10 p-4"
	>
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

	<p class="text-muted-foreground mt-8 text-center italic">
		I loved the style of the shadcn-svelte docs so much, I wanted to use a similar look and feel for
		this project's documentation.
	</p>
</ContentWrapper>
