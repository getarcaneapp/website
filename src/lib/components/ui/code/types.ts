/*
	Installed from @ieedan/shadcn-svelte-extras
*/

import type { WithChildren, WithoutChildren } from 'bits-ui';
import type { HTMLAttributes } from 'svelte/elements';
import { tv, type VariantProps } from 'tailwind-variants';
import type { CopyButtonPropsWithoutHTML } from '$lib/components/ui/copy-button/types.js';
import type { SupportedLanguage } from './shiki.js';

export const codeVariants = tv({
	base: 'not-prose relative h-full overflow-auto rounded-lg border',
	variants: {
		variant: {
			default: 'border-border bg-code',
			secondary: 'bg-secondary/50 border-transparent'
		}
	}
});

export type CodeVariant = VariantProps<typeof codeVariants>['variant'];

export type CodeRootPropsWithoutHTML = WithChildren<{
	ref?: HTMLDivElement | null;
	variant?: CodeVariant;
	lang?: SupportedLanguage;
	code: string;
	class?: string;
	hideLines?: boolean;
	highlight?: (number | [number, number])[];
}>;

export type CodeRootProps = CodeRootPropsWithoutHTML &
	WithoutChildren<HTMLAttributes<HTMLDivElement>>;

export type CodeCopyButtonPropsWithoutHTML = Omit<CopyButtonPropsWithoutHTML, 'text'>;

export type CodeCopyButtonProps = CodeCopyButtonPropsWithoutHTML &
	WithoutChildren<HTMLAttributes<HTMLButtonElement>>;

export type CodeOverflowPropsWithoutHTML = WithChildren<{
	collapsed?: boolean;
}>;

export type CodeOverflowProps = CodeOverflowPropsWithoutHTML &
	WithoutChildren<HTMLAttributes<HTMLDivElement>>;
