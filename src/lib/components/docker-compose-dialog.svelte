<script lang="ts">
	import { DownloadIcon } from '#lib/icons/index.js';
	import { trackEvent } from '#lib/analytics.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Code from '#lib/components/ui/code/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';

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
		trackEvent('Compose Exported', { method: 'download' });
	}

	function handleCopy(status: 'success' | 'failure' | undefined) {
		if (status === 'success') {
			trackEvent('Compose Exported', { method: 'copy' });
		}
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		onOpenChange?.(newOpen);
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Content variant="wide">
		<Dialog.Header class="shrink-0">
			<Dialog.Title>Generated Docker Compose</Dialog.Title>
			<Dialog.Description
				>Your customized Docker Compose configuration is ready to use.</Dialog.Description
			>
		</Dialog.Header>

		<div class="flex min-h-0 flex-1 flex-col space-y-4">
			<Code.Root lang="yaml" class="min-h-0 flex-1 overflow-y-auto" code={generatedCompose}>
				<Code.CopyButton size="default" variant="ghost" onCopy={handleCopy} />
			</Code.Root>

			<div
				class="flex shrink-0 flex-col items-stretch gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
			>
				<Button onclick={downloadCompose} variant="outline" class="w-full sm:w-auto">
					<DownloadIcon class="mr-2 size-4" />
					Download File
				</Button>
				<Button variant="secondary" onclick={() => (open = false)} class="w-full sm:w-auto"
					>Close</Button
				>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
