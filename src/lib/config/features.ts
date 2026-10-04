import {
	BookOpenIcon,
	BoxIcon,
	ChartIcon,
	ClockIcon,
	GlobeIcon,
	ShieldCheckIcon,
	SparklesIcon,
	VolumesIcon,
	WrenchIcon
} from '#lib/icons/index.js';

type IconComponent = typeof SparklesIcon;

export interface Feature {
	icon: IconComponent;
	title: string;
	description: string;
}

export const features: Feature[] = [
	{
		icon: SparklesIcon,
		title: 'Modern UI Interface',
		description: 'Clean, intuitive design that makes Docker management a breeze.'
	},
	{
		icon: ClockIcon,
		title: 'Real-time Monitoring',
		description: 'Live updates of container status, resource usage, and logs.'
	},
	{
		icon: WrenchIcon,
		title: 'Container Management',
		description: 'Start, stop, restart, and inspect containers with ease.'
	},
	{
		icon: BoxIcon,
		title: 'Image Management',
		description: 'Pull, and manage Docker images.'
	},
	{
		icon: GlobeIcon,
		title: 'Network Configuration',
		description: 'Create and configure Docker networks.'
	},
	{
		icon: VolumesIcon,
		title: 'Volume Management',
		description: 'Create and manage persistent data with Docker volumes.'
	},
	{
		icon: ChartIcon,
		title: 'Resource Visualization',
		description: 'Visual graphs for CPU, memory, and network usage.'
	},
	{
		icon: ShieldCheckIcon,
		title: 'Vulnerability Scanning',
		description: 'Scan images for known vulnerabilities right from the dashboard.'
	},
	{
		icon: BookOpenIcon,
		title: 'Fully Documented API',
		description: 'RESTful API built with Huma on Gin, featuring built-in OpenAPI 3.1 documentation.'
	}
];
