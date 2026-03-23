/*
	Installed from @ieedan/shadcn-svelte-extras
*/

import type { ComponentProps } from 'svelte';
import Root from './button.svelte';

type ButtonProps = ComponentProps<typeof Root>;
type AnchorElementProps = Extract<ButtonProps, { href: string }>;
type ButtonElementProps = Exclude<ButtonProps, AnchorElementProps>;
type ButtonVariant = ButtonProps['variant'];
type ButtonSize = ButtonProps['size'];
type ButtonPropsWithoutHTML = Pick<
	ButtonProps,
	'ref' | 'variant' | 'size' | 'loading' | 'onClickPromise' | 'children'
>;

export {
	Root,
	type ButtonProps as Props,
	//
	Root as Button,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	type AnchorElementProps,
	type ButtonElementProps,
	type ButtonPropsWithoutHTML
};
