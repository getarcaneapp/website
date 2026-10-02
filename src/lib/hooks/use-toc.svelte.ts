export type HeadingKind = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type Heading = {
	index: number;
	ref: Element;
	kind: HeadingKind;
	id?: string;
	level: number;
	label: string;
	children: Heading[];
};

const INDEX_ATTRIBUTE = 'data-toc-index';

const ACTIVE_HEADING_OFFSET = 140;
const BOTTOM_SCROLL_EPSILON = 4;

/** Builds a table of contents from the headings inside an element and tracks the active one.
 *
 * ## Usage
 * ```svelte
 * <script lang="ts">
 * 		const toc = new UseToc();
 * </script>
 *
 * <div {@attach toc.attach}>
 * 		<h1>Table of Contents</h1>
 * 		<h2>Usage</h2>
 * </div>
 * ```
 */
export class UseToc {
	#toc = $state<Heading[]>([]);
	#activeIndex = $state<number>();

	/** Attachment for the content element whose headings make up the table of contents. */
	attach = (node: HTMLElement) => {
		this.#toc = getToc(node);

		// Picks up headings that are added, removed, or hidden after the first render.
		const mutationObserver = new MutationObserver(() => {
			this.#toc = getToc(node);
		});
		mutationObserver.observe(node, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['hidden']
		});

		let frame = 0;
		const scheduleUpdate = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				this.#activeIndex = findActiveHeading(flattenHeadings(this.#toc))?.index;
			});
		};

		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		scheduleUpdate();

		return () => {
			mutationObserver.disconnect();
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			if (frame) window.cancelAnimationFrame(frame);
			this.#toc = [];
		};
	};

	/** The generated table of contents */
	get current() {
		return this.#toc;
	}

	/** `index` of the heading currently scrolled into view */
	get activeIndex() {
		return this.#activeIndex;
	}
}

const flattenHeadings = (headings: Heading[]): Heading[] =>
	headings.flatMap((heading) => [heading, ...flattenHeadings(heading.children)]);

const findActiveHeading = (headings: Heading[]): Heading | undefined => {
	const scrolledToBottom =
		window.innerHeight + window.scrollY >=
		document.documentElement.scrollHeight - BOTTOM_SCROLL_EPSILON;

	if (scrolledToBottom) return headings.at(-1);

	return (
		headings.findLast(
			(heading) => heading.ref.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET
		) ??
		headings.find((heading) => heading.ref.getBoundingClientRect().top >= ACTIVE_HEADING_OFFSET) ??
		headings[0]
	);
};

const createHeading = (element: HTMLHeadingElement, index: number): Heading => {
	const kind = element.tagName.toLowerCase() as HeadingKind;

	element.setAttribute(INDEX_ATTRIBUTE, index.toString());

	return {
		index,
		ref: element,
		kind,
		id: element.id,
		level: parseInt(kind[1]),
		label: element.innerText ?? '',
		children: []
	};
};

/** Gets all of the headings contained in the provided element and create a table of contents.
 *
 * @param el
 * @returns
 */
const getToc = (el: HTMLElement): Heading[] => {
	const headings = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'))
		.filter((heading) => !heading.closest('[hidden]'))
		.map((heading, index) => createHeading(heading as HTMLHeadingElement, index));

	if (headings.length === 0) return [];

	const toc: Heading[] = [];

	let i = 0;

	while (i < headings.length) {
		const heading = headings[i];

		const nextIndex = addChildren(headings, heading, i + 1);

		toc.push(heading);

		i = nextIndex;
	}

	return toc;
};

const addChildren = (headings: Heading[], base: Heading, index: number): number => {
	let i = index;

	while (i < headings.length) {
		const sub = headings[i];

		// example: h1 < h2 or h1 = h1
		if (sub.level <= base.level) break;

		const nextIndex = addChildren(headings, sub, i + 1);

		base.children.push(sub);

		i = nextIndex;
	}

	return i;
};
