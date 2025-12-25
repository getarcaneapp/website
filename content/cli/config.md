---
title: 'Configuration'
description: 'Managing CLI settings and authentication.'
order: 2
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

> [!NOTE]
> The Arcane CLI is a very new feature and may be buggy. Feedback is greatly appreciated!

The Arcane CLI stores its configuration in a YAML file on your local machine.

## Config File Location

By default, the configuration is stored at:
`~/.config/arcanecli.yml`

You can find the exact path on your system by running:
<Snippet text="arcane-cli config path" class="mt-2" />

## Example Configuration

Here is what a typical configuration file looks like:

```yaml
server_url: https://arcane.example.com
api_key: arc_xxxxxxxxxxxxx
default_environment: "0"
log_level: info
```

## Configuration Commands

### Show Current Config
To see your current settings (with sensitive values masked):
<Snippet text="arcane-cli config show" class="mt-2" />

### Set Values
You can update individual settings using the `set` command:

```bash
# Set the server URL
arcane-cli config set --server-url http://localhost:3552

# Set a default environment ID
arcane-cli config set --environment 1

# Set the log level
arcane-cli config set --log-level debug
```

## Authentication

The CLI supports two methods of authentication:

### 1. Interactive Login (JWT)
The recommended way for users is to use the `login` command, which uses your standard username and password to obtain a JWT token.

<Snippet text="arcane-cli auth login" class="mt-2" />

### 2. API Key
For CI/CD or automated scripts, you can use an API key generated from the Arcane UI.

<Snippet text="arcane-cli config set --api-key your_api_key_here" class="mt-2" />
