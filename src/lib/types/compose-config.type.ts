export interface DockerComposeConfig {
	// Basic settings
	appUrl: string;
	port: string;
	puid: string;
	pgid: string;
	dataPath: string;
	dockerSocket: string;
	encryptionKey: string;
	jwtSecret: string;

	// Database settings
	enableDatabase: boolean;
	dbType: string;
	dbName: string;
	dbUser: string;
	dbPassword: string;
	dbPort: string;

	// Authentication
	enableOIDC: boolean;
	oidcClientId: string;
	oidcClientSecret: string;
	oidcIssuerUrl: string;
	oidcScopes: string;
}
