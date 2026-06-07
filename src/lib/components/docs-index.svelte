<script lang="ts">
	import type { Component } from 'svelte';
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import BookOpen from 'virtual:icons/lucide/book-open';
	import Boxes from 'virtual:icons/lucide/boxes';
	import Code from 'virtual:icons/lucide/code';
	import Network from 'virtual:icons/lucide/network';
	import Rocket from 'virtual:icons/lucide/rocket';
	import Settings2 from 'virtual:icons/lucide/settings-2';
	import ShieldCheck from 'virtual:icons/lucide/shield-check';
	import Terminal from 'virtual:icons/lucide/terminal';
	import { SidebarNavItems } from '$lib/config/docs.js';

	type IconComponent = Component<{ class?: string }>;

	// Icon + blurb per sidebar section title (keys must match SidebarNavItems titles).
	const SECTION_META: Record<string, { icon: IconComponent; description: string }> = {
		'Get Started': {
			icon: Rocket,
			description: 'Install Arcane and get your first instance running.'
		},
		Security: {
			icon: ShieldCheck,
			description: 'Harden access with RBAC, mTLS, and verified artifacts.'
		},
		Configuration: {
			icon: Settings2,
			description: 'Environment, appearance, notifications, SSO, and analytics.'
		},
		Networking: {
			icon: Network,
			description: 'Reverse proxies, WebSockets, and TLS configuration.'
		},
		Features: {
			icon: Boxes,
			description: 'Containers, images, volumes, networks, Swarm, and more.'
		},
		Guides: {
			icon: BookOpen,
			description: 'Task-focused walkthroughs for common workflows.'
		},
		CLI: {
			icon: Terminal,
			description: 'Install and configure the Arcane command-line tool.'
		},
		Development: {
			icon: Code,
			description: 'Contribute code or translations to Arcane.'
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

<div class="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each cards as card (card.title)}
		{@const Icon = card.icon}
		<a
			href={card.href}
			class="docs-surface group flex flex-col gap-3 p-5 transition-colors hover:border-primary/40"
		>
			<div class="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
				<Icon class="size-5" />
			</div>
			<div class="flex-1">
				<span
					class="block font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary"
				>
					{card.title}
				</span>
				<p class="mt-1 text-sm text-muted-foreground">{card.description}</p>
			</div>
			<span class="flex items-center gap-1 text-xs font-medium text-muted-foreground">
				{card.count} article{card.count === 1 ? '' : 's'}
				<ArrowRight
					class="size-3.5 transition-transform group-hover:translate-x-0.5"
				/>
			</span>
		</a>
	{/each}
</div>
