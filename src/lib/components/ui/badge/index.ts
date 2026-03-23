import type { ComponentProps } from 'svelte';
import Badge from './badge.svelte';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

export { Badge, Badge as default, type BadgeVariant };
