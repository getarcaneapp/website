<script lang="ts">
	import Apple from 'virtual:icons/simple-icons/apple';
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import FlaskConical from 'virtual:icons/lucide/flask-conical';
	import Monitor from 'virtual:icons/lucide/monitor';
	import Smartphone from 'virtual:icons/lucide/smartphone';
	import Tablet from 'virtual:icons/lucide/tablet';
	import { Button } from '$lib/components/ui/button/index.js';

	const TESTFLIGHT_URL = 'https://testflight.apple.com/join/Y9KUft8F';

	const requirements = [
		{ icon: Smartphone, label: 'iPhone', detail: 'iOS 26 or later' },
		{ icon: Tablet, label: 'iPad', detail: 'iPadOS 26 or later' },
		{ icon: Monitor, label: 'Mac', detail: 'macOS 26 or later' }
	];
</script>

<section class="relative mb-20">
	<div
		class="relative overflow-hidden rounded-[2.5rem] border border-purple-500/20 bg-background/70 px-6 py-10 shadow-[0_24px_60px_-55px_oklch(0_0_0/0.5)] backdrop-blur-xl md:px-12 md:py-12"
	>
		<!-- Decorative ambient glow -->
		<div
			class="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-purple-500/15 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full bg-violet-500/10 blur-3xl"
			aria-hidden="true"
		></div>

		<div class="relative flex flex-col items-start">
			<span
				class="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-purple-700 uppercase dark:text-purple-300"
			>
				<FlaskConical class="size-3.5" />
				Now in TestFlight beta
			</span>

			<div class="mt-5 flex items-center gap-4">
				<div
					class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500/15 via-violet-500/10 to-purple-600/5 ring-1 ring-purple-500/20"
				>
					<Apple class="size-7 text-purple-600 dark:text-purple-400" />
				</div>
				<div class="space-y-1">
					<h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						Arcane Mobile for iOS
					</h2>
					<p class="text-sm font-medium text-muted-foreground">
						iPhone · iPad · Mac — now accepting beta testers
					</p>
				</div>
			</div>

			<p class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
				Manage your Docker containers on the go. Be among the first to try the native Arcane app for
				iPhone, iPad, and Mac — and help shape it before the public release.
			</p>

			<div class="mt-6 flex flex-wrap gap-2.5">
				{#each requirements as req (req.label)}
					{@const Icon = req.icon}
					<div
						class="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/70 px-3 py-2 backdrop-blur-sm"
					>
						<Icon class="size-4 shrink-0 text-purple-600 dark:text-purple-400" />
						<span class="flex flex-col leading-tight">
							<span class="text-sm font-semibold text-foreground">{req.label}</span>
							<span class="text-xs text-muted-foreground">{req.detail}</span>
						</span>
					</div>
				{/each}
			</div>

			<div class="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
				<Button
					href={TESTFLIGHT_URL}
					target="_blank"
					rel="noopener noreferrer"
					size="lg"
					class="group bg-linear-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600/90 hover:to-violet-600/90 hover:shadow-xl hover:shadow-purple-500/35"
				>
					<Apple class="size-4" />
					Join the TestFlight beta
					<ArrowUpRight
						class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</Button>
				<span class="text-xs text-muted-foreground">
					Requires Apple's TestFlight app · Free to join
				</span>
			</div>
		</div>
	</div>
</section>
