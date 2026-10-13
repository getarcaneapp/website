interface CommunityItemBase {
	title: string;
	author: string;
	url: string;
	publishedAt: string;
	description?: string;
	featured?: boolean;
}

export interface CommunityVideo extends CommunityItemBase {
	kind: 'video';
	videoId: string;
	thumbnail?: string;
}

export interface CommunityArticle extends CommunityItemBase {
	kind: 'article';
	source?: string;
	/** Remote URL, or an imported local asset for sites that block build-time fetches. */
	thumbnail?: string | ImageMetadata;
}

export type CommunityItem = CommunityVideo | CommunityArticle;
