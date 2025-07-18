<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import InfoIcon from '@lucide/svelte/icons/info';
</script>

<Alert.Root class="my-6">
	<InfoIcon class="h-4 w-4" />
	<Alert.Title>Note</Alert.Title>
	<Alert.Description>
		To use environment variables from your <code class="bg-muted rounded px-1 py-0.5">.env</code>
		file in your services, you must still reference the file in your
		<code class="bg-muted rounded px-1 py-0.5">compose.yaml</code>
		using the <code class="bg-muted rounded px-1 py-0.5">env_file</code> property.
		<br /><br />
		Example:
		<pre class="bg-muted mt-2 rounded p-2 text-sm"><code
				>services:
  web:
    image: nginx
    env_file:
      - .env</code
			></pre>
	</Alert.Description>
</Alert.Root>
