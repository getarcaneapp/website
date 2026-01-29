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
		name: 'DATABASE_URL',
		description: 'The database connection string (SQLite by default)',
		defaultValue: 'file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate'
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
		defaultValue: '',
		exampleValue: 'your-jwt-secret'
	},
	{
		name: 'ENCRYPTION_KEY',
		description: 'Encryption Key for secure stored sensitive data',
		defaultValue: '',
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
	}
];
