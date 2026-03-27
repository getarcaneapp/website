---
title: 'Configuration'
description: 'Managing CLI settings and authentication.'
order: 2
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

## Config File Location

By default, the configuration is stored at:
`~/.config/arcanecli.yml`

You can find the exact path on your system by running:
<Snippet text="arcane-cli config path" class="mt-2" />

The CLI now uses key-based config updates, so settings are changed with `arcane-cli config set <key> <value>` instead of the older `--server-url` style flags.

## Example Configuration

Here is what a typical configuration file looks like:

```yaml
api_key: ''
default_environment: '0'
default_limit: 20
jwt_token: ''
log_level: info
pagination:
  default:
    limit: 20
  resources:
    apikeys:
      limit: 20
    containers:
      limit: 20
    environments:
      limit: 20
    events:
      limit: 20
    images:
      limit: 20
    networks:
      limit: 20
    projects:
      limit: 20
    registries:
      limit: 20
    templates:
      limit: 20
    users:
      limit: 20
    volumes:
      limit: 20
refresh_token: ''
resource_limits:
  apikeys: 20
  containers: 20
  environments: 20
  events: 20
  images: 20
  networks: 20
  projects: 20
  registries: 20
  templates: 20
  users: 20
  volumes: 20
server_url: http://localhost:3552
```

## Getting Started

A quick first run looks like this:

1. Initialize a starter config file:

<Snippet text="arcane-cli config init" class="mt-2" />

2. Update the server URL and API Key:

<Snippet text="arcane-cli config set server-url http://localhost:3552" class="mt-2" />

<Snippet text="arcane-cli config set apt-key arc_xxxxxxx" class="mt-2" />

## Authenticate

Choose one of the following authentication methods.

### Option A: Device code

Use this when your Arcane setup supports OIDC and you want to sign in with your external identity provider.

<Snippet text="arcane-cli auth login" class="mt-2" />

### Option B: API key

Use this for CI/CD or automation.

<Snippet text="arcane-cli config set api-key your_api_key_here" class="mt-2" />

## Useful Global Flags

These flags are available across the CLI:

- `--output text|json` for output mode (`--json` is an alias for `--output json`)
- `--env <id>` to override the configured default environment for one command
- `--yes` to auto-confirm destructive prompts
- `--no-color` to disable ANSI color output
- `--request-timeout <duration>` to override HTTP timeout per command

## Utilities

Useful helper commands:

- <Snippet text="arcane-cli completion bash|zsh|fish|powershell" class="mt-2" />
- <Snippet text="arcane-cli doctor" class="mt-2" />

## Pagination Config

Set global and per-resource list limits in config:

```yaml
pagination:
  default:
    limit: 25
  resources:
    containers:
      limit: 50
    images:
      limit: 100
    volumes:
      limit: 40
    networks:
      limit: 40
```

CLI precedence is:

1. `--limit`
2. `pagination.resources.<resource>.limit`
3. `pagination.default.limit`
4. command built-in default

You can configure limits with:

<Snippet text="arcane-cli config set default-limit 25" class="mt-2" />

<Snippet text="arcane-cli config set pagination.resources.containers.limit 50 pagination.resources.images.limit 100" class="mt-2" />

You can also set resource limits directly in the generated config file under `resource_limits` and `pagination.resources` if you prefer editing YAML by hand.
