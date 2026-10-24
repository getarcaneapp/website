import type {
	DeploymentGroup,
	DeploymentTarget,
	DeploymentTargetId,
	FieldContext,
	GeneratorConfig,
	GeneratorField,
	GeneratorTab,
	GeneratorValues
} from '#lib/types/instance-generator.type.js';

const MANAGER_TARGETS: DeploymentTargetId[] = [
	'docker',
	'podman-rootless',
	'podman-rootful',
	'podman-quadlet'
];
const PODMAN_TARGETS: DeploymentTargetId[] = [
	'podman-rootless',
	'podman-rootful',
	'podman-quadlet'
];
const AGENT_CONTAINER_TARGETS: DeploymentTargetId[] = ['agent-edge'];
const AGENT_TARGETS: DeploymentTargetId[] = [...AGENT_CONTAINER_TARGETS, 'agent-binary'];

function validatePort(value: string): string | undefined {
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	const port = Number(trimmed);
	return /^\d+$/.test(trimmed) && port >= 1 && port <= 65535
		? undefined
		: 'Use a port between 1 and 65535.';
}

function validateId(value: string): string | undefined {
	return !value.trim() || /^\d+$/.test(value.trim()) ? undefined : 'Use a numeric ID.';
}

function validateUrl(value: string): string | undefined {
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	return URL.canParse(trimmed) && /^https?:\/\//.test(trimmed)
		? undefined
		: 'Use a full URL starting with http:// or https://.';
}

function validateIssuerUrl(value: string): string | undefined {
	return (
		validateUrl(value) ?? (value.trim().endsWith('/') ? 'Remove the trailing slash.' : undefined)
	);
}

function validatePath(value: string): string | undefined {
	return !value.trim() || value.trim().startsWith('/') ? undefined : 'Use an absolute path.';
}

export const deploymentGroups: DeploymentGroup[] = [
	{
		id: 'manager',
		title: 'Manager',
		description: 'The Arcane web UI. It manages the container engine on the host it runs on.',
		targets: [
			{
				id: 'docker',
				label: 'Docker Compose',
				description: 'Run Arcane on a Docker host, with the Docker socket or a socket proxy.',
				resultDescription: 'Save the Compose file on your Docker host, then start Arcane.',
				docsHref: '/docs/get-started/installation',
				docsLabel: 'Installation guide'
			},
			{
				id: 'podman-rootless',
				label: 'Rootless Podman Compose',
				description: "Run Arcane with Compose on your user's rootless Podman socket.",
				resultDescription:
					'Run these as the Linux user that owns the rootless Podman socket, not as root.',
				docsHref: '/docs/podman/setup',
				docsLabel: 'Podman setup guide'
			},
			{
				id: 'podman-rootful',
				label: 'Rootful Podman Compose',
				description: 'Run Arcane with Compose on the system Podman socket.',
				resultDescription: 'Save the Compose file on your Podman host, then start Arcane as root.',
				docsHref: '/docs/podman/setup',
				docsLabel: 'Podman setup guide'
			},
			{
				id: 'podman-quadlet',
				label: 'Rootless Podman Quadlet',
				description:
					"Run Arcane as a systemd service from a Quadlet .container file on your user's Podman.",
				resultDescription:
					'Run these as the Linux user that owns the rootless Podman socket, not as root. Update Arcane with Podman auto-update; its own update action is turned off in a Quadlet.',
				docsHref: '/docs/podman/setup',
				docsLabel: 'Podman setup guide'
			}
		]
	},
	{
		id: 'agent',
		title: 'Agent',
		description:
			'Connects another host to an existing Manager as a remote environment. Create the environment in Arcane first to get its token.',
		targets: [
			{
				id: 'agent-edge',
				label: 'Agent container',
				description:
					'Run the agent with Docker Compose. It connects out to the Manager and opens no ports.',
				resultDescription: 'Save the Compose file on the remote host, then start the agent.',
				docsHref: '/docs/remote/environments',
				docsLabel: 'Remote environments guide'
			},
			{
				id: 'agent-binary',
				label: 'Agent binary',
				description: 'Run the agent as a standalone binary instead of a container.',
				resultDescription:
					'Download the arcane-agent binary for your platform from GitHub Releases, put the .env file next to it, then start it.',
				docsHref: '/docs/remote/environments#run-the-agent-as-a-standalone-binary',
				docsLabel: 'Remote environments guide'
			}
		]
	}
];

