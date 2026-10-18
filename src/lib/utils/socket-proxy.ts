export type SocketProxyProvider = 'wollomatic' | 'tecnativa';

type ComposeRecord = Record<string, unknown>;

export const SOCKET_PROXY_NETWORK = 'arcane-internal';

const DOCKER_API_PREFIX = '(/v[\\d.]+)?';

const SOCKET_PROXY_GET_PATHS = [
	'/_ping',
	'/events(/.*)?',
	'/version',
	'/info(/.*)?',
	'/system/df',
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

const TECNATIVA_SWITCHES = [
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
	'DISTRIBUTION=1',
	'EXEC=1',
	'IMAGES=1',
	'INFO=1',
	'NETWORKS=1',
	'NODES=0',
	'PLUGINS=0',
	'SERVICES=0',
	'SESSION=0',
	'SWARM=0',
	'SYSTEM=1',
	'TASKS=0',
	'VOLUMES=1'
] as const;

export function quoteYamlScalar(value: string): string {
	return `'${value}'`;
}

function allowFlag(method: string, path: string): string {
	return quoteYamlScalar(`-allow${method}=${DOCKER_API_PREFIX}${path}`);
}

function socketProxyCommand(): string[] {
	return [
		quoteYamlScalar('-listenip=0.0.0.0'),
		quoteYamlScalar('-allowfrom=arcane,arcane-upgrader'),
		quoteYamlScalar('-allowhealthcheck'),
		...SOCKET_PROXY_GET_PATHS.map((path) => allowFlag('GET', path)),
		...SOCKET_PROXY_HEAD_PATHS.map((path) => allowFlag('HEAD', path)),
		...SOCKET_PROXY_POST_PATHS.map((path) => allowFlag('POST', path)),
		...SOCKET_PROXY_PUT_PATHS.map((path) => allowFlag('PUT', path)),
		...SOCKET_PROXY_DELETE_PATHS.map((path) => allowFlag('DELETE', path))
	];
}

export function buildSocketProxyService(provider: SocketProxyProvider): ComposeRecord {
	if (provider === 'tecnativa') {
		return {
			image: 'tecnativa/docker-socket-proxy:latest',
			container_name: 'arcane-docker-proxy',
			environment: [...TECNATIVA_SWITCHES],
			volumes: ['/var/run/docker.sock:/var/run/docker.sock:ro'],
			networks: [SOCKET_PROXY_NETWORK],
			restart: 'unless-stopped',
			security_opt: ['no-new-privileges:true']
		};
	}

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
