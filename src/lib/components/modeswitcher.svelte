<script lang="ts">
	import { MoonIcon, SunIcon } from '#lib/icons/index.js';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<Button onclick={toggleMode} variant="ghost" size="icon" class="relative size-8 overflow-hidden">
	<SunIcon
		class="size-4 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90"
	/>
	<MoonIcon
		class="absolute size-4 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
