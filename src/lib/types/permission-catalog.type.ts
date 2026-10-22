export type PermissionEndpointRef = {
	method: string;
	path: string;
	summary?: string;
	action?: { param: string; value: string };
};

export type PermissionAction = {
	key: string;
	permission: string;
	label: string;
	description: string;
	requires: string[];
	requiresExpanded: string[];
	endpoints: PermissionEndpointRef[];
};

export type PermissionResource = {
	key: string;
	label: string;
	description: string;
	scope: string;
	actions: PermissionAction[];
};

export type PermissionCondition = {
	in: string;
	field: string;
	value: string;
	permission: string;
};

export type PermissionEndpoint = {
	method: string;
	path: string;
	summary?: string;
	access: string;
	permission?: string;
	actionParam?: string;
	actionPermissions?: Record<string, string>;
	globalAdmin?: boolean;
	conditionalPermissions?: PermissionCondition[];
};

export type PermissionCatalog = {
	resources: PermissionResource[];
	endpoints: PermissionEndpoint[];
};
