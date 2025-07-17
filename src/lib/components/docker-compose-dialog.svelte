<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Code from '$lib/components/ui/code';
	import { Download } from '@lucide/svelte';

	interface Props {
		open: boolean;
		generatedCompose: string;
		onOpenChange?: (open: boolean) => void;
	}

	let { open = $bindable(), generatedCompose, onOpenChange }: Props = $props();

	function downloadCompose() {
		const blob = new Blob([generatedCompose], { type: 'text/yaml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'docker-compose.yml';
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		onOpenChange?.(newOpen);
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Content
		class="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-full flex-col sm:h-auto sm:max-h-[80vh] sm:max-w-[600px] lg:min-h-[70vh] lg:max-w-[1500px]"
	>
		<Dialog.Header class="shrink-0">
			<Dialog.Title>Generated Docker Compose</Dialog.Title>
			<Dialog.Description>
				Your customized Docker Compose configuration is ready to use.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex min-h-0 flex-1 flex-col space-y-4">
			<Code.Root lang="yaml" class="min-h-0 flex-1 overflow-y-auto" code={generatedCompose}>
				<Code.CopyButton size="default" variant="ghost" />
			</Code.Root>

			<div
				class="flex shrink-0 flex-col items-stretch gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
			>
				<Button onclick={downloadCompose} variant="outline" class="w-full sm:w-auto">
					<Download class="mr-2 size-4" />
					Download File
				</Button>
				<Button variant="secondary" onclick={() => (open = false)} class="w-full sm:w-auto">
					Close
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
