import { getActiveFields } from '#lib/config/instance-generator.js';
import type {
	DeploymentTargetId,
	FieldContext,
	GeneratedFile,
	GeneratorField,
	GeneratorValues
} from '#lib/types/instance-generator.type.js';
import {
	buildSocketProxyService,
	quoteYamlScalar,
	SOCKET_PROXY_NETWORK,
	type SocketProxyProvider
} from './socket-proxy.js';

type ComposeRecord = Record<string, unknown>;
type ComposeSection = Record<string, ComposeRecord>;

export const MANAGER_IMAGES = {
	ghcr: 'ghcr.io/getarcaneapp/manager:latest',
	quay: 'quay.io/getarcaneapp/manager:latest',
	docker: 'getarcaneapp/manager:latest'
} as const;

type ImageRegistry = keyof typeof MANAGER_IMAGES;

const AGENT_IMAGE = 'ghcr.io/getarcaneapp/agent:latest';
const AGENT_TOKEN_PLACEHOLDER = '<your-agent-token>';
const MANAGER_URL_PLACEHOLDER = 'http://<manager-host>:3552';

const ARCANE_HEALTHCHECK = {
	test: "['CMD', './arcane', 'health', '--timeout', '2s']",
	interval: '10s',
	timeout: '3s',
	retries: 5,
	start_period: '15s'
};

interface ComposeDocument {
	services: ComposeSection;
	volumes: ComposeSection;
	networks: ComposeSection;
}

const generatedAt = new Date().toLocaleString();

export function generateRandomKey(): string {
	return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
		byte.toString(16).padStart(2, '0')
	).join('');
}

