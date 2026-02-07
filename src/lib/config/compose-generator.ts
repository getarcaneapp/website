import type { GeneratorConfig } from '$lib/types/compose-generator.type.js';

/**
 * Configuration for the Docker Compose Generator UI.
 * Add new fields/sections here to automatically update the generator UI.
 */
export const generatorConfig: GeneratorConfig = [
	{
		id: 'basic',
		label: 'Basic',
		icon: 'settings',
		sections: [
			{
				id: 'core',
				title: 'Core Configuration',
				description: 'Essential Arcane settings',
				icon: 'settings',
				fields: [
					{
						key: 'appUrl',
						envName: 'APP_URL',
						label: 'App URL',
						description: 'The URL arcane runs on',
						type: 'text',
						defaultValue: 'http://localhost:3552',
						placeholder: 'http://localhost:3552',
						includeInCompose: true
					},
					{
						key: 'port',
						envName: 'PORT',
						label: 'Port',
						description: 'The port arcane should run on',
						type: 'text',
						defaultValue: '3552',
						placeholder: '3552',
						includeInCompose: false // Used for port mapping, not env var
					},
					{
						key: 'dataPath',
						envName: '',
						label: 'Data Volume',
						description: 'Docker volume name for persistent data',
						type: 'text',
						defaultValue: 'arcane-data',
						placeholder: 'arcane-data',
						includeInCompose: false
					},
					{
						key: 'puid',
						envName: 'PUID',
						label: 'PUID (User ID)',
						description: 'File owner user ID',
						type: 'text',
						defaultValue: '1000',
						placeholder: '1000',
						includeInCompose: true
					},
					{
						key: 'pgid',
						envName: 'PGID',
						label: 'PGID (Group ID)',
						description: 'File owner group ID',
						type: 'text',
						defaultValue: '1000',
						placeholder: '1000',
						includeInCompose: true
					}
				]
			},
			{
				id: 'secrets',
				title: 'Security',
				description: 'Encryption and authentication secrets',
				icon: 'shield',
				fields: [
					{
						key: 'encryptionKey',
						envName: 'ENCRYPTION_KEY',
						label: 'Encryption Key',
						description:
							'Encryption key for secure stored sensitive data (auto-generated if empty)',
						type: 'password',
						defaultValue: '',
						placeholder: 'Auto-generated if empty',
						canGenerate: true,
						includeInCompose: true
					},
					{
						key: 'jwtSecret',
						envName: 'JWT_SECRET',
						label: 'JWT Secret',
						description: 'Session secret (auto-generated if empty)',
						type: 'password',
						defaultValue: '',
						placeholder: 'Auto-generated if empty',
						canGenerate: true,
						includeInCompose: true
					}
				]
			},
			{
				id: 'advanced',
				title: 'Advanced',
				description: 'Docker and logging settings',
				icon: 'cog',
				fields: [
					{
						key: 'dockerSocket',
						envName: 'DOCKER_HOST',
						label: 'Docker Socket',
						description: 'Docker daemon socket path',
						type: 'text',
						defaultValue: '/var/run/docker.sock',
						placeholder: '/var/run/docker.sock',
						includeInCompose: false // Used for volume mount
					},
					{
						key: 'logLevel',
						envName: 'LOG_LEVEL',
						label: 'Log Level',
						description: 'Logging verbosity',
						type: 'select',
						defaultValue: 'info',
						options: [
							{ label: 'Debug', value: 'debug' },
							{ label: 'Info', value: 'info' },
							{ label: 'Warn', value: 'warn' },
							{ label: 'Error', value: 'error' }
						],
						includeInCompose: true
					},
					{
						key: 'logJson',
						envName: 'LOG_JSON',
						label: 'JSON Logging',
						description: 'Enable JSON formatted logs',
						type: 'checkbox',
						defaultValue: false,
						includeInCompose: true
					}
				]
			}
		]
	},
	{
		id: 'database',
		label: 'Database',
		icon: 'database',
		sections: [
			{
				id: 'database',
				title: 'Database Configuration',
				description: 'By default, Arcane uses SQLite. Enable this for external PostgreSQL.',
				icon: 'database',
				hasToggle: true,
				toggleKey: 'enableDatabase',
				fields: [
					{
						key: 'enableDatabase',
						envName: '',
						label: 'Use external PostgreSQL database',
						type: 'checkbox',
						defaultValue: false,
						includeInCompose: false
					},
					{
						key: 'dbName',
						envName: 'POSTGRES_DB',
						label: 'Database Name',
						type: 'text',
						defaultValue: 'arcane',
						placeholder: 'arcane',
						dependsOn: 'enableDatabase',
						includeInCompose: true
					},
					{
						key: 'dbUser',
						envName: 'POSTGRES_USER',
						label: 'Database User',
						type: 'text',
						defaultValue: 'arcane',
						placeholder: 'arcane',
						dependsOn: 'enableDatabase',
						includeInCompose: true
					},
					{
						key: 'dbPassword',
						envName: 'POSTGRES_PASSWORD',
						label: 'Database Password',
						type: 'password',
						defaultValue: '',
						placeholder: 'your_secure_password',
						dependsOn: 'enableDatabase',
						includeInCompose: true
					},
					{
						key: 'dbPort',
						envName: '',
						label: 'Database Port',
						type: 'text',
						defaultValue: '5432',
						placeholder: '5432',
						dependsOn: 'enableDatabase',
						includeInCompose: false
					}
				]
			}
		]
	},
	{
		id: 'auth',
		label: 'Authentication',
		shortLabel: 'Auth',
		icon: 'key',
		sections: [
			{
				id: 'oidc',
				title: 'OIDC Authentication',
				description: 'Single Sign-On configuration',
				icon: 'key',
				hasToggle: true,
				toggleKey: 'enableOIDC',
				fields: [
					{
						key: 'enableOIDC',
						envName: 'OIDC_ENABLED',
						label: 'Enable OIDC Authentication',
						type: 'checkbox',
						defaultValue: false,
						includeInCompose: true
					},
					{
						key: 'oidcClientId',
						envName: 'OIDC_CLIENT_ID',
						label: 'Client ID',
						description: 'Client ID from your OIDC provider',
						type: 'text',
						defaultValue: '',
						placeholder: 'your-client-id',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcClientSecret',
						envName: 'OIDC_CLIENT_SECRET',
						label: 'Client Secret',
						description: 'Client secret from your OIDC provider',
						type: 'password',
						defaultValue: '',
						placeholder: 'your-client-secret',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcIssuerUrl',
						envName: 'OIDC_ISSUER_URL',
						label: 'Issuer URL',
						description: 'OIDC provider issuer URL (no trailing slash)',
						type: 'text',
						defaultValue: '',
						placeholder: 'https://sso.example.com',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcScopes',
						envName: 'OIDC_SCOPES',
						label: 'Scopes',
						description: 'OAuth scopes to request',
						type: 'text',
						defaultValue: 'openid email profile',
						placeholder: 'openid email profile',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcAdminClaim',
						envName: 'OIDC_ADMIN_CLAIM',
						label: 'Admin Claim',
						description: 'Token claim to check for admin access',
						type: 'text',
						defaultValue: '',
						placeholder: 'groups',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcAdminValue',
						envName: 'OIDC_ADMIN_VALUE',
						label: 'Admin Value',
						description: 'Value(s) that grant admin access (comma-separated)',
						type: 'text',
						defaultValue: '',
						placeholder: 'arcane-admins',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcSkipTlsVerify',
						envName: 'OIDC_SKIP_TLS_VERIFY',
						label: 'Skip TLS Verify',
						description: 'Skip TLS verification for the OIDC provider (use with caution)',
						type: 'checkbox',
						defaultValue: false,
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcAutoRedirectToProvider',
						envName: 'OIDC_AUTO_REDIRECT_TO_PROVIDER',
						label: 'Auto Redirect',
						description: 'Automatically redirect users to the OIDC provider on login',
						type: 'checkbox',
						defaultValue: false,
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcMergeAccounts',
						envName: 'OIDC_MERGE_ACCOUNTS',
						label: 'Merge Accounts',
						description: 'Link OIDC logins to existing local accounts by email',
						type: 'checkbox',
						defaultValue: false,
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcProviderName',
						envName: 'OIDC_PROVIDER_NAME',
						label: 'Provider Name',
						description: 'Display name shown on the login screen',
						type: 'text',
						defaultValue: '',
						placeholder: 'Arcane SSO',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					},
					{
						key: 'oidcProviderLogoUrl',
						envName: 'OIDC_PROVIDER_LOGO_URL',
						label: 'Provider Logo URL',
						description: 'Logo URL shown on the login screen',
						type: 'text',
						defaultValue: '',
						placeholder: 'https://example.com/logo.svg',
						dependsOn: 'enableOIDC',
						includeInCompose: true
					}
				]
			}
		]
	}
];

/**
 * Get default values for all fields in the config
 */
export function getDefaultConfigValues(): Record<string, string | boolean> {
	const defaults: Record<string, string | boolean> = {};

	for (const tab of generatorConfig) {
		for (const section of tab.sections) {
			for (const field of section.fields) {
				defaults[field.key] = field.defaultValue;
			}
		}
	}

	return defaults;
}

/**
 * Get all fields from the config as a flat array
 */
export function getAllFields() {
	const fields: (typeof generatorConfig)[0]['sections'][0]['fields'] = [];

	for (const tab of generatorConfig) {
		for (const section of tab.sections) {
			fields.push(...section.fields);
		}
	}

	return fields;
}
