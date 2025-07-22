import type { DockerComposeConfig } from '$lib/types/compose-config.type';

function generateRandomKey(): string {
	return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function generateDockerCompose(config: DockerComposeConfig): string {
	const environment = [`PUID=${config.puid}`, `PGID=${config.pgid}`];

	// Generate encryption key and JWT secret if not provided (required)
	const encryptionKey = config.encryptionKey || generateRandomKey();
	const jwtSecret = config.jwtSecret || generateRandomKey();

	environment.push(`ENCRYPTION_KEY=${encryptionKey}`);
	environment.push(`JWT_SECRET=${jwtSecret}`);

	// Default SQLite database
	if (!config.enableDatabase) {
		environment.push('DATABASE_URL=sqlite:///app/data/arcane.db');
	}

	const services: any = {
		arcane: {
			image: 'ghcr.io/ofkm/arcane:latest',
			container_name: 'arcane',
			restart: 'unless-stopped',
			ports: [`${config.port}:8080`],
			volumes: [`${config.dockerSocket}:/var/run/docker.sock`, `${config.dataPath}:/app/data`],
			environment
		}
	};

	// Add external database if enabled (PostgreSQL only)
	if (config.enableDatabase && config.dbType === 'postgres') {
		services.postgres = {
			image: 'postgres:16-alpine',
			container_name: 'arcane-postgres',
			restart: 'unless-stopped',
			environment: [
				`POSTGRES_DB=${config.dbName}`,
				`POSTGRES_USER=${config.dbUser}`,
				`POSTGRES_PASSWORD=${config.dbPassword}`
			],
			volumes: [`postgres-data:/var/lib/postgresql/data`],
			ports: [`${config.dbPort}:5432`]
		};

		services.arcane.environment.push(
			`DATABASE_URL=postgresql://${config.dbUser}:${config.dbPassword}@postgres:5432/${config.dbName}`
		);
		services.arcane.depends_on = ['postgres'];
	}

	// Add OIDC configuration
	if (config.enableOIDC) {
		services.arcane.environment.push(
			'OIDC_ENABLED=true',
			`OIDC_CLIENT_ID=${config.oidcClientId}`,
			`OIDC_CLIENT_SECRET=${config.oidcClientSecret}`,
			`OIDC_REDIRECT_URI=${config.oidcRedirectUri}`,
			`OIDC_AUTHORIZATION_ENDPOINT=${config.oidcAuthEndpoint}`,
			`OIDC_TOKEN_ENDPOINT=${config.oidcTokenEndpoint}`,
			`OIDC_USERINFO_ENDPOINT=${config.oidcUserinfoEndpoint}`,
			`OIDC_SCOPES=${config.oidcScopes}`
		);
	}

	// Create volumes section
	const volumes: any = {
		[config.dataPath]: {
			driver: 'local'
		}
	};

	if (config.enableDatabase && config.dbType === 'postgres') {
		volumes['postgres-data'] = { driver: 'local' };
	}

	const compose = {
		services,
		volumes
	};

	return `# Arcane Docker Compose Configuration
# Generated at ${new Date().toLocaleString()}

services:
${Object.entries(compose.services)
	.map(([serviceName, serviceConfig]) => {
		const yamlLines = [`  ${serviceName}:`];
		Object.entries(serviceConfig as any).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				yamlLines.push(`    ${key}:`);
				value.forEach((item) => yamlLines.push(`      - ${item}`));
			} else if (typeof value === 'object' && value !== null) {
				yamlLines.push(`    ${key}:`);
				Object.entries(value).forEach(([subKey, subValue]) => {
					if (Array.isArray(subValue)) {
						yamlLines.push(`      ${subKey}:`);
						subValue.forEach((item) => yamlLines.push(`        - ${item}`));
					} else {
						yamlLines.push(`      ${subKey}: ${subValue}`);
					}
				});
			} else {
				yamlLines.push(`    ${key}: ${value}`);
			}
		});
		return yamlLines.join('\n');
	})
	.join('\n\n')}

volumes:
${Object.entries(compose.volumes)
	.map(([volumeName, volumeConfig]) => {
		const yamlLines = [`  ${volumeName}:`];
		Object.entries(volumeConfig as any).forEach(([key, value]) => {
			yamlLines.push(`    ${key}: ${value}`);
		});
		return yamlLines.join('\n');
	})
	.join('\n')}`;
}
