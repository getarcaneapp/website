import {
	BookOpenIcon,
	BoxIcon,
	ChartIcon,
	ClockIcon,
	ContainersIcon,
	EnvironmentsIcon,
	FolderIcon,
	GlobeIcon,
	ShieldCheckIcon,
	VolumesIcon
} from '#lib/icons/index.js';

type IconComponent = typeof BoxIcon;

export interface Feature {
	icon: IconComponent;
	title: string;
	description: string;
}

export const features: Feature[] = [
	{
		icon: ContainersIcon,
		title: 'Containers',
		description: 'Start, stop, restart, and inspect containers.'
	},
	{
		icon: FolderIcon,
		title: 'Compose projects',
		description: 'Create, edit, and deploy Compose projects from the browser.'
	},
	{
		icon: BoxIcon,
		title: 'Images',
		description: 'Pull and manage Docker images.'
	},
	{
		icon: VolumesIcon,
		title: 'Volumes',
		description: 'Create and manage volumes for persistent data.'
	},
	{
		icon: GlobeIcon,
		title: 'Networks',
		description: 'Create and configure Docker networks.'
	},
	{
		icon: EnvironmentsIcon,
		title: 'Remote hosts',
		description: 'Manage other Docker hosts through an agent.'
	},
	{
		icon: ClockIcon,
		title: 'Live status and logs',
		description: 'See container status, resource usage, and logs as they change.'
	},
	{
		icon: ChartIcon,
		title: 'Resource graphs',
		description: 'Graph CPU, memory, and network usage.'
	},
	{
		icon: ShieldCheckIcon,
		title: 'Vulnerability scans',
		description: 'Scan images for known vulnerabilities from the dashboard.'
	},
	{
		icon: BookOpenIcon,
		title: 'REST API',
		description: 'Automate tasks with the REST API and OpenAPI schema.'
	}
];
