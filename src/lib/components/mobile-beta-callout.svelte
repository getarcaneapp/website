<script lang="ts">
	import Apple from 'virtual:icons/simple-icons/apple';
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import { Button } from '$lib/components/ui/button/index.js';

	const TESTFLIGHT_URL = 'https://testflight.apple.com/join/Y9KUft8F';
</script>

<section class="relative pb-20">
	<div
		class="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-primary/3 via-background to-background p-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-8"
	>
		<div class="pointer-events-none absolute -inset-20 opacity-30" aria-hidden="true">
			<div
				class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_50%,oklch(0.6_0.26_292.717/0.15),transparent_70%)]"
			></div>
		</div>

		<div class="relative flex items-start gap-5">
			<div
				class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5"
			>
				<Apple class="size-6 text-primary" />
			</div>
			<div>
				<span
					class="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 font-mono text-xs font-medium text-primary"
				>
					TestFlight beta
				</span>
				<h2 class="text-lg font-semibold tracking-tight text-foreground">Arcane Mobile for iOS</h2>
				<p class="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
					Manage your Docker containers on the go. Native app for iPhone, iPad, and Mac — now
					accepting beta testers.
				</p>
				<div class="mt-5 flex items-center gap-4">
					<Button
						href={TESTFLIGHT_URL}
						target="_blank"
						rel="noopener noreferrer"
						variant="default"
						class="group"
					>
						Join the TestFlight beta
						<ArrowUpRight
							class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</Button>
					<span class="text-xs text-muted-foreground"
						>Requires iOS 18+ / iPadOS 18+ / macOS 26+</span
					>
				</div>
			</div>
		</div>
	</div>
</section>
