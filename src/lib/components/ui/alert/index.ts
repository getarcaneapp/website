import type { ComponentProps } from 'svelte';
import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

type AlertVariant = ComponentProps<typeof Root>['variant'];

export {
	Root,
	Description,
	Title,
	//
	type AlertVariant,
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle
};
