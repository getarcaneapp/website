import type { EnvSettingOverride } from '$lib/types/env-settings-override.type.js';

export const envSettingsOverrides: EnvSettingOverride[] = [
	{
		env: 'PROJECTS_DIRECTORY',
		settingKey: 'projectsDirectory',
		description:
			'Root directory Arcane scans for project definitions (compose files, etc.)',
		requires: 'AGENT_MODE=true or UI_CONFIGURATION_DISABLE=true',
	},
	{
		env: 'AUTO_UPDATE',
		settingKey: 'autoUpdate',
		description:
			'Enable automatic updates of Arcane core and agents (true/false)',
		requires: 'AGENT_MODE=true or UI_CONFIGURATION_DISABLE=true',
	},
	{
		env: 'AUTO_UPDATE_INTERVAL',
		settingKey: 'autoUpdateInterval',
		description:
			'Interval (minutes) to check for updates when auto update is enabled',
		requires: 'AUTO_UPDATE=true',
	},
	{
		env: 'POLLING_ENABLED',
		settingKey: 'pollingEnabled',
		description: 'Enable background polling of Docker state (true/false)',
	},
	{
		env: 'POLLING_INTERVAL',
		settingKey: 'pollingInterval',
		description: 'Polling interval in minutes',
	},
	{
		env: 'DOCKER_PRUNE_MODE',
		settingKey: 'dockerPruneMode',
		description: 'Prune strategy: all | dangling',
		note: 'Matches UI selectable prune modes',
	},
	{
		env: 'BASE_SERVER_URL',
		settingKey: 'baseServerUrl',
		description: 'Public base URL used for opening links to docker services',
	},
	{
		env: 'ENABLE_GRAVATAR',
		settingKey: 'enableGravatar',
		description: 'Enable fetching user avatars from Gravatar (true/false)',
	},
	{
		env: 'AUTH_LOCAL_ENABLED',
		settingKey: 'authLocalEnabled',
		description: 'Enable local (username/password) authentication (true/false)',
	},
	{
		env: 'OIDC_ENABLED',
		settingKey: 'authOidcEnabled',
		description: 'Enable OIDC login (mirrors existing OIDC_ENABLED variable)',
		note: 'OIDC_ENABLED feeds both bootstrap and runtime config',
	},
	{
		env: 'AUTH_SESSION_TIMEOUT',
		settingKey: 'authSessionTimeout',
		description: 'Session idle timeout in minutes',
	},
	{
		env: 'AUTH_PASSWORD_POLICY',
		settingKey: 'authPasswordPolicy',
		description: 'Password policy identifier: basic | standard | strong',
	},
	{
		env: 'AUTH_OIDC_CONFIG',
		settingKey: 'authOidcConfig',
		description:
			'Raw OIDC provider JSON config (if not using discrete OIDC_* vars)',
		sensitive: true,
		note: 'Overrides discrete OIDC_CLIENT_ID / OIDC_CLIENT_SECRET when present, recommended to use the OIDC vars above.',
	},
];
