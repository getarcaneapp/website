import type { EnvConfig } from '$lib/types/env-config.type.js';

export const envConfig: EnvConfig[] = [
	{
		name: 'APP_URL',
		description: 'The URL arcane runs on',
		value: 'http://localhost:3552'
	},
	{
		name: 'PORT',
		description: 'The port arcane should run on',
		value: '3552'
	},
	{
		name: 'DATABASE_URL',
		description: 'The database connection string (SQLite by default)',
		value: 'file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate'
	},
	{
		name: 'DEV_BACKEND_URL',
		description: 'The url of the backend for development',
		value: 'http://localhost:3552'
	},
	{
		name: 'PUID',
		description: 'File owner user ID',
		value: '2000'
	},
	{
		name: 'PGID',
		description: 'File owner group ID',
		value: '2000'
	},
	{
		name: 'DOCKER_GID',
		description: 'Only set this manually if the autodetected GID is incorrect',
		value: '(auto)'
	},
	{
		name: 'ENCRYPTION_KEY',
		description: 'Encryption Key for secure stored sensitive data',
		value: '-'
	},
	{
		name: 'JWT_SECRET',
		description: 'Session secret',
		value: '-'
	},
	{
		name: 'OIDC_ENABLED',
		description: 'Enable OIDC login',
		value: 'false'
	},
	{
		name: 'OIDC_CLIENT_ID',
		description: 'Client ID from your OIDC provider',
		value: 'your_arcane_client_id_from_provider'
	},
	{
		name: 'OIDC_CLIENT_SECRET',
		description: 'Client Secret from provider',
		value: 'your_client_secret_from_provider'
	},
	{
		name: 'OIDC_ISSUER_URL',
		description: 'Issuer URL from provider',
		value: 'https://your-provider.com'
	},
	{
		name: 'OIDC_SCOPES',
		description: 'Scopes to request',
		value: 'openid email profile (default)'
	}
];
