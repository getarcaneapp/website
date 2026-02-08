import type { EnvConfig } from '$lib/types/env-config.type.js';

export const envConfig: EnvConfig[] = [
	{
		name: 'APP_URL',
		description: 'The URL arcane runs on',
		defaultValue: 'http://localhost:3552'
	},
	{
		name: 'PORT',
		description: 'The port arcane should run on',
		defaultValue: '3552'
	},
	{
		name: 'LISTEN',
		description: 'Interface the agent binds to (IP/hostname). Leave empty to bind all interfaces.',
		defaultValue: '(all interfaces)',
		exampleValue: '127.0.0.1'
	},
	{
		name: 'DATABASE_URL',
		description: 'The database connection string (SQLite by default)',
		defaultValue:
			'file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate'
	},
	{
		name: 'PROJECTS_DIRECTORY',
		description: 'Root directory Arcane scans for project definitions',
		defaultValue: '/app/data/projects'
	},
	{
		name: 'GIT_WORK_DIR',
		description: 'The directory where git repositories are stored',
		defaultValue: 'data/git'
	},
	{
		name: 'ENVIRONMENT',
		description: 'The application environment (production, development, test)',
		defaultValue: 'production'
	},
	{
		name: 'DEV_BACKEND_URL',
		description: 'The url of the backend for development',
		defaultValue: 'http://localhost:3552'
	},
	{
		name: 'JWT_SECRET',
		description: 'Session secret',
		defaultValue: 'default-jwt-secret-change-me',
		exampleValue: 'your-jwt-secret'
	},
	{
		name: 'ENCRYPTION_KEY',
		description: 'Encryption Key for secure stored sensitive data',
		defaultValue: 'arcane-dev-key-32-characters!!!',
		exampleValue: 'your-32-byte-key'
	},
	{
		name: 'OIDC_ENABLED',
		description: 'Enable OIDC authentication',
		defaultValue: 'false'
	},
	{
		name: 'OIDC_CLIENT_ID',
		description: 'OIDC Client ID',
		defaultValue: ''
	},
	{
		name: 'OIDC_CLIENT_SECRET',
		description: 'OIDC Client Secret',
		defaultValue: ''
	},
	{
		name: 'OIDC_ISSUER_URL',
		description: 'OIDC Issuer URL (e.g. https://accounts.google.com)',
		defaultValue: ''
	},
	{
		name: 'OIDC_SCOPES',
		description: 'OIDC Scopes',
		defaultValue: 'openid email profile'
	},
	{
		name: 'OIDC_ADMIN_CLAIM',
		description: 'Claim to identify admin users',
		defaultValue: ''
	},
	{
		name: 'OIDC_ADMIN_VALUE',
		description: 'Value of the admin claim for admin users',
		defaultValue: ''
	},
	{
		name: 'OIDC_SKIP_TLS_VERIFY',
		description: 'Skip TLS verification for OIDC provider',
		defaultValue: 'false'
	},
	{
		name: 'OIDC_AUTO_REDIRECT_TO_PROVIDER',
		description: 'Automatically redirect users to the OIDC provider',
		defaultValue: 'false'
	},
	{
		name: 'OIDC_PROVIDER_NAME',
		description: 'Provider display name shown on the login screen',
		defaultValue: ''
	},
	{
		name: 'OIDC_PROVIDER_LOGO_URL',
		description: 'Provider logo URL shown on the login screen',
		defaultValue: ''
	},
	{
		name: 'DOCKER_HOST',
		description: 'Docker daemon socket or host',
		defaultValue: 'unix:///var/run/docker.sock',
		exampleValue: 'tcp://docker-socket-proxy:2375'
	},
	{
		name: 'PUID',
		description: 'File owner user ID',
		defaultValue: '1000',
		exampleValue: '2000'
	},
	{
		name: 'PGID',
		description: 'File owner group ID',
		defaultValue: '1000',
		exampleValue: '2000'
	},
	{
		name: 'DOCKER_GID',
		description: 'Only set this manually if the autodetected GID is incorrect',
		defaultValue: '(auto)'
	},
	{
		name: 'FILE_PERM',
		description: 'File permissions for creating files',
		defaultValue: '0644'
	},
	{
		name: 'DIR_PERM',
		description: 'Directory permissions for creating directories',
		defaultValue: '0755'
	},
	{
		name: 'AGENT_MODE',
		description: 'Run in agent mode',
		defaultValue: 'false'
	},
	{
		name: 'AGENT_TOKEN',
		description: 'Token for agent authentication',
		defaultValue: ''
	},
	{
		name: 'MANAGER_API_URL',
		description: 'URL of the manager API (required in agent mode)',
		defaultValue: ''
	},
	{
		name: 'LOG_JSON',
		description: 'Enable JSON logging',
		defaultValue: 'false'
	},
	{
		name: 'LOG_LEVEL',
		description: 'Logging level',
		defaultValue: 'info',
		exampleValue: 'debug'
	},
	{
		name: 'UPDATE_CHECK_DISABLED',
		description: 'Disable automatic update checks',
		defaultValue: 'false'
	},
	{
		name: 'UI_CONFIGURATION_DISABLED',
		description: 'Disables UI-based settings changes; forces env-driven configuration',
		defaultValue: 'false'
	},
	{
		name: 'ANALYTICS_DISABLED',
		description: 'Disable analytics',
		defaultValue: 'false'
	},
	{
		name: 'GPU_MONITORING_ENABLED',
		description: 'Enable GPU monitoring',
		defaultValue: 'false'
	},
	{
		name: 'GPU_TYPE',
		description: 'Type of GPU (auto, nvidia, intel, amd)',
		defaultValue: 'auto'
	},
	{
		name: 'EDGE_AGENT',
		description: 'Enable edge agent mode',
		defaultValue: 'false'
	},
	{
		name: 'EDGE_RECONNECT_INTERVAL',
		description: 'Edge agent reconnect interval in seconds',
		defaultValue: '5'
	},
	{
		name: 'ARCANE_BACKUP_VOLUME_NAME',
		description: 'Name of the Docker volume used for backups',
		defaultValue: 'arcane-backups'
	},
	{
		name: 'DOCKER_API_TIMEOUT',
		description: 'Docker API timeout in seconds (0 uses internal defaults)',
		defaultValue: '0'
	},
	{
		name: 'DOCKER_IMAGE_PULL_TIMEOUT',
		description: 'Docker image pull timeout in seconds (0 uses internal defaults)',
		defaultValue: '0'
	},
	{
		name: 'GIT_OPERATION_TIMEOUT',
		description: 'Git operation timeout in seconds (0 uses internal defaults)',
		defaultValue: '0'
	},
	{
		name: 'HTTP_CLIENT_TIMEOUT',
		description: 'HTTP client timeout in seconds (0 uses internal defaults)',
		defaultValue: '0'
	},
	{
		name: 'REGISTRY_TIMEOUT',
		description: 'Registry request timeout in seconds (0 uses internal defaults)',
		defaultValue: '0'
	},
	{
		name: 'PROXY_REQUEST_TIMEOUT',
		description: 'Proxy request timeout in seconds (0 uses internal defaults)',
		defaultValue: '0'
	}
];
