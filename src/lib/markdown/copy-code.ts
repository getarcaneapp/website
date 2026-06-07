import type { Action } from 'svelte/action';

// Lucide `copy` and `check` icons, inlined so the action stays framework-free.
const COPY_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

/**
 * Adds a copy button to every build-time code block (`.code-block`) rendered
 * inside the markdown content wrapper. mdsvex emits fenced code as a raw
 * `{@html}` block, so the button can't be a Svelte component — it's wired here.
 */
export const copyCode: Action = (node) => {
	const cleanups: Array<() => void> = [];

	const blocks = node.querySelectorAll<HTMLElement>('.code-block');
	for (const block of blocks) {
		if (block.querySelector('.copy-code-button')) continue;
		const codeEl = block.querySelector('code');
		if (!codeEl) continue;

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'copy-code-button';
		button.setAttribute('aria-label', 'Copy code');
		button.innerHTML = COPY_ICON;

		let resetTimer: ReturnType<typeof setTimeout> | undefined;

		const onClick = async () => {
			try {
				await navigator.clipboard.writeText(codeEl.textContent ?? '');
				button.innerHTML = CHECK_ICON;
			} catch {
				// clipboard may be unavailable (insecure context / denied permission)
			}
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => (button.innerHTML = COPY_ICON), 1500);
		};

		button.addEventListener('click', onClick);
		block.appendChild(button);
		cleanups.push(() => {
			clearTimeout(resetTimer);
			button.removeEventListener('click', onClick);
			button.remove();
		});
	}

	return {
		destroy() {
			for (const cleanup of cleanups) cleanup();
		}
	};
};
