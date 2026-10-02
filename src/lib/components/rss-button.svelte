<script lang="ts">
	import { RssIcon } from '#lib/icons/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<Button href="/rss.xml" variant="brand" size="sm" data-sveltekit-reload>
	<RssIcon class="size-3.5" />
	RSS
</Button>
