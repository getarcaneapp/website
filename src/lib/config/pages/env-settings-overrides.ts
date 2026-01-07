import type { EnvSettingOverride } from '$lib/types/env-settings-override.type.js';

export const envSettingsOverrides: EnvSettingOverride[] = [
	{
		env: 'PROJECTS_DIRECTORY',
		settingKey: 'projectsDirectory',
		description: 'Root directory Arcane scans for project definitions'
	},
	{
		env: 'DISK_USAGE_PATH',
		settingKey: 'diskUsagePath',
		description: 'Path used to calculate disk usage stats',
		defaultValue: '/app/data/projects'
	},
	{
		env: 'AUTO_UPDATE',
		settingKey: 'autoUpdate',
		description: 'Enable automatic updates of Arcane core and agents (true/false)',
		requires: 'AGENT_MODE=true or UI_CONFIGURATION_DISABLE=true'
	},
	{
		env: 'AUTO_UPDATE_INTERVAL',
		settingKey: 'autoUpdateInterval',
		description: 'Interval (minutes) to check for updates when auto update is enabled',
		requires: 'AUTO_UPDATE=true'
	},
	{
		env: 'POLLING_ENABLED',
		settingKey: 'pollingEnabled',
		description: 'Enable background polling of Docker state (true/false)'
	},
	{
		env: 'POLLING_INTERVAL',
		settingKey: 'pollingInterval',
		description: 'Polling interval in minutes'
	},
	{
		env: 'EVENT_CLEANUP_INTERVAL',
		settingKey: 'eventCleanupInterval',
		description: 'Interval (minutes) to cleanup old events',
		defaultValue: '360'
	},
	{
		env: 'ANALYTICS_HEARTBEAT_INTERVAL',
		settingKey: 'analyticsHeartbeatInterval',
		description: 'Interval (minutes) for analytics heartbeat',
		defaultValue: '1440'
	},
	{
		env: 'AUTO_INJECT_ENV',
		settingKey: 'autoInjectEnv',
		description: 'Automatically inject environment variables into containers',
		defaultValue: 'false'
	},
	{
		env: 'PRUNE_MODE',
		settingKey: 'pruneMode',
		description: 'Prune strategy: all | dangling',
		note: 'Matches UI selectable prune modes',
		defaultValue: 'dangling'
	},
	{
		env: 'BASE_SERVER_URL',
		settingKey: 'baseServerUrl',
		description: 'Public base URL used for opening links to docker services'
	},
	{
		env: 'ENABLE_GRAVATAR',
		settingKey: 'enableGravatar',
		description: 'Enable fetching user avatars from Gravatar (true/false)'
	},
	{
		env: 'DEFAULT_SHELL',
		settingKey: 'defaultShell',
		description: 'Default shell to use for container exec',
		defaultValue: '/bin/sh'
	},
	{
		env: 'DOCKER_HOST',
		settingKey: 'dockerHost',
		description: 'Docker host override',
		defaultValue: 'unix:///var/run/docker.sock'
	},
	{
		env: 'AUTH_LOCAL_ENABLED',
		settingKey: 'authLocalEnabled',
		description: 'Enable local (username/password) authentication (true/false)'
	},
	{
		env: 'AUTH_SESSION_TIMEOUT',
		settingKey: 'authSessionTimeout',
		description: 'Session idle timeout in minutes'
	},
	{
		env: 'AUTH_PASSWORD_POLICY',
		settingKey: 'authPasswordPolicy',
		description: 'Password policy identifier: basic | standard | strong'
	},
	{
		env: 'AUTH_OIDC_CONFIG',
		settingKey: 'authOidcConfig',
		description: 'Raw OIDC provider JSON config (if not using discrete OIDC_* vars)',
		sensitive: true,
		note: 'DEPRECATED: Overrides discrete OIDC_CLIENT_ID / OIDC_CLIENT_SECRET when present.'
	},
	{
		env: 'OIDC_ENABLED',
		settingKey: 'oidcEnabled',
		description: 'Enable OIDC login',
		note: 'OIDC_ENABLED feeds both bootstrap and runtime config'
	},
	{
		env: 'OIDC_CLIENT_ID',
		settingKey: 'oidcClientId',
		description: 'OIDC Client ID'
	},
	{
		env: 'OIDC_CLIENT_SECRET',
		settingKey: 'oidcClientSecret',
		description: 'OIDC Client Secret',
		sensitive: true
	},
	{
		env: 'OIDC_ISSUER_URL',
		settingKey: 'oidcIssuerUrl',
		description: 'OIDC Issuer URL'
	},
	{
		env: 'OIDC_SCOPES',
		settingKey: 'oidcScopes',
		description: 'OIDC Scopes',
		defaultValue: 'openid email profile'
	},
	{
		env: 'OIDC_ADMIN_CLAIM',
		settingKey: 'oidcAdminClaim',
		description: 'Claim to identify admin users'
	},
	{
		env: 'OIDC_ADMIN_VALUE',
		settingKey: 'oidcAdminValue',
		description: 'Value of the admin claim for admin users'
	},
	{
		env: 'OIDC_SKIP_TLS_VERIFY',
		settingKey: 'oidcSkipTlsVerify',
		description: 'Skip TLS verification for OIDC provider',
		defaultValue: 'false'
	},
	{
		env: 'OIDC_MERGE_ACCOUNTS',
		settingKey: 'oidcMergeAccounts',
		description: 'Merge OIDC accounts with local accounts by email',
		defaultValue: 'false'
	},
	{
		env: 'MOBILE_NAVIGATION_MODE',
		settingKey: 'mobileNavigationMode',
		description: 'Mobile navigation mode: floating | bottom | sidebar',
		defaultValue: 'floating'
	},
	{
		env: 'MOBILE_NAVIGATION_SHOW_LABELS',
		settingKey: 'mobileNavigationShowLabels',
		description: 'Show labels in mobile navigation',
		defaultValue: 'true'
	},
	{
		env: 'SIDEBAR_HOVER_EXPANSION',
		settingKey: 'sidebarHoverExpansion',
		description: 'Expand sidebar on hover',
		defaultValue: 'true'
	},
	{
		env: 'GLASS_EFFECT_ENABLED',
		settingKey: 'glassEffectEnabled',
		description: 'Enable glassmorphism effects in UI',
		defaultValue: 'true'
	},
	{
		env: 'ACCENT_COLOR',
		settingKey: 'accentColor',
		description: 'UI Accent color (oklch format)',
		defaultValue: 'oklch(0.606 0.25 292.717)'
	},
	{
		env: 'MAX_IMAGE_UPLOAD_SIZE',
		settingKey: 'maxImageUploadSize',
		description: 'Max image upload size in MB',
		defaultValue: '500'
	},
	{
		env: 'ENVIRONMENT_HEALTH_INTERVAL',
		settingKey: 'environmentHealthInterval',
		description: 'Interval (seconds) for environment health checks',
		defaultValue: '2'
	}
];
