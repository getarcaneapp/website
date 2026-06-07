<script lang="ts">
	import Apple from 'virtual:icons/simple-icons/apple';
	import ArrowUpRight from 'virtual:icons/lucide/arrow-up-right';
	import FlaskConical from 'virtual:icons/lucide/flask-conical';
	import { Button } from '$lib/components/ui/button/index.js';

	const TESTFLIGHT_URL = 'https://testflight.apple.com/join/Y9KUft8F';
</script>

<section class="relative mb-20">
	<div
		class="flex flex-col gap-6 rounded-[2rem] border border-border/60 bg-background/70 px-6 py-8 shadow-[0_24px_60px_-55px_oklch(0_0_0/0.5)] backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-10"
	>
		<div class="flex items-start gap-4">
			<div
				class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
			>
				<Apple class="size-6" />
			</div>
			<div>
				<span
					class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium tracking-[0.12em] text-primary uppercase"
				>
					<FlaskConical class="size-3" />
					TestFlight beta
				</span>
				<h2 class="text-2xl font-bold tracking-tight text-foreground">Arcane Mobile for iOS</h2>
				<p class="mt-1 max-w-xl text-sm text-muted-foreground">
					Manage your Docker containers on the go. Native app for iPhone, iPad, and Mac — now
					accepting beta testers.
				</p>
			</div>
		</div>

		<div class="flex shrink-0 flex-col items-center gap-2">
			<Button href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer" size="lg" class="group">
				Join the TestFlight beta
				<ArrowUpRight
					class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</Button>
			<span class="text-center text-xs text-muted-foreground"
				>Requires iOS / iPadOS / macOS 26+ · Free</span
			>
		</div>
	</div>
</section>
