<script lang="ts">
	import { RadioGroup } from 'bits-ui';
	import type { Component } from 'svelte';
	import {
		CheckIcon,
		CpuIcon,
		DockerBrandIcon,
		PodmanBrandIcon,
		RoutingIcon,
		ServiceIcon
	} from '#lib/icons/index.js';
	import { deploymentGroups } from '#lib/config/instance-generator.js';
	import type { DeploymentTargetId } from '#lib/types/instance-generator.type.js';

	interface Props {
		value: DeploymentTargetId;
	}

	let { value = $bindable() }: Props = $props();

	const icons: Record<DeploymentTargetId, Component> = {
		docker: DockerBrandIcon,
		'podman-rootless': PodmanBrandIcon,
		'podman-rootful': PodmanBrandIcon,
		'podman-quadlet': ServiceIcon,
		'agent-edge': RoutingIcon,
		'agent-binary': CpuIcon
	};
</script>

<RadioGroup.Root
	bind:value={() => value, (next) => (value = next as DeploymentTargetId)}
	aria-label="Deployment type"
	class="grid gap-5"
>
	{#each deploymentGroups as group (group.id)}
		<div role="group" aria-labelledby={`target-group-${group.id}`} class="grid gap-2.5">
			<div class="grid gap-0.5">
				<h3
					id={`target-group-${group.id}`}
					class="text-2xs font-semibold tracking-label text-muted-foreground uppercase"
				>
					{group.title}
				</h3>
				<p class="text-xs text-muted-foreground/80">{group.description}</p>
			</div>
			<div class="grid gap-2.5 sm:grid-cols-2">
				{#each group.targets as option (option.id)}
					{@const Icon = icons[option.id]}
					<RadioGroup.Item
						value={option.id}
						class="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-[border-color,background-color,box-shadow] outline-none hover:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/[0.06] data-[state=checked]:shadow-[0_0_0_1px_var(--primary)]"
					>
						<span
							class="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-muted text-muted-foreground transition-colors group-data-[state=checked]:border-primary/30 group-data-[state=checked]:bg-primary/15 group-data-[state=checked]:text-primary dark:group-data-[state=checked]:text-primary-tint"
						>
							<Icon class="size-4" />
						</span>
						<span class="grid min-w-0 gap-0.5 pr-5">
							<span class="text-sm leading-snug font-semibold">{option.label}</span>
							<span class="line-clamp-2 text-xs leading-snug text-muted-foreground"
								>{option.description}</span
							>
						</span>
						<span
							class="absolute top-3 right-3 grid size-4 place-items-center rounded-full border border-border transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary group-data-[state=checked]:text-primary-foreground"
						>
							<CheckIcon class="size-3.5 opacity-0 group-data-[state=checked]:opacity-100" />
						</span>
					</RadioGroup.Item>
				{/each}
			</div>
		</div>
	{/each}
</RadioGroup.Root>
