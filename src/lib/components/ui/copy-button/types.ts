/*
	Installed from @ieedan/shadcn-svelte-extras
*/

import type { WithChildren, WithoutChildren } from 'bits-ui';
import type { ComponentProps } from 'svelte';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { Button } from '$lib/components/ui/button/index.js';
import type { UseClipboard } from '$lib/hooks/use-clipboard.svelte.js';

type ButtonProps = ComponentProps<typeof Button>;

export type CopyButtonPropsWithoutHTML = WithChildren<
	Pick<ButtonProps, 'size' | 'variant'> & {
		ref?: HTMLButtonElement | null;
		text: string;
		icon?: Snippet<[]>;
		animationDuration?: number;
		onCopy?: (status: UseClipboard['status']) => void;
	}
>;

export type CopyButtonProps = CopyButtonPropsWithoutHTML &
	WithoutChildren<HTMLAttributes<HTMLButtonElement>>;
