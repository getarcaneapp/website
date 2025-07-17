export interface DockerComposeConfig {
	// Basic settings
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
	oidcRedirectUri: string;
	oidcAuthEndpoint: string;
	oidcTokenEndpoint: string;
	oidcUserinfoEndpoint: string;
	oidcScopes: string;
}
