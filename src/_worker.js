// Cloudflare Worker for Arcane Documentation Website
// Handles redirects and serves static assets with SPA fallback

/**
 * @typedef {Object} Env
 * @property {{ fetch: (request: Request) => Promise<Response> }} ASSETS
 */

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
