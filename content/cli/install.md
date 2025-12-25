---
title: 'Installation'
description: 'Install and overview of arcane-cli'
order: 1
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import { Link } from '$lib/components/ui/link/index.js';
</script>

> [!NOTE]
> The Arcane CLI is a very new feature and may be buggy. Feedback is greatly appreciated!

The Arcane CLI is the official tool for interacting with your Arcane server from the terminal. It allows you to manage containers, images, environments, and more.

## Installation

### Manual Download

You can download the latest binary for your platform from our <Link href="https://github.com/getarcaneapp/arcane/releases/latest">GitHub Releases</Link> 

### Homebrew

<Snippet text="brew install getarcaneapp/tap/arcane-cli" class="mt-2" />

### Go Install

<Snippet text="go install github.com/getarcaneapp/arcane/cli@latest" class="mt-2" />

## Basic Usage

The general syntax for the CLI is:

```bash
arcane-cli [command] [subcommand] [flags]
```

### Global Flags

These flags are available on all commands:

- `--log-level`: Set the logging level (`debug`, `info`, `warn`, `error`, `fatal`, `panic`). Default is `info`.
- `--json`: Output results in JSON format for easier parsing in scripts.
- `-v, --version`: Print version information.

## Getting Started

1. **Configure the server URL**:
   <Snippet text="arcane-cli config set --server-url https://your-arcane-instance.com" class="mt-2" />

2. **Authenticate**:
   You can log in using your web credentials:
   <Snippet text="arcane-cli auth login" class="mt-2" />

3. **Verify connection**:
   <Snippet text="arcane-cli config test" class="mt-2" />

For more details on configuration and authentication, see the [Configuration](/docs/cli/config) guide.
