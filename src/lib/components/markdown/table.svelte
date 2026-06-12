<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLTableElement> = $props();
</script>

<div class="my-6 w-full overflow-y-auto rounded-md border border-border">
	<table class={cn('relative w-full border-none text-sm', className)} {...restProps}>
		{@render children?.()}
	</table>
</div>
