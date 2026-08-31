import { getAllFields } from '#lib/config/compose-generator.js';

type GeneratorConfig = Record<string, string | boolean>;
type ComposeRecord = Record<string, unknown>;
type ComposeSection = Record<string, ComposeRecord>;
type ComposeField = ReturnType<typeof getAllFields>[number];

export const MANAGER_IMAGES = {
	ghcr: 'ghcr.io/getarcaneapp/manager:latest',
	quay: 'quay.io/getarcaneapp/manager:latest',
	docker: 'getarcaneapp/manager:latest'
} as const;

type ImageRegistry = keyof typeof MANAGER_IMAGES;

type SocketProxyProvider = 'wollomatic' | 'tecnativa';

interface GeneratorOptions {
	port: string;
	dataPath: string;
	dockerSocket: string;
	useSocketProxy: boolean;
	socketProxyProvider: SocketProxyProvider;
	enableSelinux: boolean;
	projectsHostPath: string;
	image: string;
}

interface ComposeDocument {
	services: ComposeSection;
	volumes: ComposeSection;
	networks: ComposeSection;
}

const PROJECTS_CONTAINER_PATH = '/app/data/projects';
const SOCKET_PROXY_NETWORK = 'arcane-internal';

function generateRandomKey(): string {
	return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
		byte.toString(16).padStart(2, '0')
	).join('');
}

function getString(config: GeneratorConfig, key: string, fallback: string): string {
	const value = config[key];
	return typeof value === 'string' && value ? value : fallback;
}

function getManagerImage(config: GeneratorConfig): string {
	const registry = getString(config, 'registry', 'ghcr');
	return MANAGER_IMAGES[registry as ImageRegistry] ?? MANAGER_IMAGES.ghcr;
}

function getSocketProxyProvider(config: GeneratorConfig): SocketProxyProvider {
	return getString(config, 'socketProxyProvider', 'wollomatic') === 'tecnativa'
		? 'tecnativa'
		: 'wollomatic';
}

function getGeneratorOptions(config: GeneratorConfig): GeneratorOptions {
	return {
		port: getString(config, 'port', '3552'),
		dataPath: getString(config, 'dataPath', 'arcane-data'),
		dockerSocket: getString(config, 'dockerSocket', '/var/run/docker.sock'),
		useSocketProxy: config.useSocketProxy === true,
		socketProxyProvider: getSocketProxyProvider(config),
		enableSelinux: config.enableSelinux === true,
		projectsHostPath: getString(config, 'projectsHostPath', '').trim(),
		image: getManagerImage(config)
	};
}

function getEnvironmentEntry(field: ComposeField, config: GeneratorConfig): string | null {
	if (!field.includeInCompose || !field.envName) return null;
	if (field.dependsOn && !config[field.dependsOn]) return null;

	const value = config[field.key];
	if (typeof value === 'boolean') return `${field.envName}=${value}`;
	if (typeof value === 'string' && value.trim()) return `${field.envName}=${value}`;
	if (field.canGenerate) return `${field.envName}=${generateRandomKey()}`;
	return null;
}

function buildEnvironment(config: GeneratorConfig): string[] {
	const environment = getAllFields().flatMap((field) => {
		const entry = getEnvironmentEntry(field, config);
		return entry ? [entry] : [];
	});

	if (!config.enableDatabase) {
		environment.push(
			'DATABASE_URL=file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate'
		);
	}

	return environment;
}

function buildArcaneVolumes(options: GeneratorOptions, environment: string[]): string[] {
	const volumes = [`${options.dataPath}:/app/data`];
	if (!options.useSocketProxy) {
		volumes.push(`${options.dockerSocket}:/var/run/docker.sock`);
	}

	if (options.projectsHostPath) {
		const selinuxSuffix = options.enableSelinux ? ':z' : '';
		volumes.push(`${options.projectsHostPath}:${PROJECTS_CONTAINER_PATH}${selinuxSuffix}`);
		environment.push(`PROJECTS_DIRECTORY=${PROJECTS_CONTAINER_PATH}`);
	}

	return volumes;
}

