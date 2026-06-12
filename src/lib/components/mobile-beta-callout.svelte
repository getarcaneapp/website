<script lang="ts">
	import Apple from 'virtual:icons/simple-icons/apple';
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import { Button } from '$lib/components/ui/button/index.js';

	const TESTFLIGHT_URL = 'https://testflight.apple.com/join/Y9KUft8F';
</script>

<section class="relative mb-20">
	<div
		class="flex flex-col gap-6 rounded-lg border border-border p-6 md:flex-row md:items-center md:justify-between md:px-8"
	>
		<div class="flex items-start gap-4">
			<Apple class="mt-1 size-5 shrink-0 text-muted-foreground" />
			<div>
				<span
					class="mb-2 inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
				>
					TestFlight beta
				</span>
				<h2 class="text-lg font-semibold tracking-tight text-foreground">Arcane Mobile for iOS</h2>
				<p class="mt-1 max-w-xl text-sm text-muted-foreground">
					Manage your Docker containers on the go. Native app for iPhone, iPad, and Mac — now
					accepting beta testers.
				</p>
			</div>
		</div>

		<div class="flex shrink-0 flex-col items-start gap-2 md:items-center">
			<Button
				href={TESTFLIGHT_URL}
				target="_blank"
				rel="noopener noreferrer"
				variant="outline"
				class="group"
			>
				Join the TestFlight beta
				<ArrowUpRight
					class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</Button>
			<span class="text-xs text-muted-foreground">Requires iOS 18+ / iPadOS 18+ / macOS 26+</span>
		</div>
	</div>
</section>
