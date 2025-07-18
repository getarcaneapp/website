import type { EnvConfig } from '$lib/types/env-config.type.js';

export const envConfig: EnvConfig[] = [
	{
		name: 'PORT',
		description: 'The port arcane should run on',
		value: '8080'
	},
	{
		name: 'DEV_BACKEND_URL',
		description: 'The url of the backend for development',
		value: 'http://localhost:8080'
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
		description: 'Docker group ID',
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
		name: 'OIDC_REDIRECT_URI',
		description: 'Redirect URI (must match provider)',
		value: 'http://localhost:3000/auth/oidc/callback'
	},
	{
		name: 'OIDC_AUTHORIZATION_ENDPOINT',
		description: 'Auth endpoint URL',
		value: 'https://your-provider.com/oidc/authorize'
	},
	{
		name: 'OIDC_TOKEN_ENDPOINT',
		description: 'Token endpoint URL',
		value: 'https://your-provider.com/oidc/token'
	},
	{
		name: 'OIDC_USERINFO_ENDPOINT',
		description: 'Userinfo endpoint URL',
		value: 'https://your-provider.com/oidc/userinfo'
	},
	{
		name: 'OIDC_SCOPES',
		description: 'Scopes to request',
		value: 'openid email profile (default)'
	}
];
