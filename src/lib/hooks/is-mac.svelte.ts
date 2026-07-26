import { browser } from '$app/env';

export function useIsMac(): { readonly current: boolean } {
	const isMac = $derived(browser ? navigator.platform.includes('MAC') : false);

	return {
		get current(): boolean {
			return isMac;
		}
	};
}
