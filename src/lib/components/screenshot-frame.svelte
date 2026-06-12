<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	type ScreenshotFrameProps = HTMLImgAttributes & {
		caption?: string;
		containerClass?: string;
		frameClass?: string;
	};

	let {
		caption,
		containerClass,
		frameClass,
		class: className,
		src,
		alt,
		...restProps
	}: ScreenshotFrameProps = $props();

	let dialogAlt = $derived(alt ?? caption ?? 'Screenshot');
</script>

<Dialog.Root>
	<figure class={cn('my-8', containerClass)}>
		<Dialog.Trigger
			type="button"
			class="group block w-full cursor-zoom-in text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
			aria-label={`Open ${dialogAlt} in a larger view`}
		>
			<span
				class={cn(
					'block overflow-hidden rounded-lg border border-border bg-surface p-2',
					frameClass
				)}
			>
				<img
					{...restProps}
					{src}
					{alt}
					class={cn('w-full rounded-md border border-border', className)}
				/>
			</span>
		</Dialog.Trigger>

		{#if caption}
			<figcaption class="mt-3 text-center text-sm text-muted-foreground">
				{caption}
			</figcaption>
		{/if}
	</figure>

	<Dialog.Content
		class="top-0 left-0 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center border-0 bg-transparent p-2 shadow-none sm:max-w-none"
	>
		<Dialog.Header class="sr-only">
			<Dialog.Title>{dialogAlt}</Dialog.Title>
			{#if caption}
				<Dialog.Description>{caption}</Dialog.Description>
			{/if}
		</Dialog.Header>

		<div class="flex h-full w-full flex-col items-center justify-center gap-3 sm:gap-4">
			<div class="h-full max-h-[90vh] w-full max-w-[96vw]">
				<img {src} {alt} class="h-full w-full rounded-[24px] object-contain shadow-2xl" />
			</div>

			{#if caption}
				<p class="text-center text-sm text-muted-foreground">
					{caption}
				</p>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
