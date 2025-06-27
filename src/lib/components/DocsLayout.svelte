<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="bg-background text-foreground flex min-h-screen flex-col">
	<div class="flex flex-1">
		<!-- Main Content -->
		<main class="flex flex-1 justify-center">
			<div class="w-full max-w-5xl p-8">
				{@render children?.()}
			</div>
			<!-- Right Sidebar -->
			<!-- <aside class="hidden w-64 space-y-6 p-6 xl:block">
				<div class="bg-card rounded-lg p-4">
					<div class="mb-1 font-semibold">Special sponsor</div>
					<p class="text-muted-foreground mb-2 text-xs">
						We're looking for one partner to be featured here.<br />Support the project and reach
						thousands of developers.
					</p>
					<button class="bg-primary text-primary-foreground rounded px-3 py-1 text-xs font-medium"
						>Reach out</button
					>
				</div>
			</aside> -->
		</main>
	</div>
</div>