function buildArcaneService(options: GeneratorOptions, environment: string[]): ComposeRecord {
	const service: ComposeRecord = {
		image: options.image,
		container_name: 'arcane',
		restart: 'unless-stopped',
		ports: [`${options.port}:3552`],
		volumes: buildArcaneVolumes(options, environment),
		environment
	};

	if (options.enableSelinux && !options.useSocketProxy) {
		service.security_opt = ['label:disable'];
	}
	if (options.useSocketProxy) {
		environment.push('DOCKER_HOST=tcp://docker-socket-proxy:2375');
		service.depends_on = ['docker-socket-proxy'];
		service.networks = [SOCKET_PROXY_NETWORK];
	}

	return service;
}

const DOCKER_API_PREFIX = '(/v[\\d.]+)?';

const SOCKET_PROXY_GET_PATHS = [
	'/_ping',
	'/events(/.*)?',
	'/version',
	'/info(/.*)?',
	'/containers(/.*)?',
	'/exec(/.*)?',
	'/images(/.*)?',
	'/networks(/.*)?',
	'/volumes(/.*)?',
	'/distribution(/.*)?',
	'/swarm(/.*)?',
	'/nodes(/.*)?',
	'/services(/.*)?',
	'/tasks(/.*)?',
	'/secrets(/.*)?',
	'/configs(/.*)?'
] as const;

const SOCKET_PROXY_HEAD_PATHS = ['/_ping', '/version'] as const;

const SOCKET_PROXY_POST_PATHS = [
	'/containers(/.*)?',
	'/exec(/.*)?',
	'/images(/.*)?',
	'/networks(/.*)?',
	'/volumes(/.*)?',
	'/commit',
	'/build(/.*)?',
	'/session',
	'/grpc',
	'/auth',
	'/swarm(/.*)?',
	'/nodes(/.*)?',
	'/services(/.*)?',
	'/secrets(/.*)?',
	'/configs(/.*)?'
] as const;

const SOCKET_PROXY_PUT_PATHS = ['/containers(/.*)?'] as const;

const SOCKET_PROXY_DELETE_PATHS = [
	'/containers(/.*)?',
	'/images(/.*)?',
	'/networks(/.*)?',
	'/volumes(/.*)?',
	'/nodes(/.*)?',
	'/services(/.*)?',
	'/secrets(/.*)?',
	'/configs(/.*)?'
] as const;

function quoteYamlScalar(value: string): string {
	return `'${value}'`;
}

function allowFlag(method: string, path: string): string {
	return quoteYamlScalar(`-allow${method}=${DOCKER_API_PREFIX}${path}`);
}

function socketProxyCommand(): string[] {
	return [
		quoteYamlScalar('-listenip=0.0.0.0'),
		quoteYamlScalar('-allowfrom=arcane'),
		quoteYamlScalar('-allowhealthcheck'),
		...SOCKET_PROXY_GET_PATHS.map((path) => allowFlag('GET', path)),
		...SOCKET_PROXY_HEAD_PATHS.map((path) => allowFlag('HEAD', path)),
		...SOCKET_PROXY_POST_PATHS.map((path) => allowFlag('POST', path)),
		...SOCKET_PROXY_PUT_PATHS.map((path) => allowFlag('PUT', path)),
		...SOCKET_PROXY_DELETE_PATHS.map((path) => allowFlag('DELETE', path))
	];
}

function buildWollomaticSocketProxyService(): ComposeRecord {
	return {
		image: 'wollomatic/socket-proxy:1.13.1',
		container_name: 'arcane-docker-proxy',
		user: quoteYamlScalar('0:0'),
		command: socketProxyCommand(),
		volumes: ['/var/run/docker.sock:/var/run/docker.sock:ro'],
		read_only: true,
		cap_drop: ['ALL'],
		security_opt: ['no-new-privileges:true'],
		healthcheck: {
			test: "['CMD', './healthcheck']",
			interval: '2s',
			timeout: '5s',
			retries: 15
		},
		networks: [SOCKET_PROXY_NETWORK],
		restart: 'unless-stopped'
	};
}

