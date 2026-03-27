<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants';
  import { CopyButton } from '$lib/components/ui/copy-button/index.js';
  import type { UseClipboard } from '$lib/hooks/use-clipboard.svelte.js';
  import { cn } from '$lib/utils/utils.js';
  import type { SupportedLanguage } from '../code/shiki.js';

  const style = tv({
    base: 'bg-background relative w-full max-w-full rounded-md border py-2.5 pr-12 pl-3',
    variants: {
      variant: {
        default: 'border-border bg-card',
        secondary: 'border-border bg-accent',
        destructive: 'border-destructive bg-destructive',
        primary: 'border-primary bg-primary text-primary-foreground',
      },
    },
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

  let { text, variant = 'default', lang = 'bash', onCopy, class: className }: SnippetProps = $props();

  const code = $derived(typeof text === 'string' ? text : text.join('\n'));
</script>

<div class={cn('snippet', style({ variant, class: className }))}>
  <Code.Root
    class="w-full max-w-none h-auto! overflow-visible! rounded-none! border-0! bg-transparent! p-0!"
    {code}
    hideLines
    {lang} />

  <CopyButton
    class="hover:text-opacity-80 absolute top-1/2 right-2 size-7 -translate-y-1/2 transition-opacity ease-in-out hover:bg-transparent dark:hover:bg-transparent"
    text={code}
    {onCopy}
    variant="ghost"
    size="sm" />
</div>

<style>
  .snippet :global(pre.shiki) {
    margin: 0;
    overflow-x: auto;
    background-color: transparent;
    padding-top: 0;
    padding-bottom: 0;
  }

  .snippet :global(pre.shiki code) {
    display: grid;
    min-width: 100%;
    border-radius: 0;
    border-width: 0;
    background-color: transparent;
    padding: 0;
    overflow-wrap: break-word;
    box-decoration-break: clone;
  }

  .snippet :global(pre .line) {
    display: inline-block;
    min-height: 1rem;
    width: 100%;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
  }

  .snippet :global(pre .line.line--highlighted) {
    background-color: var(--secondary);
  }

  .snippet :global(pre .line.line--highlighted span) {
    position: relative;
  }
</style>
