<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="bg-background text-foreground flex max-w-[100vw] flex-col">
	<div class="flex min-h-screen w-full justify-center">
		<main class="flex w-full justify-center">
			<div class="w-full px-4 py-4 sm:max-w-4xl sm:px-6 sm:py-8 md:max-w-5xl md:px-8 lg:max-w-7xl xl:max-w-[1600px]">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
