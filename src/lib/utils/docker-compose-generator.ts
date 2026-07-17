import { getAllFields } from '$lib/config/compose-generator.js';

type GeneratorConfig = Record<string, string | boolean>;
type ComposeRecord = Record<string, unknown>;
type ComposeSection = Record<string, ComposeRecord>;
type ComposeField = ReturnType<typeof getAllFields>[number];

interface GeneratorOptions {
	port: string;
	dataPath: string;
	dockerSocket: string;
	useSocketProxy: boolean;
	enableSelinux: boolean;
	projectsHostPath: string;
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

function getGeneratorOptions(config: GeneratorConfig): GeneratorOptions {
	return {
		port: getString(config, 'port', '3552'),
		dataPath: getString(config, 'dataPath', 'arcane-data'),
		dockerSocket: getString(config, 'dockerSocket', '/var/run/docker.sock'),
		useSocketProxy: config.useSocketProxy === true,
		enableSelinux: config.enableSelinux === true,
		projectsHostPath: getString(config, 'projectsHostPath', '').trim()
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
		image: 'ghcr.io/getarcaneapp/manager:latest',
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

function buildSocketProxyService(): ComposeRecord {
	return {
		image: 'tecnativa/docker-socket-proxy:latest',
		container_name: 'arcane-docker-proxy',
		privileged: true,
		environment: [
			'EVENTS=1',
			'PING=1',
			'VERSION=1',
			'AUTH=0',
			'SECRETS=0',
			'POST=1',
			'BUILD=0',
			'COMMIT=0',
			'CONFIGS=0',
			'CONTAINERS=1',
			'DISTRIBUTION=0',
			'EXEC=1',
			'IMAGES=1',
			'INFO=1',
			'NETWORKS=1',
			'NODES=0',
			'PLUGINS=0',
			'SERVICES=0',
			'SESSION=0',
			'SWARM=0',
			'SYSTEM=0',
			'TASKS=0',
			'VOLUMES=1'
		],
		volumes: ['/var/run/docker.sock:/var/run/docker.sock:ro'],
		networks: [SOCKET_PROXY_NETWORK],
		restart: 'unless-stopped',
		security_opt: ['no-new-privileges:true']
	};
}

function addSocketProxy(document: ComposeDocument): void {
	document.services['docker-socket-proxy'] = buildSocketProxyService();
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

	if (options.useSocketProxy) addSocketProxy(document);
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
