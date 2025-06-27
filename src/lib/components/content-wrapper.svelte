<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="bg-background text-foreground flex flex-col">
	<div class="flex flex-1">
		<!-- Main Content -->
		<main class="flex flex-1 justify-center">
			<div class="w-full max-w-6xl p-8">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
