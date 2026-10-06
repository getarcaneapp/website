import { createRequire } from 'node:module';
import { getIconData, iconToHTML, iconToSVG } from '@iconify/utils';

type Node = {
	type: string;
	value?: string;
	label?: string;
	identifier?: string;
	children?: Node[];
	data?: Record<string, unknown>;
	[key: string]: unknown;
};

type Ctx = { sourceFormat: 'markdown' | 'mdx' };

const require = createRequire(import.meta.url);

function iconify(id: string) {
	const [prefix, name] = id.split(':');
	const data = getIconData(
		require(`@iconify/json/json/${prefix}.json`) as Parameters<typeof getIconData>[0],
		name
	);
	if (!data) throw new Error(`Unknown Iconify icon ${id}`);
	const { attributes, body } = iconToSVG(data);
	return iconToHTML(body, {
		...attributes,
		width: '16',
		height: '16',
		class: 'starlight-aside__icon',
		'aria-hidden': 'true'
	});
}

const CALLOUTS: Record<string, { variant: string; title: string; icon: string }> = {
	note: { variant: 'note', title: 'Note', icon: 'pepicons-pop:info-circle' },
	tip: { variant: 'tip', title: 'Tip', icon: 'solar:lightbulb-minimalistic-linear' },
	important: { variant: 'important', title: 'Important', icon: 'mdi:alert-decagram' },
	warning: { variant: 'caution', title: 'Warning', icon: 'solar:danger-triangle-linear' },
	caution: { variant: 'danger', title: 'Caution', icon: 'solar:danger-circle-linear' }
};

const ICONS = Object.fromEntries(Object.values(CALLOUTS).map(({ icon }) => [icon, iconify(icon)]));

const MARKER = /^\[!(note|tip|important|warning|caution)\][ \t]*\n?/i;

const element = (tagName: string, properties: Record<string, unknown>, children: Node[]): Node => ({
	type: 'paragraph',
	data: { hName: tagName, hProperties: properties },
	children
});

function readMarker(paragraph: Node): { type: string; rest: Node[] } | undefined {
	const [first, ...others] = paragraph.children ?? [];
	if (!first) return;

	if (first.type === 'linkReference') {
		const label = (first.label ?? first.identifier ?? '').toLowerCase();
		const type = label.replace(/^!/, '');
		if (!label.startsWith('!') || !(type in CALLOUTS)) return;
		const [next, ...after] = others;
		if (next?.type === 'text' && next.value) {
			const value = next.value.replace(/^[ \t]*\n?/, '');
			return { type, rest: value ? [{ ...next, value }, ...after] : after };
		}
		return { type, rest: others };
	}

	if (first.type === 'text' && first.value) {
		const match = first.value.match(MARKER);
		if (!match) return;
		const value = first.value.slice(match[0].length);
		return {
			type: match[1].toLowerCase(),
			rest: value ? [{ ...first, value }, ...others] : others
		};
	}
}

function trimLeadingBreak(nodes: Node[]): Node[] {
	const [first, ...rest] = nodes;
	if (first?.type === 'break') return rest;
	return nodes;
}

export const calloutsPlugin = {
	name: 'arcane-callouts',
	blockquote(node: Node, ctx: Ctx) {
		const [paragraph, ...blocks] = node.children ?? [];
		if (paragraph?.type !== 'paragraph') return;
		const marker = readMarker(paragraph);
		if (!marker) return;

		const config = CALLOUTS[marker.type];
		const iconSvg = ICONS[config.icon];
		const icon: Node =
			ctx.sourceFormat === 'mdx'
				? {
						type: 'mdxJsxTextElement',
						name: 'Fragment',
						attributes: [{ type: 'mdxJsxAttribute', name: 'set:html', value: iconSvg }],
						children: []
					}
				: { type: 'html', value: iconSvg };

		const rest = trimLeadingBreak(marker.rest);
		const content = rest.length ? [{ ...paragraph, children: rest }, ...blocks] : blocks;

		return element(
			'aside',
			{
				'aria-label': config.title,
				class: `starlight-aside starlight-aside--${config.variant}`
			},
			[
				element('p', { class: 'starlight-aside__title', 'aria-hidden': 'true' }, [
					icon,
					{ type: 'text', value: config.title }
				]),
				element('div', { class: 'starlight-aside__content' }, content)
			]
		);
	}
};
