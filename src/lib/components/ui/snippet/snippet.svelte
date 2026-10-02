<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';
	import { CopyButton } from '#lib/components/ui/copy-button/index.js';
	import type { UseClipboard } from '#lib/hooks/use-clipboard.svelte.js';
	import { cn } from '#lib/utils.js';
	import type { SupportedLanguage } from '../code/shiki.js';

	const style = tv({
		base: 'bg-background relative w-full max-w-full rounded-xl border py-2.5 pr-12 pl-3',
		variants: {
			variant: {
				default: 'border-border bg-card',
				secondary: 'border-border bg-accent',
				destructive: 'border-destructive bg-destructive',
				primary: 'border-primary bg-primary text-primary-foreground'
			}
		}
	});

	type Variant = VariantProps<typeof style>['variant'];

	export type SnippetProps = {
		variant?: Variant;
		text: string | string[];
		lang?: SupportedLanguage;
		class?: string;
		onCopy?: (status: UseClipboard['status']) => void;
	};
</script>

<script lang="ts">
	import * as Code from '../code/index.js';

	let {
		text,
		variant = 'default',
		lang = 'bash',
		onCopy,
		class: className
	}: SnippetProps = $props();

	const code = $derived(typeof text === 'string' ? text : text.join('\n'));
</script>

<div class={cn('snippet', style({ variant, class: className }))}>
	<Code.Root
		class="h-auto! w-full max-w-none overflow-visible! rounded-none! border-0! bg-transparent! p-0!"
		{code}
		hideLines
		{lang}
	/>

	<CopyButton
		class="absolute top-1/2 right-2 size-7 -translate-y-1/2 transition-opacity ease-in-out hover:bg-transparent dark:hover:bg-transparent"
		text={code}
		{onCopy}
		variant="ghost"
		size="sm"
	/>
</div>
