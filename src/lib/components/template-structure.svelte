<script lang="ts">
	import * as TreeView from '$lib/components/ui/tree-view/index.js';
</script>

<div class="mb-6 h-40 w-72">
	<TreeView.Root>
		<TreeView.Folder name="your-template">
			<TreeView.File name="compose.yaml" />
			<TreeView.File name=".env.example" />
			<TreeView.File name="README.md" />
		</TreeView.Folder>
	</TreeView.Root>
</div>
