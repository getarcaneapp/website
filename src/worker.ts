type R2Object = {
	key: string;
	size: number;
	uploaded: Date;
	httpMetadata?: { contentType?: string };
	body: ReadableStream;
};

type Env = {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
	BUCKET?: {
		list: (options: { prefix: string }) => Promise<{ objects: R2Object[] }>;
		get: (key: string) => Promise<R2Object | null>;
	};
};

type Context = { waitUntil: (promise: Promise<unknown>) => void };

const ALLOWED_PREFIXES = ['bin/arcane-next/', 'bin/cli-next/'];
const DISCORD_INVITE_URL =
	'https://discord.com/api/v10/invites/WyXYpdyV3Z?with_counts=true&with_expiration=true';
const DISCORD_PRESENCE_PATH = '/api/discord/presence';

const DOC_REDIRECTS = new Map([
	['/api-reference', '/docs/reference/api'],
	['/docs/setup/installation', '/docs/get-started/installation'],
	['/docs/setup/podman', '/docs/get-started/podman'],
	['/docs/guides/lxc-container', '/docs/get-started/lxc-container'],
	['/docs/setup/migrate-v2', '/docs/get-started/migrate-v2'],
	['/docs/setup/next-images', '/docs/get-started/preview-builds'],
	['/docs/setup/socket-proxy', '/docs/security/socket-proxy'],
	['/docs/templates', '/docs/docker/templates'],
	['/docs/templates/registries', '/docs/docker/template-registries'],
	['/docs/features/variables', '/docs/docker/variables'],
	['/docs/configuration/sso', '/docs/access/sso'],
	['/docs/security/passkeys', '/docs/access/passkeys'],
	['/docs/security/rbac', '/docs/access/roles'],
	['/docs/security/federated-credentials', '/docs/access/federated-credentials'],
	['/docs/configuration/proxy', '/docs/networking/outbound-proxy'],
	['/docs/configuration/websockets-reverse-proxies', '/docs/networking/reverse-proxy'],
	['/docs/configuration/traefik', '/docs/networking/reverse-proxy#traefik'],
	['/docs/networking/traefik', '/docs/networking/reverse-proxy#traefik'],
	['/docs/configuration/tls', '/docs/networking/tls'],
	['/docs/dev/contribute', '/docs/development/contribute'],
	['/docs/dev/translate', '/docs/development/translate'],
	['/docs/features/projects', '/docs/docker/projects'],
	['/docs/features/git-sync', '/docs/docker/git-sync'],
	['/docs/features/containers', '/docs/docker/containers'],
	['/docs/features/images', '/docs/docker/images'],
	['/docs/features/image-builds', '/docs/docker/image-builds'],
	['/docs/features/volumes', '/docs/docker/volumes'],
	['/docs/features/networks', '/docs/docker/networks'],
	['/docs/features/backups', '/docs/docker/backups'],
	['/docs/features/activity-and-events', '/docs/docker/activity'],
	['/docs/guides/gitops-lifecycle-hooks', '/docs/docker/gitops-hooks'],
	['/docs/guides/updates', '/docs/docker/auto-updates'],
	['/docs/customization/templates', '/docs/docker/templates'],
	['/docs/customization/registries', '/docs/docker/template-registries'],
	['/docs/customization/variables', '/docs/docker/variables'],
	['/docs/features/environments', '/docs/remote/environments'],
	['/docs/authentication/sso', '/docs/access/sso'],
	['/docs/authentication/passkeys', '/docs/access/passkeys'],
	['/docs/authentication/rbac', '/docs/access/roles'],
	['/docs/authentication/federated-credentials', '/docs/access/federated-credentials'],
	['/docs/security/account-recovery', '/docs/access/account-recovery'],
	['/docs/configuration/appearance', '/docs/settings/appearance'],
	['/docs/configuration/notifications', '/docs/settings/notifications'],
	['/docs/configuration/analytics', '/docs/settings/analytics'],
	['/docs/guides/arcane-mobile', '/docs/settings/mobile-app'],
	['/docs/guides/gpu-setup', '/docs/settings/gpu-monitoring'],
	['/docs/networking/websockets-reverse-proxies', '/docs/networking/reverse-proxy'],
	['/docs/networking/proxy', '/docs/networking/outbound-proxy'],
	['/docs/features/vulnerability-scans', '/docs/security/vulnerability-scans'],
	['/docs/configuration/environment', '/docs/reference/environment-variables'],
	['/docs/guides/custom-metadata', '/docs/reference/compose-labels'],
	['/docs/cli/install', '/docs/reference/cli/install'],
	['/docs/cli/config', '/docs/reference/cli/config'],
	['/docs/cli/commands', '/docs/reference/cli/commands'],
	['/docs/upgrade/next-images', '/docs/get-started/preview-builds'],
	['/docs/upgrade/migrate-v2', '/docs/get-started/migrate-v2'],
	['/docs/upgrade/preview-builds', '/docs/get-started/preview-builds'],
	['/docs/upgrade/downgrading', '/docs/get-started/downgrading'],
	['/docs/guides/buildables', '/docs/development/buildables'],
	['/docs/guides/buildables/autologin', '/docs/development/buildables/autologin'],
	['/docs/features/swarm', '/docs/remote/swarm'],
	['/docs/features/swarm-cluster', '/docs/remote/swarm-cluster'],
	['/docs/features/swarm-workloads', '/docs/remote/swarm-workloads'],
	['/docs/features/swarm-nodes-agents', '/docs/remote/swarm-nodes-agents'],
	['/docs/features/swarm-configs-secrets', '/docs/remote/swarm-configs-secrets']
]);

