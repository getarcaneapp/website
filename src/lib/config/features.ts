import type { Component } from 'svelte';
import BookOpen from 'virtual:icons/lucide/book-open';
import ChartBar from 'virtual:icons/lucide/chart-bar';
import Clock from 'virtual:icons/lucide/clock';
import Globe from 'virtual:icons/lucide/globe';
import HardDrive from 'virtual:icons/lucide/hard-drive';
import Package from 'virtual:icons/lucide/package';
import Sparkles from 'virtual:icons/lucide/sparkles';
import Wrench from 'virtual:icons/lucide/wrench';

type IconComponent = Component<{ class?: string }>;

export interface Feature {
	icon: IconComponent;
	title: string;
	description: string;
	fullWidth?: boolean;
}

export const features: Feature[] = [
	{
		icon: Sparkles,
		title: 'Modern UI Interface',
		description: 'Clean, intuitive design that makes Docker management a breeze.'
	},
	{
		icon: Clock,
		title: 'Real-time Monitoring',
		description: 'Live updates of container status, resource usage, and logs.'
	},
	{
		icon: Wrench,
		title: 'Container Management',
		description: 'Start, stop, restart, and inspect containers with ease.'
	},
	{
		icon: Package,
		title: 'Image Management',
		description: 'Pull, and manage Docker images.'
	},
	{
		icon: Globe,
		title: 'Network Configuration',
		description: 'Create and configure Docker networks.'
	},
	{
		icon: HardDrive,
		title: 'Volume Management',
		description: 'Create and manage persistent data with Docker volumes.'
	},
	{
		icon: ChartBar,
		title: 'Resource Visualization',
		description: 'Visual graphs for CPU, memory, and network usage.'
	},
	{
		icon: BookOpen,
		title: 'Fully Documented API',
		description:
			'RESTful API built with Huma on Gin, featuring built-in OpenAPI 3.1 documentation.',
		fullWidth: true
	}
];
