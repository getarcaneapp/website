<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
import type { HTMLAnchorAttributes } from 'svelte/elements';
import { cn } from '$lib/utils/utils';

let { children, class: className, ...rest }: HTMLAnchorAttributes = $props();
</script>

<a {...rest} class={cn('text-foreground font-medium underline underline-offset-4', className)}>
	{@render children?.()}
</a>
