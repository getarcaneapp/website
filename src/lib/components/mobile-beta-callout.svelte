<script lang="ts">
	import { AppleBrandIcon, ArrowRightIcon } from '#lib/icons/index.js';
	import { trackEvent } from '#lib/analytics.js';
	import { cn } from '#lib/utils.js';

	let { class: className }: { class?: string } = $props();

	const TESTFLIGHT_URL = 'https://testflight.apple.com/join/Y9KUft8F';
</script>

<a
	href={TESTFLIGHT_URL}
	target="_blank"
	rel="noopener noreferrer"
	title="Requires iOS 18+ / iPadOS 18+ / macOS 26+"
	onclick={() => trackEvent('CTA Clicked', { cta: 'testflight', placement: 'home_hero' })}
	class={cn(
		'group inline-flex max-w-full items-center gap-2.5 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-sm text-foreground/90 shadow-sm shadow-primary/10 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/12 hover:text-foreground',
		className
	)}
>
	<AppleBrandIcon class="size-3.5 shrink-0 text-foreground" aria-hidden="true" />
	<span class="truncate">Arcane for iOS</span>
	<span class="h-3.5 w-px shrink-0 bg-primary/30" aria-hidden="true"></span>
	<span class="inline-flex shrink-0 items-center gap-0.5 font-medium text-primary">
		Join the beta
		<ArrowRightIcon
			class="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
			aria-hidden="true"
		/>
	</span>
</a>
