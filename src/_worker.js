// Cloudflare Worker for Arcane Documentation Website
// Handles redirects and serves static assets with SPA fallback

/**
 * @typedef {Object} R2Object
 * @property {string} key
 * @property {number} size
 * @property {Date} uploaded
 * @property {{ contentType?: string } | undefined} httpMetadata
 * @property {ReadableStream} body
 */

/**
 * @typedef {Object} R2Bucket
 * @property {(opts: { prefix: string }) => Promise<{ objects: R2Object[] }>} list
 * @property {(key: string) => Promise<R2Object | null>} get
 */

/**
 * @typedef {Object} Env
 * @property {{ fetch: (request: Request) => Promise<Response> }} ASSETS
 * @property {R2Bucket | undefined} BUCKET
 */

/**
 * @typedef {Object} ExecutionContext
 * @property {(promise: Promise<unknown>) => void} waitUntil
 */

const ALLOWED_PREFIXES = ['bin/arcane-next/', 'bin/cli-next/'];
const DISCORD_INVITE_URL =
	'https://discord.com/api/v10/invites/WyXYpdyV3Z?with_counts=true&with_expiration=true';
const DISCORD_PRESENCE_PATH = '/api/discord/presence';

/**
 * @param {string} key
 * @returns {string}
 */
function getDownloadFilename(key) {
	return (key.split('/').pop() ?? 'download').replace(/["\r\n]/g, '');
}

/**
 * @param {Request} request
 * @param {URL} url
 * @returns {Response | null}
 */
function getLegacyRedirect(request, url) {
	if (url.hostname !== 'arcane.ofkm.dev') return null;

	const redirectUrl = new URL(request.url);
	redirectUrl.hostname = 'getarcane.app';
	return Response.redirect(redirectUrl.toString(), 301);
}

/**
 * @param {unknown} data
 * @returns {number | null}
 */
function getDiscordPresenceCount(data) {
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

/**
 * @param {Request} request
 * @param {URL} url
 * @param {ExecutionContext} ctx
 * @returns {Promise<Response>}
 */
async function getDiscordPresenceResponse(request, url, ctx) {
	if (request.method !== 'GET') {
		return new Response('Method not allowed', {
			status: 405,
			headers: { Allow: 'GET' }
		});
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

/**
 * @param {URL} url
 * @param {Env} env
 * @returns {Promise<Response>}
 */
async function getR2ListResponse(url, env) {
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

/**
 * @param {URL} url
 * @param {Env} env
 * @returns {Promise<Response>}
 */
async function getR2ObjectResponse(url, env) {
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

/**
 * @param {Request} request
 * @param {URL} url
 * @param {Env} env
 * @returns {Promise<Response>}
 */
async function getAssetResponse(request, url, env) {
	const response = await env.ASSETS.fetch(request);
	if (response.status !== 404) return response;

	const hasExtension = url.pathname.includes('.') && !url.pathname.endsWith('/');
	if (hasExtension) return response;

	const fallbackRequest = new Request(new URL('/index.html', url.origin), request);
	return env.ASSETS.fetch(fallbackRequest);
}

export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 * @param {ExecutionContext} ctx
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const redirect = getLegacyRedirect(request, url);
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
