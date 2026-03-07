export type HeadingKind = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type Heading = {
	index: number;
	ref: Element;
	kind: HeadingKind;
	id?: string;
	level: number;
	label: string;
	active: boolean;
	children: Heading[];
};

export const INDEX_ATTRIBUTE = 'data-toc-index';

const ACTIVE_HEADING_OFFSET = 140;
const BOTTOM_SCROLL_EPSILON = 4;

/** A hook for generating a table of contents using the page content.
 *
 * ## Usage
 * ```svelte
 * <script lang="ts">
 * 		const toc = new UseToc();
 * </script>
 *
 * <div bind:this={toc.ref} style="display: contents;">
 * 		<h1>Table of Contents</h1>
 * 		<h2>Usage</h2>
 * </div>
 * ```
 */
export class UseToc {
	#ref = $state<HTMLElement>();
	#toc = $state<Heading[]>([]);

	// This sets everything up once #ref is bound
	set ref(ref: HTMLElement | undefined) {
		this.#ref = ref;

		if (!this.#ref) return;

		this.#toc = getToc(this.#ref);

		// should detect if a heading is added / removed / updated
		const mutationObserver = new MutationObserver(() => {
			if (!this.#ref) return;

			this.#toc = getToc(this.#ref);
		});

		mutationObserver.observe(this.#ref, { childList: true, subtree: true });

		const resetActiveHeading = (headings: Heading[]) => {
			for (let i = 0; i < headings.length; i++) {
				headings[i].active = false;

				resetActiveHeading(headings[i].children);
			}
		};

		const setHeadingActive = (headings: Heading[], index: number) => {
			for (let i = 0; i < headings.length; i++) {
				if (index === headings[i].index) {
					headings[i].active = true;
					break;
				}

				setHeadingActive(headings[i].children, index);
			}
		};

		// reactive to the table of contents
		$effect(() => {
			// Flatten all headings for easier access
			const flattenHeadings = (headings: Heading[]): Heading[] => {
				const result: Heading[] = [];
				for (const h of headings) {
					result.push(h);
					result.push(...flattenHeadings(h.children));
				}
				return result;
			};

			const toc = this.#toc;
			const allHeadings = flattenHeadings(toc);

			if (allHeadings.length === 0) return;

			let frame = 0;

			const updateActiveHeading = () => {
				const scrolledToBottom =
					window.innerHeight + window.scrollY >=
					document.documentElement.scrollHeight - BOTTOM_SCROLL_EPSILON;

				let activeHeading: Heading | undefined;

				if (scrolledToBottom) {
					activeHeading = allHeadings.at(-1);
				} else {
					activeHeading =
						allHeadings.findLast(
							(heading) => heading.ref.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET
						) ??
						allHeadings.find(
							(heading) => heading.ref.getBoundingClientRect().top >= ACTIVE_HEADING_OFFSET
						) ??
						allHeadings[0];
				}

				if (!activeHeading) return;

				resetActiveHeading(toc);
				setHeadingActive(toc, activeHeading.index);
			};

			const scheduleUpdate = () => {
				if (frame) return;

				frame = window.requestAnimationFrame(() => {
					frame = 0;
					updateActiveHeading();
				});
			};

			window.addEventListener('scroll', scheduleUpdate, { passive: true });
			window.addEventListener('resize', scheduleUpdate);

			scheduleUpdate();

			return () => {
				window.removeEventListener('scroll', scheduleUpdate);
				window.removeEventListener('resize', scheduleUpdate);

				if (frame) {
					window.cancelAnimationFrame(frame);
				}
			};
		});
	}

	get ref() {
		return this.#ref;
	}

	/** The generated table of contents */
	get current() {
		return this.#toc;
	}
}

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
		active: false,
		children: []
	};
};

/** Gets all of the headings contained in the provided element and create a table of contents.
 *
 * @param el
 * @returns
 */
const getToc = (el: HTMLElement): Heading[] => {
	const headings = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h, i) =>
		createHeading(h as HTMLHeadingElement, i)
	);

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
