type FadeTarget = HTMLElement;

const getImageNode = (node: FadeTarget): HTMLImageElement | null => {
	if (node instanceof HTMLImageElement) {
		return node;
	}

	return node.querySelector('img');
};

export const imageFadeIn = (node: FadeTarget) => {
	const image = getImageNode(node);

	if (!image) {
		return {};
	}

	const markLoaded = () => {
		node.dataset.loaded = 'true';
	};

	if (image.complete && image.naturalWidth > 0) {
		markLoaded();
	} else {
		image.addEventListener('load', markLoaded, { once: true });
		image.addEventListener('error', markLoaded, { once: true });
	}

	return {
		destroy() {
			image.removeEventListener('load', markLoaded);
			image.removeEventListener('error', markLoaded);
		}
	};
};
