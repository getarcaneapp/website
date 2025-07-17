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

	let {
		icon,
		title,
		description,
		fullWidth = false,
		class: className,
		...restProps
	}: Props = $props();

	const Icon = icon as typeof IconType;
</script>

<div
	class={cn(
		'group border-border/40 bg-card/50 relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 ease-out',
		'shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_25px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]',
		'hover:border-border/60 hover:bg-card/80 hover:translate-y-[-2px]',
		'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
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
