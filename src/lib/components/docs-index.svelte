<script lang="ts">
	import type { Component } from 'svelte';
	import ArrowRight from 'virtual:icons/lucide/arrow-right';
	import ArrowUpCircle from 'virtual:icons/lucide/arrow-up-circle';
	import BookOpen from 'virtual:icons/lucide/book-open';
	import Boxes from 'virtual:icons/lucide/boxes';
	import Code from 'virtual:icons/lucide/code';
	import KeyRound from 'virtual:icons/lucide/key-round';
	import LayoutTemplate from 'virtual:icons/lucide/layout-template';
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
		Features: {
			icon: Boxes,
			description: 'Containers, images, volumes, networks, Swarm, and more.'
		},
		Templates: {
			icon: LayoutTemplate,
			description: 'Reusable project templates and template registries.'
		},
		Configuration: {
			icon: Settings2,
			description: 'Environment variables, appearance, notifications, and analytics.'
		},
		'Authentication & Access': {
			icon: KeyRound,
			description: 'SSO, access control, and federated credentials.'
		},
		Networking: {
			icon: Network,
			description: 'Reverse proxies, WebSockets, and TLS configuration.'
		},
		'Security & Hardening': {
			icon: ShieldCheck,
			description: 'Socket proxy, edge mTLS, and verified artifacts.'
		},
		Guides: {
			icon: BookOpen,
			description: 'Task-focused walkthroughs for common workflows.'
		},
		'Upgrade & Migration': {
			icon: ArrowUpCircle,
			description: 'Move to Arcane 2.0 and try preview builds.'
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
			class="group relative flex flex-col gap-3 overflow-hidden rounded-md border border-border bg-background p-5 no-underline! transition-all duration-300 hover:border-primary/30 hover:no-underline! hover:shadow-sm hover:shadow-primary/5 focus-visible:no-underline!"
		>
			<div
				class="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-linear-to-r from-transparent via-primary/40 to-transparent transition-transform duration-300 group-hover:scale-x-100"
			></div>
			<div
				class="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
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
				<ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
			</span>
		</a>
	{/each}
</div>
