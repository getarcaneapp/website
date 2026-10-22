type Node = {
	type: string;
	children?: Node[];
	data?: Record<string, unknown>;
	[key: string]: unknown;
};

/* Wraps every Markdown table in a horizontal scroller, so a table whose columns can't shrink any
   further scrolls inside its own box instead of being squeezed or running off the page. */
export const tablesPlugin = {
	name: 'arcane-tables',
	table(node: Node) {
		if (node.data?.arcaneScroll) return;
		return {
			type: 'paragraph',
			data: { hName: 'div', hProperties: { class: 'table-scroll' } },
			children: [{ ...node, data: { ...node.data, arcaneScroll: true } }]
		};
	}
};
