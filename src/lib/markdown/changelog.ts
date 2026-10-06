type Node = {
	type: string;
	value?: string;
	url?: string;
	depth?: number;
	children?: Node[];
	data?: Record<string, unknown>;
	[key: string]: unknown;
};

type Ctx = {
	fileURL: URL | undefined;
	parent: (node: Node) => Node | undefined;
	replaceNode: (node: Node, replacement: Node | Node[]) => void;
	textContent: (node: Node) => string;
};

const REPO_URL = 'https://github.com/getarcaneapp/arcane';
const MENTION = /\(#(\d+)\)|\(@([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\[bot\])?)\)/g;
const VERSION_HEADING = /^v?\d+\.\d+/i;

const isChangelog = (ctx: Ctx) =>
	ctx.fileURL?.pathname.includes('/src/content/changelog/') ?? false;

const element = (tagName: string, properties: Record<string, unknown>, children: Node[]): Node => ({
	type: 'paragraph',
	data: { hName: tagName, hProperties: properties },
	children
});

const link = (url: string, children: Node[]): Node => ({
	type: 'link',
	url,
	children,
	data: { hProperties: { target: '_blank', rel: 'noopener noreferrer' } }
});

function insideLink(node: Node, ctx: Ctx) {
	for (let parent = ctx.parent(node); parent; parent = ctx.parent(parent)) {
		if (parent.type === 'link') return true;
	}
	return false;
}

function classify(label: string) {
	const text = label.toLowerCase();
	if (text.includes('feature')) return 'features';
	if (text.includes('fix') || text.includes('bug')) return 'fixes';
	if (text.includes('dependenc')) return 'deps';
	if (text.includes('security')) return 'security';
	if (text.includes('refactor')) return 'refactor';
	if (text.includes('other') || text.includes('performance')) return 'other';
	return 'general';
}

const linkPlugin = {
	name: 'arcane-changelog-links',
	inlineCode(node: Node, ctx: Ctx) {
		if (!isChangelog(ctx) || insideLink(node, ctx)) return;
		const hash = node.value?.trim() ?? '';
		if (!/^[a-f0-9]{7,40}$/i.test(hash)) return;
		return link(`${REPO_URL}/commit/${hash}`, [{ type: 'inlineCode', value: node.value }]);
	},
	text(node: Node, ctx: Ctx) {
		if (!isChangelog(ctx) || !node.value || insideLink(node, ctx)) return;
		const value = node.value;
		const matches = [...value.matchAll(MENTION)];
		if (!matches.length) return;

		const parts: Node[] = [];
		let last = 0;
		for (const match of matches) {
			const index = match.index ?? 0;
			if (index > last) parts.push({ type: 'text', value: value.slice(last, index) });
			parts.push({ type: 'text', value: '(' });
			if (match[1]) {
				parts.push(link(`${REPO_URL}/pull/${match[1]}`, [{ type: 'text', value: `#${match[1]}` }]));
			} else {
				const handle = match[2];
				parts.push(
					link(`https://github.com/${handle.replace(/\[bot]$/, '')}`, [
						{ type: 'text', value: `@${handle}` }
					])
				);
			}
			parts.push({ type: 'text', value: ')' });
			last = index + match[0].length;
		}
		if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
		ctx.replaceNode(node, parts);
	},
	heading(node: Node, ctx: Ctx) {
		if (!isChangelog(ctx) || node.depth !== 3) return;
		return {
			...node,
			children: node.children,
			data: { ...node.data, hProperties: { 'data-kind': classify(ctx.textContent(node)) } }
		};
	}
};

function releaseLink(node: Node, ctx: Ctx) {
	if (node.type !== 'paragraph' || node.children?.length !== 1) return undefined;
	const [child] = node.children;
	if (child.type !== 'link' || ctx.textContent(child).trim().toLowerCase() !== 'release')
		return undefined;
	return child.url;
}

const sectionPlugin = {
	name: 'arcane-changelog-sections',
	after(root: Node, ctx: Ctx) {
		if (!isChangelog(ctx)) return;
		const children = root.children ?? [];
		const output: Node[] = [];
		let current: { heading: Node; url?: string; body: Node[] } | undefined;

		const flush = () => {
			if (!current) return;
			const summary: Node[] = [current.heading];
			if (current.url) {
				summary.push(
					element(
						'a',
						{
							class: 'release-link',
							href: current.url,
							target: '_blank',
							rel: 'noopener noreferrer'
						},
						[{ type: 'text', value: 'Release' }]
					)
				);
			}
			output.push(
				element('details', { class: 'release', 'data-release': '' }, [
					element('summary', { class: 'release-summary' }, summary),
					element('div', { class: 'release-notes' }, current.body)
				])
			);
			current = undefined;
		};

		for (const node of children) {
			if (
				node.type === 'heading' &&
				node.depth === 2 &&
				VERSION_HEADING.test(ctx.textContent(node))
			) {
				flush();
				current = { heading: node, body: [] };
				continue;
			}
			if (current) {
				const url = !current.url && !current.body.length ? releaseLink(node, ctx) : undefined;
				if (url) current.url = url;
				else current.body.push(node);
				continue;
			}
			output.push(node);
		}
		flush();

		ctx.replaceNode(root, { type: 'root', children: output });
	}
};

export const changelogPlugins = [linkPlugin, sectionPlugin];
