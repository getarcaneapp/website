import { getDoc } from '$lib/docs.js';
import type { PageLoad } from './$types.js';

export const prerender = true;

export const load: PageLoad = () => getDoc('privacy');
