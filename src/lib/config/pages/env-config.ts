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
		name: 'DEV_BACKEND_URL',
		description: 'The url of the backend for development',
		defaultValue: 'http://localhost:3552'
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
		name: 'DOCKER_HOST',
		description: 'Docker daemon socket or host',
		defaultValue: 'unix:///var/run/docker.sock',
		exampleValue: 'tcp://docker-socket-proxy:2375'
	},
	{
		name: 'ENCRYPTION_KEY',
		description: 'Encryption Key for secure stored sensitive data',
		defaultValue: '',
		exampleValue: 'your-32-byte-key'
	},
	{
		name: 'JWT_SECRET',
		description: 'Session secret',
		defaultValue: '',
		exampleValue: 'your-jwt-secret'
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
		name: 'ANALYTICS_DISABLED',
		description: 'Disable analytics',
		defaultValue: 'false'
	},
	{
		name: 'UI_CONFIGURATION_DISABLED',
		description: 'Disables UI-based settings changes; forces env-driven configuration',
		defaultValue: 'false'
	},
	{
		name: 'FILE_PERM',
		description: 'Configure the permissions of created files by arcane',
		defaultValue: '0644'
	},
	{
		name: 'DIR_PERM',
		description: 'Configure the permissions of created directories by arcane',
		defaultValue: '0755'
	}
];
