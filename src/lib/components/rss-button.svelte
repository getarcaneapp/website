<script lang="ts">
	import Rss from 'virtual:icons/lucide/rss';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<Button href="/rss.xml" variant="brand" size="sm" data-sveltekit-reload>
	<Rss class="size-3.5" />
	RSS
</Button>
