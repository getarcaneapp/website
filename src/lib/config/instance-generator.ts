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
const AGENT_CONTAINER_TARGETS: DeploymentTargetId[] = ['agent-container'];
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

function validateVolumeName(value: string): string | undefined {
	return !value.trim() || /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/.test(value.trim())
		? undefined
		: 'Use 2+ letters, numbers, _, . or -.';
}

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

/** Mirrors Arcane's ARCANE_TRUSTED_PROXIES parsing: comma-separated, each entry must pass Go's net.ParseCIDR. */
function isCidr(entry: string): boolean {
	const [address, bits, ...rest] = entry.split('/');
	if (!address || !bits || rest.length > 0 || !/^\d+$/.test(bits)) return false;
	if (IPV4.test(address)) return Number(bits) <= 32;
	return address.includes(':') && URL.canParse(`http://[${address}]`) && Number(bits) <= 128;
}

function validateCidrList(value: string): string | undefined {
	return value
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean)
		.every(isCidr)
		? undefined
		: 'Use CIDR notation, e.g. 10.0.0.5/32 (IPv6: /128).';
}

/** Mirrors Arcane's key parsing (kit sys/crypto ParseKey) and its production length check. */
function validateEncryptionKey(value: string): string | undefined {
	const key = value.trim();
	if (!key) return undefined;
	if (key.startsWith('hex:')) {
		return /^[\da-f]{64}$/i.test(key.slice(4).trim())
			? undefined
			: 'A hex: key needs exactly 64 hex characters.';
	}
	if (key.startsWith('base64:')) {
		return /^[A-Za-z\d+/]{43}=$/.test(key.slice(7).trim())
			? undefined
			: 'A base64: key needs 32 bytes: 44 characters ending in =.';
	}
	return new TextEncoder().encode(key.replace(/^raw:/, '')).length >= 32
		? undefined
		: 'Use at least 32 characters, or click Generate.';
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
				id: 'agent-container',
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
						description: 'Registry to pull the Manager image from.',
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
						description: 'The address you open Arcane at, with http:// or https://.',
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
						description: 'Host port that serves Arcane.',
						type: 'text',
						defaultValue: '3552',
						placeholder: '3552',
						validate: validatePort
					},
					{
						key: 'localOnly',
						envName: '',
						label: 'Listen on localhost only',
						description: 'Bind to 127.0.0.1. Use with a reverse proxy on the same host.',
						type: 'checkbox',
						defaultValue: false,
						targets: ['podman-quadlet']
					},
					{
						key: 'dataPath',
						envName: '',
						label: 'Data volume',
						description: "Named volume for Arcane's data.",
						type: 'text',
						defaultValue: 'arcane-data',
						placeholder: 'arcane-data',
						advanced: true,
						validate: validateVolumeName
					},
					{
						key: 'puid',
						envName: 'PUID',
						label: 'PUID',
						description: 'User ID that owns files Arcane creates. Rootless Podman: run id -u.',
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
						description: 'Group ID that owns files Arcane creates. Rootless Podman: run id -g.',
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
						key: 'agentTransport',
						envName: '',
						label: 'Transport',
						description: 'How the agent reaches the Manager.',
						type: 'select',
						defaultValue: 'auto',
						options: [
							{ label: 'Auto (gRPC, then WebSocket)', value: 'auto' },
							{ label: 'WebSocket', value: 'websocket' },
							{ label: 'gRPC', value: 'grpc' }
						],
						advanced: true
					},
					{
						key: 'agentToken',
						envName: '',
						label: 'Agent token',
						description: 'Copy it from the new environment in Arcane.',
						type: 'password',
						defaultValue: '',
						placeholder: 'arc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						required: true
					},
					{
						key: 'managerUrl',
						envName: '',
						label: 'Manager URL',
						description: 'Address the agent uses to reach the Manager.',
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
						description: 'Host path to the Docker socket. On Podman, use the Podman socket.',
						type: 'text',
						defaultValue: '/var/run/docker.sock',
						placeholder: '/var/run/docker.sock',
						targets: ['docker', ...AGENT_CONTAINER_TARGETS],
						visibleWhen: ({ target, config }) =>
							!(target === 'docker' && config.useSocketProxy === true),
						validate: validatePath
					},
					{
						key: 'useSocketProxy',
						envName: '',
						label: 'Use a socket proxy',
						description:
							'Send Docker API calls through a filtering proxy instead of mounting the socket.',
						type: 'checkbox',
						defaultValue: false,
						targets: ['docker']
					},
					{
						key: 'socketProxyProvider',
						envName: '',
						label: 'Socket proxy',
						description: 'Pick wollomatic unless you already run Tecnativa.',
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
						label: 'SELinux compatibility',
						description: 'Relabel bind mounts and turn off labeling for the socket mount.',
						type: 'checkbox',
						defaultValue: false,
						targets: ['docker']
					},
					{
						key: 'systemdAccess',
						envName: '',
						label: 'Manage Quadlets and auto-update',
						description: 'Mounts the systemd D-Bus socket. On rootful Podman, Arcane runs as root.',
						type: 'checkbox',
						defaultValue: true,
						targets: PODMAN_TARGETS
					},
					{
						key: 'lxc',
						envName: '',
						label: 'Running in LXC',
						description: 'Adds the mounts Arcane needs for host metrics in LXC, such as Proxmox.',
						type: 'checkbox',
						defaultValue: false,
						targets: ['docker', ...AGENT_CONTAINER_TARGETS],
						advanced: true
					},
					{
						key: 'healthcheck',
						envName: '',
						label: 'Health check',
						description: 'Runs arcane health every 10 seconds.',
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
						description: 'Absolute host path to your Compose projects folder.',
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
						description: 'How much Arcane logs. Default: Info.',
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
						label: 'JSON logs',
						description: 'Write logs as JSON, for log collectors.',
						type: 'checkbox',
						defaultValue: false,
						includeInEnv: true
					},
					{
						key: 'tz',
						envName: 'TZ',
						label: 'Timezone',
						description: 'IANA timezone for scheduled jobs. Default: UTC.',
						type: 'text',
						defaultValue: '',
						placeholder: 'America/New_York',
						includeInEnv: true,
						targets: MANAGER_TARGETS
					},
					{
						key: 'githubToken',
						envName: 'ARCANE_GITHUB_TOKEN',
						label: 'GitHub token',
						description: 'Raises the GitHub rate limit for image release notes.',
						type: 'password',
						defaultValue: '',
						placeholder: 'github_pat_...',
						includeInEnv: true,
						targets: MANAGER_TARGETS,
						advanced: true
					}
				]
			}
		]
	},
	{
		id: 'telemetry',
		label: 'OpenTelemetry',
		icon: 'chart',
		sections: [
			{
				id: 'telemetry',
				title: 'OpenTelemetry',
				description: 'Send metrics, traces, and logs to an OTLP collector.',
				icon: 'chart',
				hasToggle: true,
				toggleKey: 'enableOtel',
				fields: [
					{
						key: 'enableOtel',
						envName: '',
						label: 'Enable OpenTelemetry export',
						type: 'checkbox',
						defaultValue: false
					},
					{
						key: 'otelEndpoint',
						envName: 'OTEL_EXPORTER_OTLP_ENDPOINT',
						label: 'Collector endpoint',
						description: 'Collector URL. HTTP uses port 4318, gRPC 4317.',
						type: 'text',
						defaultValue: '',
						placeholder: 'http://otel-collector:4318',
						dependsOn: 'enableOtel',
						includeInEnv: true,
						required: true,
						validate: validateUrl
					},
					{
						key: 'otelProtocol',
						envName: 'OTEL_EXPORTER_OTLP_PROTOCOL',
						label: 'Protocol',
						type: 'select',
						defaultValue: 'http/protobuf',
						options: [
							{ label: 'HTTP/protobuf', value: 'http/protobuf' },
							{ label: 'gRPC', value: 'grpc' }
						],
						dependsOn: 'enableOtel',
						includeInEnv: true
					},
					{
						key: 'otelMetrics',
						envName: 'OTEL_METRICS_EXPORTER',
						envValue: 'otlp',
						label: 'Metrics',
						type: 'checkbox',
						defaultValue: true,
						dependsOn: 'enableOtel',
						includeInEnv: true
					},
					{
						key: 'otelTraces',
						envName: 'OTEL_TRACES_EXPORTER',
						envValue: 'otlp',
						label: 'Traces',
						type: 'checkbox',
						defaultValue: true,
						dependsOn: 'enableOtel',
						includeInEnv: true
					},
					{
						key: 'otelLogs',
						envName: 'OTEL_LOGS_EXPORTER',
						envValue: 'otlp',
						label: 'Logs',
						type: 'checkbox',
						defaultValue: true,
						dependsOn: 'enableOtel',
						includeInEnv: true
					},
					{
						key: 'otelHeaders',
						envName: 'OTEL_EXPORTER_OTLP_HEADERS',
						label: 'Headers',
						description: 'Comma-separated key=value pairs, such as an auth header.',
						type: 'password',
						defaultValue: '',
						placeholder: 'authorization=Bearer <token>',
						dependsOn: 'enableOtel',
						includeInEnv: true,
						advanced: true
					}
				]
			}
		]
	},
	{
		id: 'network',
		label: 'Network',
		icon: 'globe',
		targets: MANAGER_TARGETS,
		sections: [
			{
				id: 'network',
				title: 'Network',
				description: 'Reverse proxy trust and direct HTTPS.',
				icon: 'globe',
				fields: [
					{
						key: 'trustedProxies',
						envName: 'ARCANE_TRUSTED_PROXIES',
						label: 'Trusted proxies',
						description:
							'Comma-separated CIDR ranges of your proxies. Arcane trusts their forwarded headers.',
						type: 'text',
						defaultValue: '',
						placeholder: '172.18.0.0/16',
						includeInEnv: true,
						validate: validateCidrList
					},
					{
						key: 'enableTls',
						envName: 'ARCANE_TLS_ENABLED',
						label: 'Serve HTTPS directly',
						description: 'Use your own certificate instead of a reverse proxy.',
						type: 'checkbox',
						defaultValue: false,
						includeInEnv: true
					},
					{
						key: 'tlsCertFile',
						envName: 'ARCANE_TLS_CERT_FILE',
						label: 'Certificate file',
						description: 'Absolute host path, mounted read-only at the same path',
						type: 'text',
						defaultValue: '',
						placeholder: '/etc/arcane/tls/cert.pem',
						dependsOn: 'enableTls',
						includeInEnv: true,
						required: true,
						validate: validatePath
					},
					{
						key: 'tlsKeyFile',
						envName: 'ARCANE_TLS_KEY_FILE',
						label: 'Private key file',
						description: 'Absolute host path, mounted read-only at the same path',
						type: 'text',
						defaultValue: '',
						placeholder: '/etc/arcane/tls/key.pem',
						dependsOn: 'enableTls',
						includeInEnv: true,
						required: true,
						validate: validatePath
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
							"Encrypts stored secrets. Save a copy: Arcane can't decrypt them without it.",
						type: 'password',
						defaultValue: '',
						placeholder: 'Click Generate to create one',
						canGenerate: true,
						includeInEnv: true,
						required: true,
						validate: validateEncryptionKey
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
						description: 'Any characters work. They are escaped for you.',
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
						description: 'Host port for PostgreSQL.',
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
						description: 'From your OIDC provider.',
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
						description: 'From your OIDC provider.',
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
						description: "Your provider's issuer URL, without a trailing slash.",
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
						description: 'Space-separated scopes to request.',
						type: 'text',
						defaultValue: 'openid email profile',
						placeholder: 'openid email profile',
						dependsOn: 'enableOIDC',
						includeInEnv: true,
						advanced: true
					},
					{
						key: 'oidcSkipTlsVerify',
						envName: 'ARCANE_OIDC_SKIP_TLS_VERIFY',
						label: 'Skip TLS verification',
						description: "Don't check the provider's certificate. Use only for testing.",
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
						description: 'Send users straight to the provider from the login page.',
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
						description: 'Link OIDC logins to local accounts with the same email.',
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
						description: 'Name shown on the login screen.',
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
						description: 'Logo shown on the login screen.',
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
	if (field.dependsOn) {
		// A toggle left on under another target must not reveal its dependents here.
		const dependency = getAllFields().find((f) => f.key === field.dependsOn);
		if (context.config[field.dependsOn] !== true) return false;
		if (dependency && !isFieldVisible(dependency, context)) return false;
	}
	return field.visibleWhen?.(context) ?? true;
}

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

export function getAllFields(): GeneratorField[] {
	return generatorConfig.flatMap((tab) => tab.sections).flatMap((section) => section.fields);
}
