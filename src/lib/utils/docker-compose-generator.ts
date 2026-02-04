import { getAllFields } from '$lib/config/compose-generator.js';

function generateRandomKey(): string {
	return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
		byte.toString(16).padStart(2, '0')
	).join('');
}

export function generateDockerCompose(config: Record<string, string | boolean>): string {
	const fields = getAllFields();
	const environment: string[] = [];

	// Build environment variables from config
	for (const field of fields) {
		if (!field.includeInCompose || !field.envName) continue;

		const value = config[field.key];

		// Skip if depends on a toggle that's disabled
		if (field.dependsOn && !config[field.dependsOn]) continue;

		// Handle different value types
		if (typeof value === 'boolean') {
			environment.push(`${field.envName}=${value}`);
		} else if (typeof value === 'string' && value.trim()) {
			environment.push(`${field.envName}=${value}`);
		} else if (field.canGenerate) {
			// Auto-generate secrets if empty
			environment.push(`${field.envName}=${generateRandomKey()}`);
		}
	}

	// Add SQLite database URL if not using external database
	if (!config.enableDatabase) {
		environment.push(
			'DATABASE_URL=file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate'
		);
	}

	const port = (config.port as string) || '3552';
	const dataPath = (config.dataPath as string) || 'arcane-data';
	const dockerSocket = (config.dockerSocket as string) || '/var/run/docker.sock';

	const services: Record<string, unknown> = {
		arcane: {
			image: 'ghcr.io/getarcaneapp/arcane:latest',
			container_name: 'arcane',
			restart: 'unless-stopped',
			ports: [`${port}:3552`],
			volumes: [`${dockerSocket}:/var/run/docker.sock`, `${dataPath}:/app/data`],
			environment
		}
	};

	const volumes: Record<string, { driver: string }> = {
		[dataPath]: { driver: 'local' }
	};

	// Add PostgreSQL service if enabled
	if (config.enableDatabase) {
		const dbName = (config.dbName as string) || 'arcane';
		const dbUser = (config.dbUser as string) || 'arcane';
		const dbPassword = (config.dbPassword as string) || 'changeme';
		const dbPort = (config.dbPort as string) || '5432';

		services.postgres = {
			image: 'postgres:17-alpine',
			container_name: 'arcane-postgres',
			restart: 'unless-stopped',
			environment: [
				`POSTGRES_DB=${dbName}`,
				`POSTGRES_USER=${dbUser}`,
				`POSTGRES_PASSWORD=${dbPassword}`
			],
			volumes: ['postgres-data:/var/lib/postgresql/data'],
			ports: [`${dbPort}:5432`]
		};

		// Add DATABASE_URL to arcane service
		(services.arcane as { environment: string[] }).environment.push(
			`DATABASE_URL=postgresql://${dbUser}:${dbPassword}@postgres:5432/${dbName}`
		);

		(services.arcane as { depends_on?: string[] }).depends_on = ['postgres'];
		volumes['postgres-data'] = { driver: 'local' };
	}

	return formatYaml(services, volumes);
}

function formatYaml(
	services: Record<string, unknown>,
	volumes: Record<string, { driver: string }>
): string {
	const lines: string[] = [
		'# Arcane Docker Compose Configuration',
		`# Generated at ${new Date().toLocaleString()}`,
		'',
		'services:'
	];

	for (const [serviceName, serviceConfig] of Object.entries(services)) {
		lines.push(`  ${serviceName}:`);
		for (const [key, value] of Object.entries(serviceConfig as Record<string, unknown>)) {
			if (Array.isArray(value)) {
				lines.push(`    ${key}:`);
				for (const item of value) {
					lines.push(`      - ${item}`);
				}
			} else if (typeof value === 'object' && value !== null) {
				lines.push(`    ${key}:`);
				for (const [subKey, subValue] of Object.entries(value as Record<string, unknown>)) {
					if (Array.isArray(subValue)) {
						lines.push(`      ${subKey}:`);
						for (const item of subValue) {
							lines.push(`        - ${item}`);
						}
					} else {
						lines.push(`      ${subKey}: ${subValue}`);
					}
				}
			} else {
				lines.push(`    ${key}: ${value}`);
			}
		}
		lines.push('');
	}

	lines.push('volumes:');
	for (const [volumeName, volumeConfig] of Object.entries(volumes)) {
		lines.push(`  ${volumeName}:`);
		for (const [key, value] of Object.entries(volumeConfig)) {
			lines.push(`    ${key}: ${value}`);
		}
	}

	return lines.join('\n');
}
