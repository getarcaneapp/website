<script lang="ts" module>
import { tv, type VariantProps } from 'tailwind-variants';

export const badgeVariants = tv({
	base: 'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
	variants: {
		variant: {
			default: 'border-transparent bg-button text-button-foreground [a&]:hover:bg-button-hover',
			secondary:
				'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
			destructive:
				'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/70 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
			outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
			muted:
				'border-border text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
		},
		size: {
			sm: 'text-2xs',
			default: ''
		},
		shape: {
			default: '',
			pill: 'rounded-full px-2.5'
		},
		mono: {
			true: 'font-mono',
			false: ''
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
		shape: 'default',
		mono: false
	}
});

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
export type BadgeSize = VariantProps<typeof badgeVariants>['size'];
export type BadgeShape = VariantProps<typeof badgeVariants>['shape'];
</script>

<script lang="ts">
import type { HTMLAnchorAttributes } from 'svelte/elements';
import { cn, type WithElementRef } from '#lib/utils.js';

let {
	ref = $bindable(null),
	href,
	class: className,
	variant = 'default',
	size = 'default',
	shape = 'default',
	mono = false,
	children,
	...restProps
}: WithElementRef<HTMLAnchorAttributes> & {
	variant?: BadgeVariant;
	size?: BadgeSize;
	shape?: BadgeShape;
	/** Monospace text for code-like values. */
	mono?: boolean;
} = $props();
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant, size, shape, mono }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
