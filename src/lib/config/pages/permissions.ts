import type { PermissionCatalog } from '#lib/types/permission-catalog.type.js';
import catalog from '../../../../static/permissions.json' with { type: 'json' };

const PERMISSIONS = catalog as PermissionCatalog;

export const permissionResources = PERMISSIONS.resources;

export const permissionEndpoints = PERMISSIONS.endpoints;

export const permissionCount = PERMISSIONS.resources.reduce(
	(total, resource) => total + resource.actions.length,
	0
);
