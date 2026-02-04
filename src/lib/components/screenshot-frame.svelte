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
			class="group focus-visible:ring-ring block w-full cursor-zoom-in text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
			aria-label={`Open ${dialogAlt} in a larger view`}
		>
			<span
				class={cn(
					'block rounded-[28px] bg-linear-to-br from-purple-500/30 via-violet-500/10 to-fuchsia-500/30 p-[1.5px] shadow-[0_30px_80px_-50px_rgba(124,58,237,0.55)]',
					frameClass
				)}
			>
				<span class="bg-background/80 ring-border/70 block rounded-[26px] p-2 ring-1 backdrop-blur">
					<img
						{...restProps}
						{src}
						{alt}
						class={cn(
							'border-border/60 w-full rounded-[20px] border shadow-lg transition-transform duration-500 group-hover:scale-[1.01]',
							className
						)}
					/>
				</span>
			</span>
		</Dialog.Trigger>

		{#if caption}
			<figcaption class="text-muted-foreground mt-3 text-center text-sm">
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
				<p class="text-muted-foreground text-center text-sm">
					{caption}
				</p>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
