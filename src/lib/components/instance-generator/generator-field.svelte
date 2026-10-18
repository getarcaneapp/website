<script lang="ts">
	import { RefreshIcon } from '#lib/icons/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import type { GeneratorField } from '#lib/types/instance-generator.type.js';
	import { generateRandomKey } from '#lib/utils/instance-generator.js';

	interface Props {
		field: GeneratorField;
		value: string | boolean;
	}

	let { field, value = $bindable() }: Props = $props();

	let error = $derived(
		typeof value === 'string' && field.validate ? field.validate(value) : undefined
	);
	let hintId = $derived(`${field.key}-hint`);
	let selectLabel = $derived(
		field.options?.find((option) => option.value === value)?.label ?? field.placeholder
	);
</script>

{#if field.type === 'checkbox'}
	<div class="flex items-start justify-between gap-4 py-1">
		<div class="grid gap-1">
			<Label for={field.key} class="leading-snug">{field.label}</Label>
			{#if field.description}
				<p id={hintId} class="text-[0.8125rem] leading-snug text-muted-foreground">
					{field.description}
				</p>
			{/if}
		</div>
		<Switch
			id={field.key}
			class="mt-0.5"
			checked={value === true}
			aria-describedby={field.description ? hintId : undefined}
			onCheckedChange={(checked) => (value = checked === true)}
		/>
	</div>
{:else}
	<div class="grid content-start gap-1.5">
		<div class="flex min-h-5 items-center justify-between gap-2">
			<Label for={field.key}>{field.label}</Label>
			{#if field.required}
				<span
					class="rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-medium text-primary dark:text-primary-tint"
					>Required</span
				>
			{/if}
		</div>
		{#if field.type === 'select'}
			<Select.Root
				type="single"
				value={value as string}
				onValueChange={(next: string) => {
					if (next) value = next;
				}}
			>
				<Select.Trigger id={field.key} class="w-full" aria-describedby={hintId}>
					{selectLabel}
				</Select.Trigger>
				<Select.Content>
					{#each field.options ?? [] as option (option.value)}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<div class="flex gap-2">
				<Input
					id={field.key}
					type={field.type === 'password' ? 'password' : 'text'}
					bind:value
					placeholder={field.placeholder}
					autocomplete="off"
					spellcheck={false}
					aria-invalid={error ? true : undefined}
					aria-describedby={hintId}
					class="flex-1 font-mono text-[0.8125rem] placeholder:font-sans"
				/>
				{#if field.canGenerate}
					<Button
						type="button"
						variant="outline"
						size="sm"
						class="h-9 rounded-md"
						onclick={() => (value = generateRandomKey())}
					>
						<RefreshIcon class="size-3.5" />
						Generate
					</Button>
				{/if}
			</div>
		{/if}
		{#if error}
			<p id={hintId} class="text-[0.8125rem] leading-snug text-destructive" role="alert">
				{error}
			</p>
		{:else if field.description}
			<p id={hintId} class="text-[0.8125rem] leading-snug text-muted-foreground">
				{field.description}
			</p>
		{/if}
	</div>
{/if}
