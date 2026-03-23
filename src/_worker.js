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

const ALLOWED_PREFIXES = ['arcane-next/', 'cli-next/'];

export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env) {
		const url = new URL(request.url);

		// Redirect arcane.ofkm.dev to getarcane.app (301 permanent redirect)
		if (url.hostname === 'arcane.ofkm.dev') {
			const redirectUrl = new URL(request.url);
			redirectUrl.hostname = 'getarcane.app';

			return Response.redirect(redirectUrl.toString(), 301);
		}

		// R2 bucket listing API
		if (url.pathname === '/api/r2/list') {
			const prefix = url.searchParams.get('prefix') ?? '';
			if (!ALLOWED_PREFIXES.includes(prefix)) {
				return new Response(JSON.stringify({ error: 'Invalid prefix' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				});
			}
			if (!env.BUCKET) {
				return new Response(JSON.stringify({ error: 'Storage not configured' }), {
					status: 503,
					headers: { 'Content-Type': 'application/json' }
				});
			}
			const listed = await env.BUCKET.list({ prefix });
			const files = listed.objects
				.filter((o) => !o.key.endsWith('.txt') && !o.key.endsWith('index.html') && o.size > 0)
				.map((o) => ({ key: o.key, size: o.size, modified: o.uploaded }));
			return new Response(JSON.stringify({ files }), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=60'
				}
			});
		}

		// R2 file download proxy
		if (url.pathname === '/api/r2/get') {
			const key = url.searchParams.get('key') ?? '';
			if (!key || !ALLOWED_PREFIXES.some((p) => key.startsWith(p))) {
				return new Response('Invalid key', { status: 400 });
			}
			if (!env.BUCKET) {
				return new Response('Storage not configured', { status: 503 });
			}
			const obj = await env.BUCKET.get(key);
			if (!obj) {
				return new Response('Not found', { status: 404 });
			}
			const filename = key.split('/').pop() ?? 'download';
			return new Response(obj.body, {
				headers: {
					'Content-Type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
					'Content-Disposition': `attachment; filename="${filename}"`,
					'Cache-Control': 'public, max-age=3600'
				}
			});
		}

		// Try to serve static assets first
		const response = await env.ASSETS.fetch(request);
		// If the asset exists, return it
		if (response.status !== 404) {
			return response;
		}

		// For 404s on HTML pages (not static files like .js, .css, images),
		// serve the SPA fallback (index.html)
		const pathname = url.pathname;
		const hasExtension = pathname.includes('.') && !pathname.endsWith('/');

		if (!hasExtension) {
			// This is likely a SPA route, serve index.html
			const fallbackRequest = new Request(new URL('/index.html', url.origin), request);
			return env.ASSETS.fetch(fallbackRequest);
		}

		// For actual missing static files, return the 404
		return response;
	}
};