function buildTecnativaSocketProxyService(): ComposeRecord {
	return {
		image: 'tecnativa/docker-socket-proxy:latest',
		container_name: 'arcane-docker-proxy',
		environment: [
			'EVENTS=1',
			'PING=1',
			'VERSION=1',
			'AUTH=1',
			'SECRETS=1',
			'POST=1',
			'BUILD=1',
			'COMMIT=1',
			'CONFIGS=1',
			'CONTAINERS=1',
			'DISTRIBUTION=1',
			'EXEC=1',
			'IMAGES=1',
			'INFO=1',
			'NETWORKS=1',
			'NODES=1',
			'PLUGINS=0',
			'SERVICES=1',
			'SESSION=1',
			'SWARM=1',
			'SYSTEM=0',
			'TASKS=1',
			'VOLUMES=1'
		],
		volumes: ['/var/run/docker.sock:/var/run/docker.sock:ro'],
		networks: [SOCKET_PROXY_NETWORK],
		restart: 'unless-stopped',
		security_opt: ['no-new-privileges:true']
	};
}

function buildSocketProxyService(provider: SocketProxyProvider): ComposeRecord {
	return provider === 'tecnativa'
		? buildTecnativaSocketProxyService()
		: buildWollomaticSocketProxyService();
}

function addSocketProxy(document: ComposeDocument, provider: SocketProxyProvider): void {
	document.services['docker-socket-proxy'] = buildSocketProxyService(provider);
	document.networks[SOCKET_PROXY_NETWORK] = {
		driver: 'bridge',
		name: SOCKET_PROXY_NETWORK
	};
}

function addPostgres(config: GeneratorConfig, document: ComposeDocument): void {
	const database = {
		name: getString(config, 'dbName', 'arcane'),
		user: getString(config, 'dbUser', 'arcane'),
		password: getString(config, 'dbPassword', 'changeme'),
		port: getString(config, 'dbPort', '5432')
	};

	document.services.postgres = {
		image: 'postgres:17-alpine',
		container_name: 'arcane-postgres',
		restart: 'unless-stopped',
		environment: [
			`POSTGRES_DB=${database.name}`,
			`POSTGRES_USER=${database.user}`,
			`POSTGRES_PASSWORD=${database.password}`
		],
		volumes: ['postgres-data:/var/lib/postgresql/data'],
		ports: [`${database.port}:5432`]
	};

	const arcane = document.services.arcane;
	const environment = arcane.environment as string[];
	environment.push(
		`DATABASE_URL=postgresql://${database.user}:${database.password}@postgres:5432/${database.name}`
	);
	arcane.depends_on = [
		...new Set([...((arcane.depends_on as string[] | undefined) ?? []), 'postgres'])
	];
	document.volumes['postgres-data'] = { driver: 'local' };
}

function buildComposeDocument(config: GeneratorConfig): ComposeDocument {
	const options = getGeneratorOptions(config);
	const environment = buildEnvironment(config);
	const document: ComposeDocument = {
		services: { arcane: buildArcaneService(options, environment) },
		volumes: { [options.dataPath]: { driver: 'local' } },
		networks: {}
	};

	if (options.useSocketProxy) addSocketProxy(document, options.socketProxyProvider);
	if (config.enableDatabase) addPostgres(config, document);
	return document;
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
	const lines = [
		'# Arcane Docker Compose Configuration',
		`# Generated at ${new Date().toLocaleString()}`,
		''
	];

	appendYamlSection(lines, 'services', document.services, true);
	appendYamlSection(lines, 'volumes', document.volumes);
	if (Object.keys(document.networks).length > 0) {
		lines.push('');
		appendYamlSection(lines, 'networks', document.networks);
	}

	return lines.join('\n');
}

export function generateDockerCompose(config: GeneratorConfig): string {
	return formatYaml(buildComposeDocument(config));
}
