<script lang="ts">
import { Button } from '#lib/components/ui/button/index.js';
import { Input } from '#lib/components/ui/input/index.js';
import { Label } from '#lib/components/ui/label/index.js';
import * as Select from '#lib/components/ui/select/index.js';
import { Switch } from '#lib/components/ui/switch/index.js';
import { RefreshIcon } from '#lib/icons/index.js';
import type { GeneratorField } from '#lib/types/instance-generator.type.js';
import { generateRandomKey } from '#lib/utils/instance-generator.js';

interface Props {
	field: GeneratorField;
	value: string | boolean;
	/** Validation message from the parent, which owns validation for the whole form. */
	error?: string;
}

let { field, value = $bindable(), error }: Props = $props();

let hintId = $derived(`${field.key}-hint`);
let errorId = $derived(`${field.key}-error`);
let describedBy = $derived(
	[field.description && hintId, error && errorId].filter(Boolean).join(' ') || undefined
);
let selectLabel = $derived(
	field.options?.find((option) => option.value === value)?.label ?? field.placeholder
);

const focusRing =
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
</script>

{#if field.type === 'checkbox'}
	<div class="flex items-start justify-between gap-4">
		<div class="grid gap-0.5">
			<Label for={field.key} class="min-h-6 leading-snug">{field.label}</Label>
			{#if field.description}
				<p id={hintId} class="text-[0.8125rem] leading-snug text-muted-foreground">
					{field.description}
				</p>
			{/if}
		</div>
		<Switch
			id={field.key}
			class={`mt-0.5 ${focusRing}`}
			checked={value === true}
			aria-describedby={describedBy}
			onCheckedChange={(checked) => (value = checked === true)}
		/>
	</div>
{:else}
	<div class="grid content-start gap-1.5">
		<div class="flex min-h-5 items-baseline justify-between gap-2">
			<Label for={field.key}>{field.label}</Label>
			{#if field.required}
				<span class="text-xs text-muted-foreground">Required</span>
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
				<Select.Trigger
					id={field.key}
					class={`w-full border-input-border max-sm:h-11! ${focusRing}`}
					aria-describedby={describedBy}
				>
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
					required={field.required}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					class={`h-11 flex-1 font-mono text-base placeholder:font-sans sm:h-9 sm:text-sm ${focusRing}`}
				/>
				{#if field.canGenerate}
					<Button
						type="button"
						variant="outline"
						size="sm"
						class={`h-9 rounded-md max-sm:h-11 ${focusRing}`}
						aria-label={`Generate a new ${field.label.toLowerCase()}`}
						onclick={() => (value = generateRandomKey())}
					>
						<RefreshIcon class="size-3.5" />
						Generate
					</Button>
				{/if}
			</div>
		{/if}
		{#if field.description}
			<p id={hintId} class="text-[0.8125rem] leading-snug text-muted-foreground">
				{field.description}
			</p>
		{/if}
		{#if error}
			<p id={errorId} class="text-[0.8125rem] leading-snug font-medium text-destructive">
				{error}
			</p>
		{/if}
	</div>
{/if}
