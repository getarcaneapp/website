<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts" module>
	import type { WithChildren, WithoutChildren } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-md text-sm font-medium whitespace-nowrap outline-hidden transition-colors duration-150 select-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-white',
				outline:
					'border border-border bg-background text-foreground hover:bg-muted hover:text-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				brand: 'bg-primary text-primary-foreground hover:bg-primary/90',
				flat: 'bg-card text-foreground border border-border hover:bg-muted'
			},
			size: {
				default: 'h-10 px-5 py-2.5 has-[>svg]:px-4',
				sm: 'h-9 gap-1.5 rounded-md px-4 has-[>svg]:px-3',
				lg: 'h-11 rounded-md px-7 text-base has-[>svg]:px-5',
				icon: 'size-10 rounded-md'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonPropsWithoutHTML = WithChildren<{
		ref?: HTMLElement | null;
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		onClickPromise?: (
			e: MouseEvent & {
				currentTarget: EventTarget & HTMLButtonElement;
			}
		) => Promise<void>;
	}>;

	export type AnchorElementProps = ButtonPropsWithoutHTML &
		WithoutChildren<Omit<HTMLAnchorAttributes, 'href' | 'type'>> & {
			href: HTMLAnchorAttributes['href'];
			type?: never;
			disabled?: HTMLButtonAttributes['disabled'];
		};

	export type ButtonElementProps = ButtonPropsWithoutHTML &
		WithoutChildren<Omit<HTMLButtonAttributes, 'type' | 'href'>> & {
			type?: HTMLButtonAttributes['type'];
			href?: never;
			disabled?: HTMLButtonAttributes['disabled'];
		};

	export type ButtonProps = AnchorElementProps | ButtonElementProps;
</script>

<script lang="ts">
	import { cn } from '$lib/utils/utils.js';
	import LoaderCircleIcon from 'virtual:icons/lucide/loader-circle';

	let {
		ref = $bindable(null),
		variant = 'default',
		size = 'default',
		href = undefined,
		type = 'button',
		loading = false,
		disabled = false,
		tabindex = 0,
		onclick,
		onClickPromise,
		class: className,
		children,
		...rest
	}: ButtonProps = $props();
</script>

<!-- This approach to disabled links is inspired by bits-ui see: https://github.com/huntabyte/bits-ui/pull/1055 -->
<svelte:element
	this={href ? 'a' : 'button'}
	{...rest}
	data-slot="button"
	type={href ? undefined : type}
	href={href && !disabled ? href : undefined}
	disabled={href ? undefined : disabled || loading}
	aria-disabled={href ? disabled : undefined}
	role={href && disabled ? 'link' : undefined}
	tabindex={href && disabled ? -1 : tabindex}
	class={cn(buttonVariants({ variant, size }), className)}
	bind:this={ref}
	onclick={async (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		e: any
	) => {
		onclick?.(e);

		if (type === undefined) return;

		if (onClickPromise) {
			loading = true;

			await onClickPromise(e);

			loading = false;
		}
	}}
>
	{#if type !== undefined && loading}
		<div class="absolute flex size-full place-items-center justify-center bg-inherit">
			<div class="flex animate-spin place-items-center justify-center">
				<LoaderCircleIcon class="size-4" />
			</div>
		</div>
		<span class="sr-only">Loading</span>
	{/if}
	{@render children?.()}
</svelte:element>
