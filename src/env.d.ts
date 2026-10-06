declare module 'virtual:icons/*' {
	import type { Component } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';

	type IconProps = SVGAttributes<SVGSVGElement> & Record<`data-${string}`, unknown>;
	const component: Component<IconProps> & ((props: IconProps) => unknown);
	export default component;
}
