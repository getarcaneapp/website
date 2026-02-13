<script lang="ts">
	import type { Icon as IconType } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		icon: typeof IconType;
		title: string;
		description: string;
		fullWidth?: boolean;
	}

	let { icon, title, description, fullWidth = false, class: className, ...restProps }: Props = $props();

	const Icon = $derived(icon as typeof IconType);
</script>

<div
	class={cn(
		// Base layout
		'group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl p-6 transition-all duration-500 ease-out',
		// Glassmorphism surface
		'bg-white/70 backdrop-blur-xl dark:bg-[oklch(0.18_0.006_285.823/0.6)]',
		// Border with gradient effect on hover
		'border border-[oklch(0.92_0_0/0.8)] dark:border-[oklch(1_0_0/0.08)]',
		// Multi-layer shadow for depth
		'shadow-[0_1px_2px_oklch(0_0_0/0.05),0_4px_12px_-2px_oklch(0_0_0/0.08),0_12px_24px_-4px_oklch(0_0_0/0.06)]',
		'dark:shadow-[0_1px_2px_oklch(0_0_0/0.2),0_8px_20px_-4px_oklch(0_0_0/0.35),0_20px_40px_-8px_oklch(0_0_0/0.25)]',
		// Hover elevation and glow
		'hover:shadow-[0_4px_12px_oklch(0.606_0.25_292.717/0.1),0_16px_32px_-4px_oklch(0.606_0.25_292.717/0.15),0_24px_48px_-8px_oklch(0_0_0/0.08)]',
		'dark:hover:shadow-[0_4px_16px_oklch(0.606_0.25_292.717/0.15),0_20px_40px_-4px_oklch(0.606_0.25_292.717/0.2),0_32px_64px_-8px_oklch(0_0_0/0.3)]',
		// Subtle lift on hover
		'hover:-translate-y-1.5',
		// Animated border gradient (pseudo element)
		'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:p-px',
		'before:bg-[linear-gradient(135deg,oklch(0.606_0.25_292.717/0),oklch(0.606_0.25_292.717/0),oklch(0.7_0.2_300/0))]',
		'before:opacity-0 before:transition-opacity before:duration-500',
		'hover:before:bg-[linear-gradient(135deg,oklch(0.606_0.25_292.717/0.4),oklch(0.7_0.2_300/0.3),oklch(0.606_0.25_292.717/0.2))]',
		'hover:before:opacity-100',
		// Shine overlay effect
		'after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(115deg,transparent_30%,oklch(1_0_0/0.08)_50%,transparent_70%)]',
		'after:-translate-x-full after:transition-transform after:duration-700',
		'hover:after:translate-x-full',
		// Full-width layout variant
		fullWidth && 'col-span-full sm:col-span-2 lg:col-span-3',
		className
	)}
	{...restProps}
>
	<div class="relative z-10">
		<div
			class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500/15 via-violet-500/10 to-purple-600/5 ring-1 ring-purple-500/20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_oklch(0.606_0.25_292.717/0.25)] group-hover:ring-purple-500/40"
		>
			<Icon
				class="h-6 w-6 text-purple-600 transition-transform duration-300 group-hover:scale-110 dark:text-purple-400"
			/>
		</div>
		<h3
			class="text-foreground mb-2 text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400"
		>
			{title}
		</h3>
		<p class="text-muted-foreground text-sm leading-relaxed">
			{description}
		</p>
	</div>
</div>
