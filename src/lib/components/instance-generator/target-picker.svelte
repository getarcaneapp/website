<script lang="ts">
import { deploymentGroups } from '#lib/config/instance-generator.js';
import type { DeploymentGroup, DeploymentTargetId } from '#lib/types/instance-generator.type.js';

interface Props {
	value: DeploymentTargetId;
}

let { value = $bindable() }: Props = $props();

const roleHints: Record<string, string> = {
	manager: 'The Arcane web UI. Manages containers on the host it runs on.',
	agent: 'Adds another host to an existing Manager. Create the environment in Arcane first.'
};

const lastTargetByRole: Record<string, DeploymentTargetId> = {};

let role = $derived(
	deploymentGroups.find((group) => group.targets.some((option) => option.id === value)) ??
		deploymentGroups[0]
);

function selectRole(group: DeploymentGroup) {
	lastTargetByRole[role.id] = value;
	value = lastTargetByRole[group.id] ?? group.targets[0].id;
}

const rowClass =
	'flex min-h-11 cursor-pointer items-start gap-3 border-t border-border py-2.5 first-of-type:border-t-0';
const radioClass =
	'mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input-border bg-background checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_var(--background)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring forced-colors:appearance-auto';
</script>

<div class="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
	<fieldset class="m-0 min-w-0 border-0 p-0">
		<legend class="mb-1 p-0 text-sm font-semibold">Role</legend>
		{#each deploymentGroups as group (group.id)}
			<label class={rowClass}>
				<input
					type="radio"
					name="generator-role"
					value={group.id}
					class={radioClass}
					checked={role.id === group.id}
					onchange={() => selectRole(group)}
				>
				<span class="grid min-w-0 gap-0.5">
					<span class="text-sm leading-snug font-medium">{group.title}</span>
					<span class="text-[0.8125rem] leading-snug text-muted-foreground">
						{roleHints[group.id] ?? group.description}
					</span>
				</span>
			</label>
		{/each}
	</fieldset>

	<fieldset class="m-0 min-w-0 border-0 p-0">
		<legend class="mb-1 p-0 text-sm font-semibold">Runs on</legend>
		{#each role.targets as option (option.id)}
			<label class={rowClass}>
				<input
					type="radio"
					name="generator-target"
					value={option.id}
					class={radioClass}
					checked={value === option.id}
					onchange={() => (value = option.id)}
				>
				<span class="grid min-w-0 gap-0.5">
					<span class="text-sm leading-snug font-medium">{option.label}</span>
					<span class="text-[0.8125rem] leading-snug text-muted-foreground">
						{option.description}
					</span>
				</span>
			</label>
		{/each}
	</fieldset>
</div>
