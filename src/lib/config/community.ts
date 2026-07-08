import type { CommunityItem } from '$lib/types/community.type.js';

export const communityItems: CommunityItem[] = [
	{
		kind: 'video',
		videoId: 'YwpWqdexEIk',
		title: 'The Best Docker Manager I’ve Seen! // Arcane Tutorial',
		author: 'Christian Lempa',
		url: 'https://www.youtube.com/watch?v=YwpWqdexEIk',
		publishedAt: '2026-06-30',
		featured: true
	},
	{
		kind: 'video',
		videoId: '3TaDWpYgGtE',
		title: 'Arcane vs Dockhand: The Best Docker Manager for Your Homelab?',
		author: 'ServersatHome',
		url: 'https://www.youtube.com/watch?v=3TaDWpYgGtE',
		publishedAt: '2026-06-25',
		featured: true
	},
	{
		kind: 'video',
		videoId: 'XGZk3OmNFeg',
		title: '#arcane vs #portainer : Is This the Docker UI Homelabs Have Been Waiting For?',
		author: '45HomeLab',
		url: 'https://www.youtube.com/watch?v=XGZk3OmNFeg',
		publishedAt: '2026-01-01',
		featured: true
	},
	{
		kind: 'article',
		title:
			'Switching from Portainer to Arcane - Why We Looked for an Alternative in Docker Management',
		author: 'Erhan Baştürk',
		url: 'https://erhanbasturk.com.tr/blog/en/switching-from-portainer-to-arcane-docker-management',
		publishedAt: '2026-06-29',
		thumbnail:
			'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*f2CZGei9wnyXzsD7Q4MJDQ.png',
		featured: true
	},
	{
		kind: 'article',
		title: 'Why Arcane Might Be the Next Big Docker UI for the Home Lab',
		author: 'Brandon Lee',
		url: 'https://www.virtualizationhowto.com/2025/12/why-arcane-might-be-the-next-big-docker-ui-for-the-home-lab/',
		publishedAt: '2025-12-29',
		source: 'Virtualization Howto',
		thumbnail:
			'https://www.virtualizationhowto.com/wp-content/smush-webp/2025/12/docker-management-ui.png.webp',
		featured: true
	}
];

export const communityVideos = communityItems.filter((item) => item.kind === 'video');
export const communityArticles = communityItems.filter((item) => item.kind === 'article');

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export const featuredCommunityItems = shuffle(communityItems).slice(0, 3);
