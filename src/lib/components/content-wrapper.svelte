<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="relative flex max-w-[100vw] flex-col text-foreground">
	<main class="flex min-h-screen w-full justify-center">
		<div class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:py-10 lg:px-6">
			{@render children?.()}
		</div>
	</main>
</div>
