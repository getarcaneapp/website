// Cloudflare Worker for Arcane Documentation Website
// Handles redirects and serves static assets

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

		// Serve static assets for all other requests
		return env.ASSETS.fetch(request);
	},
};
