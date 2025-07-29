<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import X from '@lucide/svelte/icons/x';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import { browser } from '$app/environment';

	let dismissed = $state(false);

	// Check if banner was previously dismissed
	if (browser) {
		dismissed = localStorage.getItem('arcane-preview-banner-dismissed') === 'true';
	}

	function dismissBanner() {
		dismissed = true;
		if (browser) {
			localStorage.setItem('arcane-preview-banner-dismissed', 'true');
		}
	}
</script>

{#if !dismissed}
	<div class="relative bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white">
		<div class="container-wrapper px-6">
			<div class="flex items-center justify-center gap-3 py-2 text-sm">
				<Sparkles class="size-4 flex-shrink-0" />
				<span class="text-center">
					<strong>New:</strong> Try the Arcane 1.0 Public Preview
					<Button
						variant="ghost"
						size="sm"
						href="/docs/1-0-preview"
						class="text-white hover:bg-white/20 hover:text-white"
					>
						Learn More
					</Button>
				</span>
				<button
					onclick={dismissBanner}
					class="absolute top-1/2 right-4 -translate-y-1/2 rounded-xs p-1 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-hidden"
					aria-label="Dismiss banner"
				>
					<X class="size-4" />
				</button>
			</div>
		</div>
	</div>
{/if}
