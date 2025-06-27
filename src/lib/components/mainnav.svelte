<script lang="ts">
	let { items, class: className = '' } = $props<{
		items: { href: string; label: string }[];
		class?: string;
	}>();
</script>

<nav class="{className} gap-4 text-sm">
	{#each items as item}
		<a href={item.href} class="hover:underline">{item.label}</a>
	{/each}
</nav>
