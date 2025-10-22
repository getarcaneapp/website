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
		name: 'arcane',
		description: 'Runs the Arcane server or agent. Use `arcane [command]` to run other commands.',
		usage: 'arcane',
		flags: []
	},

	generate: {
		name: 'arcane generate',
		description: "Generate secrets for Arcane's backend",
		aliases: ['generate', 'gen', 'g'],
		usage: 'arcane generate [command]',
		flags: [{ name: '-h, --help', description: 'help for generate' }],
		subcommands: [{ name: 'secret', description: 'Generate cryptographic secrets' }]
	},

	secret: {
		name: 'arcane generate secret',
		description: 'Generate secure cryptographic secrets for ENCRYPTION_KEY and JWT_SECRET.',
		usage: 'arcane generate secret [flags]',
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
			'# Generate a base64-encoded 32-byte secret (default)\narcane generate secret',
			'# Generate a secret formatted for Docker Compose .env\narcane generate secret --format env',
			'# Generate a 64-byte secret in hex format\narcane generate secret --length 64 --format hex'
		]
	},

	version: {
		name: 'arcane version',
		description: 'Print version information for the arcane binary.',
		usage: 'arcane version',
		flags: []
	},

	help: {
		name: 'arcane help',
		description: 'Show help for a specific command or general help.',
		usage: 'arcane help [command]',
		flags: [],
		examples: ['arcane help generate', 'arcane help generate secret']
	}
};