function getDocRedirect(url: URL): Response | null {
	const pathname = url.pathname.replace(/\/+$/, '') || '/';
	const destination = DOC_REDIRECTS.get(pathname);
	if (!destination) return null;

	const redirectUrl = new URL(destination, url.origin);
	redirectUrl.search = url.search;
	return Response.redirect(redirectUrl.toString(), 301);
}

function getDiscordPresenceCount(data: unknown): number | null {
	if (
		typeof data !== 'object' ||
		data === null ||
		!('approximate_presence_count' in data) ||
		typeof data.approximate_presence_count !== 'number' ||
		!Number.isInteger(data.approximate_presence_count) ||
		data.approximate_presence_count < 0
	) {
		return null;
	}

	return data.approximate_presence_count;
}

async function getDiscordPresenceResponse(
	request: Request,
	url: URL,
	ctx: Context
): Promise<Response> {
	if (request.method !== 'GET') {
		return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } });
	}

	const discordCache = await caches.open('discord-presence');
	const cacheKey = new Request(new URL(DISCORD_PRESENCE_PATH, url.origin), { method: 'GET' });
	const cachedResponse = await discordCache.match(cacheKey);
	if (cachedResponse) return cachedResponse;

	try {
		const discordResponse = await fetch(DISCORD_INVITE_URL, {
			headers: { Accept: 'application/json' }
		});
		if (!discordResponse.ok) {
			throw new Error(`Discord returned status ${discordResponse.status}`);
		}

		const online = getDiscordPresenceCount(await discordResponse.json());
		if (online === null) {
			throw new Error('Discord returned an invalid presence count');
		}

		const response = Response.json(
			{ online },
			{
				headers: {
					'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
				}
			}
		);
		ctx.waitUntil(discordCache.put(cacheKey, response.clone()));
		return response;
	} catch (error) {
		console.error(
			JSON.stringify({
				message: 'Failed to load Discord presence',
				error: error instanceof Error ? error.message : String(error)
			})
		);
		return Response.json(
			{ error: 'Discord presence is currently unavailable' },
			{ status: 503, headers: { 'Cache-Control': 'no-store' } }
		);
	}
}

async function getR2ListResponse(url: URL, env: Env): Promise<Response> {
	const prefix = url.searchParams.get('prefix') ?? '';
	if (!ALLOWED_PREFIXES.includes(prefix)) {
		return Response.json({ error: 'Invalid prefix' }, { status: 400 });
	}
	if (!env.BUCKET) {
		return Response.json({ error: 'Storage not configured' }, { status: 503 });
	}

	const listed = await env.BUCKET.list({ prefix });
	const files = listed.objects
		.filter(
			(object) =>
				!object.key.endsWith('.txt') && !object.key.endsWith('index.html') && object.size > 0
		)
		.map((object) => ({ key: object.key, size: object.size, modified: object.uploaded }));

	return Response.json({ files }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}

function getDownloadFilename(key: string): string {
	return (key.split('/').pop() ?? 'download').replace(/["\r\n]/g, '');
}

async function getR2ObjectResponse(url: URL, env: Env): Promise<Response> {
	const key = url.searchParams.get('key') ?? '';
	if (!key || !ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix))) {
		return new Response('Invalid key', { status: 400 });
	}
	if (!env.BUCKET) {
		return new Response('Storage not configured', { status: 503 });
	}

	const object = await env.BUCKET.get(key);
	if (!object) {
		return new Response('Not found', { status: 404 });
	}

	return new Response(object.body, {
		headers: {
			'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${getDownloadFilename(key)}"`,
			'Cache-Control': 'public, max-age=3600'
		}
	});
}

async function getAssetResponse(request: Request, url: URL, env: Env): Promise<Response> {
	const response = await env.ASSETS.fetch(request);
	if (response.status !== 404) return response;

	const notFound = await env.ASSETS.fetch(new Request(new URL('/404.html', url.origin), request));
	return new Response(notFound.body, { status: 404, headers: notFound.headers });
}

export default {
	async fetch(request: Request, env: Env, ctx: Context): Promise<Response> {
		const url = new URL(request.url);
		const redirect = getDocRedirect(url);
		if (redirect) return redirect;

		switch (url.pathname) {
			case DISCORD_PRESENCE_PATH:
				return getDiscordPresenceResponse(request, url, ctx);
			case '/api/r2/list':
				return getR2ListResponse(url, env);
			case '/api/r2/get':
				return getR2ObjectResponse(url, env);
			default:
				return getAssetResponse(request, url, env);
		}
	}
};
