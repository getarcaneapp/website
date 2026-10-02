<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="relative flex max-w-screen flex-col text-foreground">
	<main class="flex min-h-screen w-full justify-center">
		<div class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:py-10 lg:px-6">
			{@render children?.()}
		</div>
	</main>
</div>
