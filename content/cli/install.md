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

### Curl Install Script

You can also install the CLI with our helper script. Pick the command that matches the release channel you want:

**Stable latest**

<Snippet text="curl -fsSL https://getarcane.app/install-cli.sh | sh" class="mt-2" />

**Stable pinned**

<Snippet text="curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- 1.16.4" class="mt-2" />

**Beta latest**

<Snippet text="curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- --beta" class="mt-2" />

> [!NOTE]
> `--beta` always installs the latest `cli-next` binary from R2. It does not use a versioned beta release path.

### APT (Debian / Ubuntu)

Add the signing key:

<Snippet text="curl -fsSL https://pkgs.getarcane.app/repository/raw/arcane-repo-signing.asc | sudo gpg --dearmor -o /usr/share/keyrings/arcane-archive-keyring.gpg" class="mt-2" />

Add the repository:

```bash
sudo tee /etc/apt/sources.list.d/arcane.sources << 'EOF'
Types: deb
URIs: https://pkgs.getarcane.app/repository/debian/
Suites: stable
Components: main
Signed-By: /usr/share/keyrings/arcane-archive-keyring.gpg
EOF
```

Install:

<Snippet text="sudo apt update && sudo apt install arcane-cli" class="mt-2" />

### YUM / DNF (RHEL, Fedora, CentOS)

Add the repository:

```bash
sudo tee /etc/yum.repos.d/arcane.repo << 'EOF'
[arcane]
name=Arcane Repository
baseurl=https://pkgs.getarcane.app/repository/yum/$basearch/
enabled=1
gpgcheck=0
EOF
```

Install:

<Snippet text="sudo dnf install arcane-cli" class="mt-2" />

### Homebrew

<Snippet text="brew install getarcaneapp/tap/arcane-cli" class="mt-2" />

### Go Install

<Snippet text="go install github.com/getarcaneapp/arcane/cli@latest" class="mt-2" />

Next see how to configure arcane-cli at [Configuration](/docs/cli/config).
