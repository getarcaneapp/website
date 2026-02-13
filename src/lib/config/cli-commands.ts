export interface Flag {
	name: string;
	description: string;
	default?: string;
}

export interface Subcommand {
	name: string;
	description: string;
}

export interface CLICommand {
	name: string;
	description: string;
	aliases?: string[];
	usage: string;
	flags: Flag[];
	globalFlags?: Flag[];
	subcommands?: Subcommand[];
	examples?: string[];
}

export const ARCANE_COMMANDS: Record<string, CLICommand> = {
	root: {
		name: 'arcane-cli',
		description:
			'Runs the Arcane server or agent. Use `arcane-cli [command]` to run other commands.',
		usage: 'arcane-cli',
		flags: []
	},

	generate: {
		name: 'arcane-cli generate',
		description: "Generate secrets for Arcane's backend",
		aliases: ['generate', 'gen', 'g'],
		usage: 'arcane-cli generate [command]',
		flags: [{ name: '-h, --help', description: 'help for generate' }],
		subcommands: [{ name: 'secret', description: 'Generate cryptographic secrets' }]
	},

	secret: {
		name: 'arcane-cli generate secret',
		description: 'Generate secure cryptographic secrets for ENCRYPTION_KEY and JWT_SECRET.',
		usage: 'arcane-cli generate secret [flags]',
		flags: [
			{
				name: '-f, --format string',
				description: 'output format: base64, hex, env, docker, all',
				default: 'base64'
			},
			{ name: '-h, --help', description: 'help for secret' },
			{
				name: '-l, --length int',
				description: 'secret length in bytes (default: 32 for AES-256)',
				default: '32'
			}
		],
		examples: [
			'# Generate a base64-encoded 32-byte secret (default)\narcane-cli generate secret',
			'# Generate a secret formatted for Docker Compose .env\narcane-cli generate secret --format env',
			'# Generate a 64-byte secret in hex format\narcane-cli generate secret --length 64 --format hex'
		]
	},

	version: {
		name: 'arcane-cli version',
		description: 'Print version information for the arcane binary.',
		usage: 'arcane-cli version',
		flags: []
	},

	help: {
		name: 'arcane-cli help',
		description: 'Show help for a specific command or general help.',
		usage: 'arcane-cli help [command]',
		flags: [],
		examples: ['arcane-cli help generate', 'arcane-cli help generate secret']
	},

	upgrade: {
		name: 'arcane-cli upgrade',
		description: 'Upgrade an Arcane container from outside the container itself.',
		usage: 'arcane-cli upgrade [flags]',
		flags: [
			{
				name: '-a, --auto',
				description: 'Auto-detect the Arcane container'
			},
			{
				name: '-c, --container string',
				description: 'Specify container name to upgrade'
			},
			{
				name: '-i, --image string',
				description: 'Specify target image (defaults to current tag)'
			},
			{
				name: '-h, --help',
				description: 'help for upgrade'
			}
		],
		examples: [
			'# Auto-detect and upgrade the Arcane container\ndocker run --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/getarcaneapp/arcane:latest upgrade --auto',
			'# Upgrade a specific container\ndocker run --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/getarcaneapp/arcane:latest upgrade --container arcane',
			'# Upgrade to a specific image tag\ndocker run --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/getarcaneapp/arcane:latest upgrade --container arcane --image ghcr.io/getarcaneapp/arcane:v1.2.3'
		]
	}
};
