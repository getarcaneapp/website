interface CommunityItemBase {
	title: string;
	author: string;
	url: string;
	publishedAt: string;
	description?: string;
	featured?: boolean;
	thumbnail?: string;
}

export interface CommunityVideo extends CommunityItemBase {
	kind: 'video';
	videoId: string;
}

export interface CommunityArticle extends CommunityItemBase {
	kind: 'article';
	source?: string;
}

export type CommunityItem = CommunityVideo | CommunityArticle;