export const deploymentTargets: DeploymentTarget[] = deploymentGroups.flatMap(
	(group) => group.targets
);

export function getDeploymentTarget(id: DeploymentTargetId): DeploymentTarget {
	return deploymentTargets.find((target) => target.id === id) ?? deploymentTargets[0];
}

export const generatorConfig: GeneratorConfig = [
	{
		id: 'basic',
		label: 'Basics',
		icon: 'settings',
		targets: MANAGER_TARGETS,
		sections: [
			{
				id: 'core',
				title: 'Core Configuration',
				description: 'Image, address, and file ownership.',
				icon: 'settings',
				fields: [
					{
						key: 'registry',
						envName: '',
						label: 'Image registry',
						description: 'Where to pull the Arcane manager image from',
						type: 'select',
						defaultValue: 'ghcr',
						options: [
							{ label: 'GitHub Container Registry', value: 'ghcr' },
							{ label: 'Quay', value: 'quay' },
							{ label: 'Docker Hub', value: 'docker' }
						]
					},
					{
						key: 'appUrl',
						envName: 'ARCANE_APP_URL',
						label: 'App URL',
						description: 'The URL your browser uses to open Arcane',
						type: 'text',
						defaultValue: 'http://localhost:3552',
						placeholder: 'http://localhost:3552',
						includeInEnv: true,
						validate: validateUrl
					},
					{
						key: 'port',
						envName: '',
						label: 'Port',
						description: 'The host port Arcane is published on',
						type: 'text',
						defaultValue: '3552',
						placeholder: '3552',
						validate: validatePort
					},
					{
						key: 'localOnly',
						envName: '',
						label: 'Listen on localhost only',
						description: 'Publish the port on 127.0.0.1, for use behind a local reverse proxy',
						type: 'checkbox',
						defaultValue: false,
						targets: ['podman-quadlet']
					},
					{
						key: 'dataPath',
						envName: '',
						label: 'Data volume',
						description: 'Volume name for Arcane data',
						type: 'text',
						defaultValue: 'arcane-data',
						placeholder: 'arcane-data',
						advanced: true
					},
					{
						key: 'puid',
						envName: 'PUID',
						label: 'PUID',
						description:
							'Host user ID that owns files Arcane creates. On rootless Podman, use your own ID (id -u).',
						type: 'text',
						defaultValue: '1000',
						placeholder: '1000',
						includeInEnv: true,
						visibleWhen: ({ target, config }) =>
							!(target === 'podman-rootful' && config.systemdAccess === true),
						validate: validateId
					},
					{
						key: 'pgid',
						envName: 'PGID',
						label: 'PGID',
						description:
							'Host group ID that owns files Arcane creates. On rootless Podman, use your own group ID (id -g).',
						type: 'text',
						defaultValue: '1000',
						placeholder: '1000',
						includeInEnv: true,
						visibleWhen: ({ target, config }) =>
							!(target === 'podman-rootful' && config.systemdAccess === true),
						validate: validateId
					}
				]
			}
		]
	},
	{
		id: 'agent',
		label: 'Connection',
		icon: 'settings',
		targets: AGENT_TARGETS,
		sections: [
			{
				id: 'agent',
				title: 'Agent Connection',
				description: 'Values from the environment you created in Arcane.',
				icon: 'settings',
				fields: [
					{
						key: 'edgeTransport',
						envName: '',
						label: 'Edge transport',
						description: 'How the agent keeps in touch with the Manager',
						type: 'select',
						defaultValue: 'auto',
						options: [
							{ label: 'Auto (gRPC, then WebSocket)', value: 'auto' },
							{ label: 'Poll', value: 'poll' },
							{ label: 'WebSocket', value: 'websocket' },
							{ label: 'gRPC', value: 'grpc' }
						],
						advanced: true
					},
					{
						key: 'agentToken',
						envName: '',
						label: 'Agent token',
						description: 'Shown when you create the environment in Arcane',
						type: 'password',
						defaultValue: '',
						placeholder: 'arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						required: true
					},
					{
						key: 'managerUrl',
						envName: '',
						label: 'Manager URL',
						description: 'The address of your Arcane Manager',
						type: 'text',
						defaultValue: '',
						placeholder: 'http://10.1.1.4:3552',
						required: true,
						validate: validateUrl
					}
				]
			}
		]
	},
	{
		id: 'hostAccess',
		label: 'Host access',
		icon: 'settings',
		targets: [...MANAGER_TARGETS, ...AGENT_CONTAINER_TARGETS],
		sections: [
			{
				id: 'hostAccess',
				title: 'Host Access',
				description: 'Choose how Arcane reaches the container engine on this host.',
				icon: 'settings',
				fields: [
					{
						key: 'dockerSocket',
						envName: '',
						label: 'Docker socket',
						description:
							'Path to the Docker socket on the host. On a Podman host, use the Podman socket path.',
						type: 'text',
						defaultValue: '/var/run/docker.sock',
						placeholder: '/var/run/docker.sock',
						targets: ['docker', ...AGENT_CONTAINER_TARGETS],
						visibleWhen: ({ config }) => config.useSocketProxy !== true,
						validate: validatePath
					},
					{
						key: 'useSocketProxy',
						envName: '',
						label: 'Use a socket proxy',
						description:
							'Use a Docker socket proxy container instead of mounting the Docker socket directly',
						type: 'checkbox',
						defaultValue: false,
						targets: ['docker']
					},
					{
						key: 'socketProxyProvider',
						envName: '',
						label: 'Socket proxy',
						description:
							'wollomatic is recommended. Tecnativa is still available if you already use it.',
						type: 'select',
						defaultValue: 'wollomatic',
						options: [
							{ label: 'wollomatic/socket-proxy', value: 'wollomatic' },
							{ label: 'tecnativa/docker-socket-proxy', value: 'tecnativa' }
						],
						dependsOn: 'useSocketProxy',
						targets: ['docker']
					},
					{
						key: 'enableSelinux',
						envName: '',
						label: 'Enable SELinux compatibility',
						description:
							'Relabel the projects folder mount, and turn off SELinux labelling when the socket is mounted directly',
						type: 'checkbox',
						defaultValue: false,
						targets: ['docker']
					},
					{
						key: 'systemdAccess',
						envName: '',
						label: 'Manage Quadlets and auto-update',
						description:
							'Mount the systemd D-Bus socket so Arcane can start and stop Quadlets and run Podman auto-update. On rootful Podman this runs Arcane as root.',
						type: 'checkbox',
						defaultValue: true,
						targets: PODMAN_TARGETS
					},
					{
						key: 'lxc',
						envName: '',
						label: 'Running inside LXC',
						description:
							'Add the mounts Arcane needs to read host metrics inside an LXC container, such as on Proxmox',
						type: 'checkbox',
						defaultValue: false,
						targets: ['docker', ...AGENT_CONTAINER_TARGETS],
						advanced: true
					},
					{
						key: 'healthcheck',
						envName: '',
						label: 'Health check',
						description: 'Add a health check that runs the built-in arcane health command',
						type: 'checkbox',
						defaultValue: true,
						targets: ['docker'],
						advanced: true
					}
				]
			}
		]
	},
	{
		id: 'projectStorage',
		label: 'Storage',
		icon: 'folder',
		targets: MANAGER_TARGETS,
		sections: [
			{
				id: 'projects',
				title: 'Project Storage',
				description:
					'Optional host folder for Compose projects, mounted at the same path inside the container.',
				icon: 'folder',
				fields: [
					{
						key: 'projectsHostPath',
						envName: '',
						label: 'Projects host path',
						description: 'Absolute host path to the folder that holds your Compose projects',
						type: 'text',
						defaultValue: '',
						placeholder: '/opt/docker',
						validate: validatePath
					}
				]
			}
		]
	},
	{
		id: 'runtime',
		label: 'Runtime',
		icon: 'settings',
		sections: [
			{
				id: 'runtime',
				title: 'Runtime',
				description: 'Logging and runtime behavior.',
				icon: 'settings',
				fields: [
					{
						key: 'logLevel',
						envName: 'ARCANE_LOG_LEVEL',
						label: 'Log level',
						description: 'Logging verbosity',
						type: 'select',
						defaultValue: 'info',
						options: [
							{ label: 'Debug', value: 'debug' },
							{ label: 'Info', value: 'info' },
							{ label: 'Warn', value: 'warn' },
							{ label: 'Error', value: 'error' }
						],
						includeInEnv: true
					},
					{
						key: 'logJson',
						envName: 'ARCANE_LOG_JSON',
						label: 'JSON logging',
						description: 'Enable JSON formatted logs',
						type: 'checkbox',
						defaultValue: false,
						includeInEnv: true
					},
					{
						key: 'tz',
						envName: 'TZ',
						label: 'Timezone',
						description: 'IANA timezone for scheduled jobs. The container default is UTC.',
						type: 'text',
						defaultValue: '',
						placeholder: 'America/New_York',
						includeInEnv: true,
						targets: MANAGER_TARGETS
					}
				]
			}
		]
	},
	{
		id: 'secrets',
		label: 'Security',
		icon: 'key',
		targets: ['docker', 'podman-rootless', 'podman-rootful'],
		sections: [
			{
				id: 'secrets',
				title: 'Security',
				description: 'The key Arcane uses to encrypt stored secrets.',
				icon: 'key',
				fields: [
					{
						key: 'encryptionKey',
						envName: 'ARCANE_ENCRYPTION_KEY',
						label: 'Encryption key',
						description:
							'Encryption key for secure stored sensitive data (auto-generated if empty)',
						type: 'password',
						defaultValue: '',
						placeholder: 'Auto-generated if empty',
						canGenerate: true,
						includeInEnv: true
					}
				]
			}
		]
	},
	{
		id: 'database',
		label: 'Database',
		icon: 'database',
		targets: ['docker'],
		sections: [
			{
				id: 'database',
				title: 'Database Configuration',
				description: 'Arcane uses SQLite unless you switch to PostgreSQL.',
				icon: 'database',
				hasToggle: true,
				toggleKey: 'enableDatabase',
				fields: [
					{
						key: 'enableDatabase',
						envName: '',
						label: 'Use external PostgreSQL database',
						type: 'checkbox',
						defaultValue: false
					},
					{
						key: 'dbName',
						envName: '',
						label: 'Database name',
						type: 'text',
						defaultValue: 'arcane',
						placeholder: 'arcane',
						dependsOn: 'enableDatabase'
					},
					{
						key: 'dbUser',
						envName: '',
						label: 'Database user',
						type: 'text',
						defaultValue: 'arcane',
						placeholder: 'arcane',
						dependsOn: 'enableDatabase'
					},
					{
						key: 'dbPassword',
						envName: '',
						label: 'Database password',
						type: 'password',
						defaultValue: '',
						placeholder: 'your_secure_password',
						dependsOn: 'enableDatabase',
						required: true
					},
					{
						key: 'dbPort',
						envName: '',
						label: 'Database port',
						type: 'text',
						defaultValue: '5432',
						placeholder: '5432',
						dependsOn: 'enableDatabase',
						advanced: true,
						validate: validatePort
					}
				]
			}
		]
	},
	{
		id: 'auth',
		label: 'Authentication',
		icon: 'key',
		targets: MANAGER_TARGETS,
		sections: [
			{
				id: 'oidc',
				title: 'OIDC Authentication',
				description: 'Single sign-on through your OIDC provider.',
				icon: 'key',
				hasToggle: true,
				toggleKey: 'enableOIDC',
				fields: [
					{
						key: 'enableOIDC',
						envName: 'ARCANE_OIDC_ENABLED',
						label: 'Enable OIDC sign-in',
						type: 'checkbox',
						defaultValue: false,
						includeInEnv: true
					},
					{
						key: 'oidcClientId',
						envName: 'ARCANE_OIDC_CLIENT_ID',
						label: 'Client ID',
						description: 'Client ID from your OIDC provider',
						type: 'text',
						defaultValue: '',
						placeholder: 'your-client-id',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						required: true
					},
					{
						key: 'oidcClientSecret',
						envName: 'ARCANE_OIDC_CLIENT_SECRET',
						label: 'Client secret',
						description: 'Client secret from your OIDC provider',
						type: 'password',
						defaultValue: '',
						placeholder: 'your-client-secret',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						required: true
					},
					{
						key: 'oidcIssuerUrl',
						envName: 'ARCANE_OIDC_ISSUER_URL',
						label: 'Issuer URL',
						description: 'OIDC provider issuer URL (no trailing slash)',
						type: 'text',
						defaultValue: '',
						placeholder: 'https://sso.example.com',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						required: true,
						validate: validateIssuerUrl
					},
					{
						key: 'oidcScopes',
						envName: 'ARCANE_OIDC_SCOPES',
						label: 'Scopes',
						description: 'OAuth scopes to request',
						type: 'text',
						defaultValue: 'openid email profile',
						placeholder: 'openid email profile',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true
					},
					{
						key: 'oidcAdminClaim',
						envName: 'OIDC_ADMIN_CLAIM',
						label: 'Admin claim',
						description: 'Token claim to check for admin access',
						type: 'text',
						defaultValue: '',
						placeholder: 'groups',
						dependsOn: 'enableOIDC',
						includeInEnv: true
					},
					{
						key: 'oidcAdminValue',
						envName: 'OIDC_ADMIN_VALUE',
						label: 'Admin value',
						description: 'Value(s) that grant admin access (comma-separated)',
						type: 'text',
						defaultValue: '',
						placeholder: 'arcane-admins',
						dependsOn: 'enableOIDC',
						includeInEnv: true
					},
					{
						key: 'oidcSkipTlsVerify',
						envName: 'ARCANE_OIDC_SKIP_TLS_VERIFY',
						label: 'Skip TLS verify',
						description: 'Skip TLS verification for the OIDC provider (use with caution)',
						type: 'checkbox',
						defaultValue: false,
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true
					},
					{
						key: 'oidcAutoRedirectToProvider',
						envName: 'ARCANE_OIDC_AUTO_REDIRECT_TO_PROVIDER',
						label: 'Auto redirect',
						description: 'Automatically redirect users to the OIDC provider on login',
						type: 'checkbox',
						defaultValue: false,
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true
					},
					{
						key: 'oidcMergeAccounts',
						envName: 'ARCANE_OIDC_MERGE_ACCOUNTS',
						label: 'Merge accounts',
						description: 'Link OIDC logins to existing local accounts by email',
						type: 'checkbox',
						defaultValue: false,
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true
					},
					{
						key: 'oidcProviderName',
						envName: 'ARCANE_OIDC_PROVIDER_NAME',
						label: 'Provider name',
						description: 'Display name shown on the login screen',
						type: 'text',
						defaultValue: '',
						placeholder: 'Arcane SSO',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true
					},
					{
						key: 'oidcProviderLogoUrl',
						envName: 'ARCANE_OIDC_PROVIDER_LOGO_URL',
						label: 'Provider logo URL',
						description: 'Logo URL shown on the login screen',
						type: 'text',
						defaultValue: '',
						placeholder: 'https://example.com/logo.svg',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true,
						validate: validateUrl
					}
				]
			}
		]
	}
];

