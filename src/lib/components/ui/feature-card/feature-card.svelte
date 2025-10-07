<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import type { Icon as IconType } from '@lucide/svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		icon: typeof IconType;
		title: string;
		description: string;
		fullWidth?: boolean;
	}

	let { icon, title, description, fullWidth = false, class: className, ...restProps }: Props = $props();

	const Icon = icon as typeof IconType;
</script>

<div
	class={cn(
		// Base layout
		'group relative overflow-hidden rounded-xl p-6 transition-all duration-400 ease-out',
		// Surface + blur + subtle translucent elevated layer (lighten by ~0.1 L in light, slightly brighter surface in dark)
		'bg-[oklch(1_0_0/0.78)] backdrop-blur supports-[backdrop-filter]:bg-[oklch(0.99_0_0/0.65)] dark:bg-[oklch(0.30_0.006_285.823/0.55)] dark:supports-[backdrop-filter]:bg-[oklch(0.26_0.006_285.823/0.5)]',
		// Border & ring layering
		'border-border/50 dark:border-border/40 border',
		// Elevation shadows (multi-layer) + hover elevation ramp
		'shadow-[0_0_0_1px_oklch(0.92_0_0/0.65),0_1px_2px_0_oklch(0.7_0_0/0.22),0_3px_6px_-1px_oklch(0.7_0_0/0.18)] dark:shadow-[0_0_0_1px_oklch(0.28_0.006_285.823/0.55),0_1.5px_2px_-1px_oklch(0.05_0_0/0.55),0_6px_14px_-4px_oklch(0.05_0_0/0.45)]',
		'hover:shadow-[0_0_0_1px_oklch(0.92_0_0/0.7),0_4px_8px_-1px_oklch(0.7_0_0/0.25),0_14px_28px_-6px_oklch(0.7_0_0/0.25)] dark:hover:shadow-[0_0_0_1px_oklch(0.30_0.006_285.823/0.6),0_4px_10px_-2px_oklch(0.05_0_0/0.55),0_18px_36px_-8px_oklch(0.05_0_0/0.45)]',
		// Subtle motion & lift
		'will-change-transform hover:translate-y-[-3px]',
		// Highlight gradients via pseudo elements
		'before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(145deg,oklch(1_0_0/0.12),transparent_55%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100',
		'after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_25%,oklch(1_0_0/0.09),transparent_60%)] after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100',
		// Full-width layout variant
		fullWidth && 'col-span-full sm:col-span-2 md:col-span-3',
		className
	)}
	{...restProps}
>
	<div class="relative z-10">
		<div
			class="from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br transition-all duration-300 group-hover:scale-110"
		>
			<Icon class="text-primary h-6 w-6" />
		</div>
		<h3 class="text-foreground mb-2 text-lg font-semibold transition-colors duration-300">
			{title}
		</h3>
		<p class="text-muted-foreground text-sm leading-relaxed">
			{description}
		</p>
	</div>
</div>