function getString(config: GeneratorValues, key: string, fallback: string): string {
	const value = config[key];
	return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getManagerImage(config: GeneratorValues): string {
	const registry = getString(config, 'registry', 'ghcr');
	return MANAGER_IMAGES[registry as ImageRegistry] ?? MANAGER_IMAGES.ghcr;
}

function getPodmanManagerImage(config: GeneratorValues): string {
	const image = getManagerImage(config);
	return image === MANAGER_IMAGES.docker ? `docker.io/${image}` : image;
}

function getSocketProxyProvider(config: GeneratorValues): SocketProxyProvider {
	return config.socketProxyProvider === 'tecnativa' ? 'tecnativa' : 'wollomatic';
}

function getEnvironmentEntry(field: GeneratorField, config: GeneratorValues): string | null {
	if (!field.includeInEnv || !field.envName) return null;

	const value = config[field.key];
	if (value === true) return `${field.envName}=true`;
	if (typeof value !== 'string') return null;
	if (field.type === 'select' && value === field.defaultValue) return null;
	if (value.trim()) return `${field.envName}=${value.trim()}`;
	if (field.canGenerate) return `${field.envName}=${generateRandomKey()}`;
	return null;
}

function buildEnvironment(context: FieldContext): string[] {
	return getActiveFields(context).flatMap((field) => {
		const entry = getEnvironmentEntry(field, context.config);
		return entry ? [entry] : [];
	});
}

function projectsEnvironment(projectsPath: string): string[] {
	return projectsPath ? [`ARCANE_PROJECTS_DIRECTORY=${projectsPath}`] : [];
}

function databaseSettings(config: GeneratorValues) {
	return {
		name: getString(config, 'dbName', 'arcane'),
		user: getString(config, 'dbUser', 'arcane'),
		password: getString(config, 'dbPassword', 'changeme'),
		port: getString(config, 'dbPort', '5432')
	};
}

function buildPostgresService(config: GeneratorValues): ComposeRecord {
	const database = databaseSettings(config);
	return {
		image: 'postgres:17-alpine',
		container_name: 'arcane-postgres',
		restart: 'unless-stopped',
		environment: [
			`POSTGRES_DB=${database.name}`,
			`POSTGRES_USER=${database.user}`,
			`POSTGRES_PASSWORD=${database.password}`
		],
		volumes: ['postgres-data:/var/lib/postgresql/data'],
		ports: [quoteYamlScalar(`${database.port}:5432`)]
	};
}

function buildDockerCompose(config: GeneratorValues): ComposeDocument {
	const useSocketProxy = config.useSocketProxy === true;
	const useDatabase = config.enableDatabase === true;
	const selinux = config.enableSelinux === true;
	const lxc = config.lxc === true;
	const dataVolume = getString(config, 'dataPath', 'arcane-data');
	const projectsPath = getString(config, 'projectsHostPath', '');
	const database = databaseSettings(config);
	const dependsOn = [
		...(useSocketProxy ? ['docker-socket-proxy'] : []),
		...(useDatabase ? ['postgres'] : [])
	];

	const arcane: ComposeRecord = {
		image: getManagerImage(config),
		container_name: 'arcane',
		ports: [quoteYamlScalar(`${getString(config, 'port', '3552')}:3552`)],
		...(selinux && !useSocketProxy ? { security_opt: ['label:disable'] } : {}),
		volumes: [
			...(useSocketProxy
				? []
				: [`${getString(config, 'dockerSocket', '/var/run/docker.sock')}:/var/run/docker.sock`]),
			`${dataVolume}:/app/data`,
			...(projectsPath ? [`${projectsPath}:${projectsPath}${selinux ? ':z' : ''}`] : []),
			...(lxc ? ['/sys/fs/cgroup:/sys/fs/cgroup:ro'] : [])
		],
		environment: [
			...buildEnvironment({ target: 'docker', config }),
			...projectsEnvironment(projectsPath),
			...(useSocketProxy ? ['DOCKER_HOST=tcp://docker-socket-proxy:2375'] : []),
			...(useDatabase
				? [
						`ARCANE_DATABASE_URL=postgresql://${database.user}:${database.password}@postgres:5432/${database.name}`
					]
				: [])
		],
		...(useSocketProxy ? { networks: [SOCKET_PROXY_NETWORK] } : {}),
		...(dependsOn.length > 0 ? { depends_on: dependsOn } : {}),
		...(lxc ? {} : { cgroup: 'host' }),
		...(config.healthcheck === true ? { healthcheck: ARCANE_HEALTHCHECK } : {}),
		restart: 'unless-stopped'
	};

	return {
		services: {
			...(useSocketProxy
				? { 'docker-socket-proxy': buildSocketProxyService(getSocketProxyProvider(config)) }
				: {}),
			arcane,
			...(useDatabase ? { postgres: buildPostgresService(config) } : {})
		},
		volumes: {
			[dataVolume]: useSocketProxy ? { name: dataVolume } : {},
			...(useDatabase ? { 'postgres-data': {} } : {})
		},
		networks: useSocketProxy
			? { [SOCKET_PROXY_NETWORK]: { driver: 'bridge', name: SOCKET_PROXY_NETWORK } }
			: {}
	};
}

function buildPodmanCompose(
	target: 'podman-rootless' | 'podman-rootful',
	config: GeneratorValues
): ComposeDocument {
	const rootless = target === 'podman-rootless';
	const systemdAccess = config.systemdAccess === true;
	const uid = getString(config, 'puid', '1000');
	const dataVolume = getString(config, 'dataPath', 'arcane-data');
	const projectsPath = getString(config, 'projectsHostPath', '');
	const socket = rootless ? `/run/user/${uid}/podman/podman.sock` : '/run/podman/podman.sock';
	const bus = rootless ? `/run/user/${uid}/bus` : '/run/dbus/system_bus_socket';

	const arcane: ComposeRecord = {
		image: getPodmanManagerImage(config),
		container_name: 'arcane',
		...(rootless && systemdAccess ? { user: quoteYamlScalar('0:0'), userns_mode: 'keep-id' } : {}),
		ports: [quoteYamlScalar(`${getString(config, 'port', '3552')}:3552`)],
		volumes: [
			`${socket}:/var/run/docker.sock`,
			...(systemdAccess ? [`${bus}:${bus}`] : []),
			`${dataVolume}:/app/data`,
			...(projectsPath ? [`${projectsPath}:${projectsPath}`] : [])
		],
		environment: [
			...buildEnvironment({ target, config }),
			...(rootless && systemdAccess ? [`DBUS_SESSION_BUS_ADDRESS=unix:path=${bus}`] : []),
			...(!rootless && systemdAccess ? ['PUID=0', 'PGID=0'] : []),
			...projectsEnvironment(projectsPath)
		],
		security_opt: ['label=disable'],
		cgroup: 'host',
		healthcheck: ARCANE_HEALTHCHECK,
		restart: 'unless-stopped'
	};

	return {
		services: { arcane },
		volumes: { [dataVolume]: {} },
		networks: {}
	};
}

function buildAgentCompose(config: GeneratorValues): ComposeDocument {
	const context = { target: 'agent-edge' as const, config };
	const lxc = config.lxc === true;

	const agent: ComposeRecord = {
		image: AGENT_IMAGE,
		container_name: 'arcane-edge-agent',
		...(lxc ? { pid: 'host' } : {}),
		environment: [...agentConnectionEnvironment(context), ...buildEnvironment(context)],
		volumes: [
			`${getString(config, 'dockerSocket', '/var/run/docker.sock')}:/var/run/docker.sock`,
			'arcane-data:/app/data',
			...(lxc ? ['/proc:/proc'] : [])
		],
		restart: 'unless-stopped'
	};

	return {
		services: { 'arcane-edge-agent': agent },
		volumes: { 'arcane-data': {} },
		networks: {}
	};
}

function agentConnectionEnvironment(context: FieldContext): string[] {
	const { config } = context;
	return [
		'ARCANE_EDGE_AGENT=true',
		`ARCANE_EDGE_TRANSPORT=${getString(config, 'edgeTransport', 'auto')}`,
		`ARCANE_AGENT_TOKEN=${getString(config, 'agentToken', AGENT_TOKEN_PLACEHOLDER)}`,
		`ARCANE_MANAGER_API_URL=${getString(config, 'managerUrl', MANAGER_URL_PLACEHOLDER)}`
	];
}

function appendYamlValue(lines: string[], key: string, value: unknown, indent: number): void {
	const prefix = ' '.repeat(indent);
	if (Array.isArray(value)) {
		lines.push(`${prefix}${key}:`);
		for (const item of value) lines.push(`${prefix}  - ${item}`);
		return;
	}
	if (typeof value === 'object' && value !== null) {
		lines.push(`${prefix}${key}:`);
		for (const [nestedKey, nestedValue] of Object.entries(value)) {
			appendYamlValue(lines, nestedKey, nestedValue, indent + 2);
		}
		return;
	}
	lines.push(`${prefix}${key}: ${value}`);
}

function appendYamlSection(
	lines: string[],
	name: string,
	section: ComposeSection,
	blankAfterEntry = false
): void {
	lines.push(`${name}:`);
	for (const [entryName, entryConfig] of Object.entries(section)) {
		lines.push(`  ${entryName}:`);
		for (const [key, value] of Object.entries(entryConfig)) {
			appendYamlValue(lines, key, value, 4);
		}
		if (blankAfterEntry) lines.push('');
	}
}

function formatYaml(document: ComposeDocument): string {
	const lines = ['# Arcane Docker Compose Configuration', `# Generated at ${generatedAt}`, ''];

	appendYamlSection(lines, 'services', document.services, true);
	if (Object.keys(document.networks).length > 0) {
		appendYamlSection(lines, 'networks', document.networks);
		lines.push('');
	}
	appendYamlSection(lines, 'volumes', document.volumes);

	return lines.join('\n');
}

function composeFile(document: ComposeDocument): GeneratedFile {
	return {
		id: 'compose',
		title: 'Compose file',
		description: 'Save this as compose.yaml.',
		filename: 'compose.yaml',
		lang: 'yaml',
		code: formatYaml(document)
	};
}

function buildQuadlet(config: GeneratorValues): string {
	const systemdAccess = config.systemdAccess === true;
	const port = getString(config, 'port', '3552');
	const projectsPath = getString(config, 'projectsHostPath', '');
	const environment = [
		...buildEnvironment({ target: 'podman-quadlet', config }),
		'ARCANE_ENCRYPTION_KEY_FILE=/run/secrets/arcane-key',
		...(systemdAccess ? ['DBUS_SESSION_BUS_ADDRESS=unix:path=%t/bus'] : []),
		...projectsEnvironment(projectsPath)
	];

	return [
		'[Unit]',
		'Description=Arcane Manager (rootless Podman)',
		'Documentation=https://getarcane.app/docs/podman/setup',
		'Requires=podman.socket',
		'After=podman.socket',
		'',
		'[Container]',
		`Image=${getPodmanManagerImage(config)}`,
		'ContainerName=arcane',
		'Pull=missing',
		'AutoUpdate=registry',
		'SecurityLabelDisable=true',
		'PodmanArgs=--cgroupns=host',
		...(systemdAccess ? ['User=0:0', 'UserNS=keep-id'] : []),
		'',
		`PublishPort=${config.localOnly === true ? '127.0.0.1:' : ''}${port}:3552`,
		'Volume=%t/podman/podman.sock:/var/run/docker.sock',
		...(systemdAccess ? ['Volume=%t/bus:%t/bus'] : []),
		`Volume=${getString(config, 'dataPath', 'arcane-data')}:/app/data`,
		...(projectsPath ? [`Volume=${projectsPath}:${projectsPath}`] : []),
		'Secret=arcane-encryption-key,type=mount,target=/run/secrets/arcane-key,mode=0444',
		'',
		...environment.map((entry) => `Environment=${entry}`),
		'',
		'HealthCmd=["./arcane","health","--timeout","2s"]',
		'HealthInterval=10s',
		'HealthTimeout=3s',
		'HealthRetries=5',
		'HealthStartPeriod=15s',
		'Notify=healthy',
		'',
		'[Service]',
		'Restart=always',
		'TimeoutStartSec=900',
		'TimeoutStopSec=70',
		'',
		'[Install]',
		'WantedBy=default.target'
	].join('\n');
}

const ENABLE_ROOTLESS_SOCKET: GeneratedFile = {
	id: 'socket',
	title: 'Enable the rootless Podman socket',
	description: 'Lingering keeps your user services running without an interactive login.',
	lang: 'bash',
	code: ['systemctl --user enable --now podman.socket', 'loginctl enable-linger "$USER"'].join('\n')
};

function quadletFiles(config: GeneratorValues): GeneratedFile[] {
	return [
		ENABLE_ROOTLESS_SOCKET,
		{
			id: 'secret',
			title: 'Create the encryption key',
			description:
				"Store the key as a Podman secret, then print it and save a copy outside this host. If both are lost, Arcane can't decrypt the encrypted values in its database.",
			lang: 'bash',
			code: [
				'openssl rand -hex 32 | podman secret create arcane-encryption-key -',
				"podman secret inspect --showsecret --format '{{.SecretData}}' arcane-encryption-key"
			].join('\n')
		},
		{
			id: 'quadlet',
			title: 'Quadlet file',
			description:
				'Save this as ~/.config/containers/systemd/arcane.container. Create the folder if it does not exist.',
			filename: 'arcane.container',
			lang: 'ini',
			code: buildQuadlet(config)
		},
		{
			id: 'start',
			title: 'Start Arcane',
			description:
				'Load the Quadlet, start Arcane, and turn on the Podman auto-update timer that keeps it updated.',
			lang: 'bash',
			code: [
				'systemctl --user daemon-reload',
				'systemctl --user start arcane.service',
				'systemctl --user enable --now podman-auto-update.timer',
				'systemctl --user status arcane.service'
			].join('\n')
		}
	];
}

function agentBinaryFiles(config: GeneratorValues): GeneratedFile[] {
	const context = { target: 'agent-binary' as const, config };

	return [
		{
			id: 'env',
			title: 'Agent environment',
			description: 'Save this as .env next to the arcane-agent binary.',
			filename: '.env',
			lang: 'dotenv',
			code: [
				...agentConnectionEnvironment(context),
				'ARCANE_ENVIRONMENT=production',
				...buildEnvironment(context)
			].join('\n')
		},
		{
			id: 'start',
			title: 'Start the agent',
			lang: 'bash',
			code: './arcane-agent'
		}
	];
}

function startFile(command: string, title = 'Start Arcane'): GeneratedFile {
	return {
		id: 'start',
		title,
		lang: 'bash',
		code: command
	};
}

export function generateInstance(
	target: DeploymentTargetId,
	config: GeneratorValues
): GeneratedFile[] {
	switch (target) {
		case 'docker':
			return [composeFile(buildDockerCompose(config)), startFile('docker compose up -d')];
		case 'podman-rootless':
			return [
				ENABLE_ROOTLESS_SOCKET,
				composeFile(buildPodmanCompose(target, config)),
				startFile('podman compose up -d')
			];
		case 'podman-rootful':
			return [
				composeFile(buildPodmanCompose(target, config)),
				startFile('sudo podman compose up -d')
			];
		case 'podman-quadlet':
			return quadletFiles(config);
		case 'agent-edge':
			return [
				composeFile(buildAgentCompose(config)),
				startFile('docker compose up -d', 'Start the agent')
			];
		case 'agent-binary':
			return agentBinaryFiles(config);
	}
}
