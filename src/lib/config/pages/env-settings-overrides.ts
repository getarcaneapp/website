import type { EnvSettingOverride } from '$lib/types/env-settings-override.type.js';

export const envSettingsOverrides: EnvSettingOverride[] = [
	{
		env: 'PROJECTS_DIRECTORY',
		settingKey: 'projectsDirectory',
		description: 'Root directory Arcane scans for project definitions',
		defaultValue: '/app/data/projects'
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
		defaultValue: 'false',
		requires: 'AGENT_MODE=true or UI_CONFIGURATION_DISABLED=true'
	},
	{
		env: 'AUTO_UPDATE_INTERVAL',
		settingKey: 'autoUpdateInterval',
		description: 'Cron schedule for update checks (6-field)',
		defaultValue: '0 0 0 * * *',
		requires: 'AUTO_UPDATE=true'
	},
	{
		env: 'POLLING_ENABLED',
		settingKey: 'pollingEnabled',
		description: 'Enable background polling of Docker state (true/false)',
		defaultValue: 'true'
	},
	{
		env: 'POLLING_INTERVAL',
		settingKey: 'pollingInterval',
		description: 'Cron schedule for polling Docker state (6-field)',
		defaultValue: '0 0 * * * *'
	},
	{
		env: 'EVENT_CLEANUP_INTERVAL',
		settingKey: 'eventCleanupInterval',
		description: 'Cron schedule for cleaning up old events (6-field)',
		defaultValue: '0 0 */6 * * *'
	},
	{
		env: 'ANALYTICS_HEARTBEAT_INTERVAL',
		settingKey: 'analyticsHeartbeatInterval',
		description: 'Cron schedule for analytics heartbeat (6-field)',
		defaultValue: '0 0 0 * * *'
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
		env: 'SCHEDULED_PRUNE_ENABLED',
		settingKey: 'scheduledPruneEnabled',
		description: 'Enable scheduled pruning',
		defaultValue: 'false'
	},
	{
		env: 'SCHEDULED_PRUNE_INTERVAL',
		settingKey: 'scheduledPruneInterval',
		description: 'Cron schedule for scheduled pruning (6-field)',
		defaultValue: '0 0 0 * * *'
	},
	{
		env: 'SCHEDULED_PRUNE_CONTAINERS',
		settingKey: 'scheduledPruneContainers',
		description: 'Include containers in scheduled prune',
		defaultValue: 'true'
	},
	{
		env: 'SCHEDULED_PRUNE_IMAGES',
		settingKey: 'scheduledPruneImages',
		description: 'Include images in scheduled prune',
		defaultValue: 'true'
	},
	{
		env: 'SCHEDULED_PRUNE_VOLUMES',
		settingKey: 'scheduledPruneVolumes',
		description: 'Include volumes in scheduled prune',
		defaultValue: 'false'
	},
	{
		env: 'SCHEDULED_PRUNE_NETWORKS',
		settingKey: 'scheduledPruneNetworks',
		description: 'Include networks in scheduled prune',
		defaultValue: 'true'
	},
	{
		env: 'SCHEDULED_PRUNE_BUILD_CACHE',
		settingKey: 'scheduledPruneBuildCache',
		description: 'Include build cache in scheduled prune',
		defaultValue: 'false'
	},
	{
		env: 'BASE_SERVER_URL',
		settingKey: 'baseServerUrl',
		description: 'Public base URL used for opening links to docker services',
		defaultValue: 'http://localhost'
	},
	{
		env: 'ENABLE_GRAVATAR',
		settingKey: 'enableGravatar',
		description: 'Enable fetching user avatars from Gravatar (true/false)',
		defaultValue: 'true'
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
		description: 'Enable local (username/password) authentication (true/false)',
		defaultValue: 'true'
	},
	{
		env: 'AUTH_SESSION_TIMEOUT',
		settingKey: 'authSessionTimeout',
		description: 'Session idle timeout in minutes',
		defaultValue: '1440'
	},
	{
		env: 'AUTH_PASSWORD_POLICY',
		settingKey: 'authPasswordPolicy',
		description: 'Password policy identifier: basic | standard | strong',
		defaultValue: 'strong'
	},
	{
		env: 'TRIVY_IMAGE',
		settingKey: 'trivyImage',
		description: 'Trivy image used for vulnerability scanning',
		defaultValue: 'ghcr.io/aquasecurity/trivy:latest'
	},
	{
		env: 'AUTH_OIDC_CONFIG',
		settingKey: 'authOidcConfig',
		description: 'Raw OIDC provider JSON config (if not using discrete OIDC_* vars)',
		sensitive: true,
		deprecated: true,
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
		description: 'OIDC Issuer URL',
		defaultValue: ''
	},
	{
		env: 'OIDC_AUTHORIZATION_ENDPOINT',
		settingKey: 'oidcAuthorizationEndpoint',
		description: 'Override the OIDC authorization endpoint URL',
		defaultValue: ''
	},
	{
		env: 'OIDC_TOKEN_ENDPOINT',
		settingKey: 'oidcTokenEndpoint',
		description: 'Override the OIDC token endpoint URL',
		defaultValue: ''
	},
	{
		env: 'OIDC_USERINFO_ENDPOINT',
		settingKey: 'oidcUserinfoEndpoint',
		description: 'Override the OIDC userinfo endpoint URL',
		defaultValue: ''
	},
	{
		env: 'OIDC_JWKS_ENDPOINT',
		settingKey: 'oidcJwksEndpoint',
		description: 'Override the OIDC JWKS endpoint URL',
		defaultValue: ''
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
		description: 'Value of the admin claim for admin users',
		defaultValue: ''
	},
	{
		env: 'OIDC_SKIP_TLS_VERIFY',
		settingKey: 'oidcSkipTlsVerify',
		description: 'Skip TLS verification for OIDC provider',
		defaultValue: 'false'
	},
	{
		env: 'OIDC_AUTO_REDIRECT_TO_PROVIDER',
		settingKey: 'oidcAutoRedirectToProvider',
		description: 'Automatically redirect users to the OIDC provider',
		defaultValue: 'false'
	},
	{
		env: 'OIDC_MERGE_ACCOUNTS',
		settingKey: 'oidcMergeAccounts',
		description: 'Merge OIDC accounts with local accounts by email',
		defaultValue: 'false'
	},
	{
		env: 'OIDC_PROVIDER_NAME',
		settingKey: 'oidcProviderName',
		description: 'Provider display name shown on the login screen',
		defaultValue: ''
	},
	{
		env: 'OIDC_PROVIDER_LOGO_URL',
		settingKey: 'oidcProviderLogoUrl',
		description: 'Provider logo URL shown on the login screen',
		defaultValue: ''
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
		env: 'KEYBOARD_SHORTCUTS_ENABLED',
		settingKey: 'keyboardShortcutsEnabled',
		description: 'Enable keyboard shortcuts',
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
		description: 'Cron schedule for environment health checks (6-field)',
		defaultValue: '0 */2 * * * *'
	},
	{
		env: 'DOCKER_API_TIMEOUT',
		settingKey: 'dockerApiTimeout',
		description: 'Docker API timeout in seconds',
		defaultValue: '30'
	},
	{
		env: 'DOCKER_IMAGE_PULL_TIMEOUT',
		settingKey: 'dockerImagePullTimeout',
		description: 'Docker image pull timeout in seconds',
		defaultValue: '600'
	},
	{
		env: 'GIT_OPERATION_TIMEOUT',
		settingKey: 'gitOperationTimeout',
		description: 'Git operation timeout in seconds',
		defaultValue: '300'
	},
	{
		env: 'HTTP_CLIENT_TIMEOUT',
		settingKey: 'httpClientTimeout',
		description: 'HTTP client timeout in seconds',
		defaultValue: '30'
	},
	{
		env: 'REGISTRY_TIMEOUT',
		settingKey: 'registryTimeout',
		description: 'Registry request timeout in seconds',
		defaultValue: '30'
	},
	{
		env: 'PROXY_REQUEST_TIMEOUT',
		settingKey: 'proxyRequestTimeout',
		description: 'Proxy request timeout in seconds',
		defaultValue: '60'
	},
	{
		env: 'INSTANCE_ID',
		settingKey: 'instanceId',
		description: 'Unique instance identifier',
		defaultValue: ''
	}
];
