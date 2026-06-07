<script lang="ts">
	import DocShell from '$lib/components/doc-shell.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<DocShell component={data.component} metadata={data.metadata} wide />
