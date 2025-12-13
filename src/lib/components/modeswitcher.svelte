<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button
	onclick={toggleMode}
	variant="ghost"
	size="icon"
	class="relative overflow-hidden transition-all duration-300 hover:bg-yellow-500/10 dark:hover:bg-blue-500/10"
>
	<SunIcon
		class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-yellow-600 transition-all duration-300 dark:scale-0 dark:-rotate-90 dark:text-yellow-500"
	/>
	<MoonIcon
		class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 text-blue-500 transition-all duration-300 dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