function appliesTo(targets: DeploymentTargetId[] | undefined, target: DeploymentTargetId): boolean {
	return !targets || targets.includes(target);
}

export function getTabsForTarget(target: DeploymentTargetId): GeneratorTab[] {
	return generatorConfig.filter(
		(tab) =>
			appliesTo(tab.targets, target) &&
			tab.sections.some((section) =>
				section.fields.some((field) => appliesTo(field.targets, target))
			)
	);
}

export function isFieldVisible(field: GeneratorField, context: FieldContext): boolean {
	if (!appliesTo(field.targets, context.target)) return false;
	if (field.dependsOn && context.config[field.dependsOn] !== true) return false;
	return field.visibleWhen?.(context) ?? true;
}

/**
 * Get default values for all fields in the config
 */
export function getDefaultConfigValues(): GeneratorValues {
	return Object.fromEntries(
		getAllFields().map((field) => [field.key, field.defaultValue] as const)
	);
}

export function getActiveFields(context: FieldContext): GeneratorField[] {
	return getTabsForTarget(context.target)
		.flatMap((tab) => tab.sections)
		.flatMap((section) => section.fields)
		.filter((field) => isFieldVisible(field, context));
}

/**
 * Get all fields from the config as a flat array
 */
export function getAllFields(): GeneratorField[] {
	return generatorConfig.flatMap((tab) => tab.sections).flatMap((section) => section.fields);
}
