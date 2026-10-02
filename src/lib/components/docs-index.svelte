<script lang="ts">
	import type { Component } from 'svelte';
	import {
		ArrowRightIcon,
		BookOpenIcon,
		CodeIcon,
		ContainersIcon,
		EnvironmentsIcon,
		NetworksIcon,
		RocketIcon,
		SettingsIcon,
		ShieldCheckIcon,
		UsersIcon
	} from '#lib/icons/index.js';
	import { SidebarNavItems } from '#lib/config/docs.js';

	type IconComponent = Component<{ class?: string }>;

	const SECTION_META: Record<string, { icon: IconComponent; description: string }> = {
		'Get Started': {
			icon: RocketIcon,
			description: 'Install Arcane, migrate to 2.0, try preview builds, or downgrade.'
		},
		'Managing Docker': {
			icon: ContainersIcon,
			description: 'Projects, containers, images, volumes, backups, and auto updates.'
		},
		'Remote Hosts & Swarm': {
			icon: EnvironmentsIcon,
			description: 'Manage other Docker hosts with agents, and run Docker Swarm.'
		},
		'Users & Access': {
			icon: UsersIcon,
			description: 'Single sign-on, passkeys, roles, and account recovery.'
		},
		'Settings & Integrations': {
			icon: SettingsIcon,
			description: 'Appearance, notifications, the mobile app, and GPU monitoring.'
		},
		'Reverse Proxy & Networking': {
			icon: NetworksIcon,
			description:
				'Put Arcane behind Nginx, Apache, or Traefik, enable TLS, or use an outbound proxy.'
		},
		Security: {
			icon: ShieldCheckIcon,
			description: 'Vulnerability scans, socket proxy, edge mTLS, and signed images.'
		},
		Reference: {
			icon: BookOpenIcon,
			description: 'Environment variables, Compose labels, the API, and the CLI.'
		},
		Contributing: {
			icon: CodeIcon,
			description: 'Build Arcane from source, translate it, and add build-time features.'
		}
	};

	const cards = SidebarNavItems.filter((section) => SECTION_META[section.title]).map((section) => {
		const docs = section.items.flatMap((item) => [
			...(item.href ? [{ title: item.title, href: item.href }] : []),
			...item.items.map((child) => ({ title: child.title, href: child.href ?? '' }))
		]);
		return {
			title: section.title,
			...SECTION_META[section.title],
			href: docs[0]?.href ?? '/docs',
			count: docs.length
		};
	});
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each cards as card (card.title)}
		{@const Icon = card.icon}
		<a
			href={card.href}
			class="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-background p-5 no-underline! transition-all duration-300 hover:border-primary/30 hover:no-underline! hover:shadow-sm hover:shadow-primary/5 focus-visible:no-underline!"
		>
			<div
				class="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-linear-to-r from-transparent via-primary/40 to-transparent transition-transform duration-300 group-hover:scale-x-100"
			></div>
			<div
				class="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
			>
				<Icon class="size-5" />
			</div>
			<div class="flex-1">
				<span
					class="block font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary"
				>
					{card.title}
				</span>
				<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
			</div>
			<span class="flex items-center gap-1 text-xs font-medium text-muted-foreground">
				{card.count} article{card.count === 1 ? '' : 's'}
				<ArrowRightIcon class="size-3.5 transition-transform group-hover:translate-x-0.5" />
			</span>
		</a>
	{/each}
</div>
