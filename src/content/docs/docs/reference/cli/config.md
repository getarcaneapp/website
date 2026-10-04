---
title: 'CLI Configuration'
description: 'Point arcane-cli at your server, sign in, and set defaults.'
---

`arcane-cli` keeps its server URL, credentials, and defaults in a YAML config file. Set it up once after you [install the CLI](/docs/reference/cli/install), and change values later with `arcane-cli config set <key> <value>`.

## Set up the CLI

1. Create a starter config file:

```bash
arcane-cli config init
```

2. Set your server URL:

```bash
arcane-cli config set server-url http://localhost:3552
```

3. Sign in with one of the methods below.

## Sign in

### With a device code

Use this when your Arcane server has OIDC set up and you want to sign in through your identity provider in a browser.

```bash
arcane-cli auth login
```

Device-code login can't complete an MFA challenge. If your account has passkey MFA turned on, use an API key instead. See [Passkeys & MFA](/docs/access/passkeys).

### With an API key

Use this for CI/CD, automation, or accounts with MFA.

```bash
arcane-cli config set api-key arc_xxxxxxx
```

## Change list limits

List commands are paginated. The page size is chosen in this order:

1. `--limit` on the command
2. `pagination.resources.<resource>.limit` in the config
3. `pagination.default.limit` in the config
4. The command's built-in default

Set limits from the CLI:

```bash
arcane-cli config set default-limit 25
```

```bash
arcane-cli config set pagination.resources.containers.limit 50 pagination.resources.images.limit 100
```

You can also edit `pagination` in the config file directly (see the example below). The resource names are `containers`, `images`, `volumes`, `networks`, `projects`, `environments`, `registries`, `templates`, `repos`, `gitops-syncs`, `users`, `roles`, `events`, and `apikeys`.

For `doctor`, shell completion, and other commands, see [CLI Commands](/docs/reference/cli/commands).

## Reference

### Config file

The config file is at `~/.config/arcanecli.yml` by default. Print the exact path on your system with:

```bash
arcane-cli config path
```

A typical config file:

```yaml
api_key: ''
cli_update_channel: stable
default_environment: '0'
federated_audience: ''
jwt_token: ''
log_level: info
pagination:
  default:
    limit: 20
  resources:
    containers:
      limit: 50
    images:
      limit: 100
refresh_token: ''
server_url: http://localhost:3552
```

### Global flags

These flags work on every command.

| Flag                           | Purpose                                                                  |
| ------------------------------ | ------------------------------------------------------------------------ |
| `--output <mode>`              | Output mode, `text` or `json`. `--json` is an alias for `--output json`. |
| `--env <id>`                   | Use a different environment than the configured default for one command. |
| `--yes`                        | Auto-confirm destructive prompts.                                        |
| `--no-color`                   | Disable ANSI color output.                                               |
| `--request-timeout <duration>` | Override the HTTP timeout for one command.                               |
| `--config`, `-c <path>`        | Use a config file other than the default.                                |
| `--log-level <level>`          | Set verbosity: `debug`, `info`, `warn`, `error`, `fatal`, or `panic`.    |
| `--log-json`                   | Emit structured JSON logs.                                               |
