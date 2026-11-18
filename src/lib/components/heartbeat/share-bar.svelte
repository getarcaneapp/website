<script lang="ts">
import { cn } from '#lib/utils.js';
import type { ShareSegment } from './stats';

let {
	segments,
	label,
	class: className
}: { segments: ShareSegment[]; label: string; class?: string } = $props();

const sum = $derived(
	Math.max(
		1,
		segments.reduce((total, s) => total + s.count, 0)
	)
);
</script>

<div
	class={cn('flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-muted', className)}
	role="img"
	aria-label={label}
>
	{#each segments as segment (segment.key)}
		<span
			class="h-full shrink-0"
			style:width={`${(segment.count / sum) * 100}%`}
			style:background={segment.color}
		></span>
	{/each}
</div>
