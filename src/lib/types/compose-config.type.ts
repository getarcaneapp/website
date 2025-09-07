export interface DockerComposeConfig {
	appUrl: string;
	port: string;
	puid: string;
	pgid: string;
	dataPath: string;
	dockerSocket: string;
	encryptionKey: string;
	jwtSecret: string;

	enableDatabase: boolean;
	dbType: 'postgres';
	dbName: string;
	dbUser: string;
	dbPassword: string;
	dbPort: string;

	enableOIDC: boolean;
	oidcClientId: string;
	oidcClientSecret: string;
	oidcIssuerUrl: string;
	oidcScopes: string;
}
