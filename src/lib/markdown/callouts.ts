/**
 * Build-time GitHub-style callouts for mdsvex.
 *
 * Turns `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` and `[!CAUTION]` blockquotes into
 * `<blockquote data-callout="note">` with the marker stripped, so the markdown `blockquote`
 * component can pick its variant from a prop instead of inspecting the DOM.
 */

type MdNode = {
	type: string;
	value?: string;
	label?: string;
	children?: MdNode[];
	data?: { hProperties?: Record<string, unknown> } & Record<string, unknown>;
};

const TYPES = new Set(['note', 'tip', 'important', 'warning', 'caution']);

function visit(node: MdNode) {
	if (node.type === 'blockquote') markCallout(node);
	for (const child of node.children ?? []) visit(child);
}

function markCallout(blockquote: MdNode) {
	const paragraph = blockquote.children?.[0];
	// mdsvex's remark parses `[!NOTE]` as a shortcut link reference labelled `!NOTE`.
	const marker = paragraph?.type === 'paragraph' ? paragraph.children?.[0] : undefined;
	if (!paragraph?.children || marker?.type !== 'linkReference' || !marker.label) return;

	const type = marker.label.replace(/^!/, '').toLowerCase();
	if (!marker.label.startsWith('!') || !TYPES.has(type)) return;

	paragraph.children.shift();
	const next = paragraph.children[0];
	if (next?.type === 'text' && next.value) {
		next.value = next.value.replace(/^[ \t]*\n?/, '');
		if (!next.value) paragraph.children.shift();
	}
	if (!paragraph.children.length) blockquote.children?.shift();

	blockquote.data = {
		...blockquote.data,
		hProperties: { ...blockquote.data?.hProperties, 'data-callout': type }
	};
}

export function remarkCallouts() {
	return (tree: MdNode) => visit(tree);
}
