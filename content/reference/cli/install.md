---
title: 'Install the CLI'
description: 'Install arcane-cli with a script, a package manager, Homebrew, or Go.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

`arcane-cli` is the official command-line client for Arcane. Use it to manage containers, projects, images, environments, and more on your Arcane server from a terminal or script.

> [!NOTE]
> The CLI is in early development. Report problems on <Link href="https://github.com/getarcaneapp/arcane/issues">GitHub</Link>.

## Install with the script

The install script downloads the binary for your platform. Pick the release channel you want:

**Stable latest**

<Snippet text="curl -fsSL https://getarcane.app/install-cli.sh | sh" class="mt-2" />

**Stable pinned**

<Snippet text="curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- 2.5.0" class="mt-2" />

**Beta latest**

<Snippet text="curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- --beta" class="mt-2" />

Stable installs come from GitHub Releases.

> [!NOTE]
> `--beta` always installs the latest build from the `next` channel; you can't pin a beta version.

The script installs to `$HOME/.arcane/bin` unless you set `ARCANE_INSTALL_DIR`. If that directory is not on your `PATH`, the script prints the lines to add to your shell profile:

```bash
export ARCANE_INSTALL_DIR="$HOME/.arcane/bin"
export PATH="$ARCANE_INSTALL_DIR:$PATH"
```

## Download manually

Download the binary for your platform from <Link href="https://github.com/getarcaneapp/arcane/releases/latest">GitHub Releases</Link>.

## Install with APT (Debian / Ubuntu)

1. Add the signing key:

<Snippet text="curl -fsSL https://pkgs.getarcane.app/repository/raw/arcane-repo-signing.asc | sudo gpg --dearmor -o /usr/share/keyrings/arcane-archive-keyring.gpg" class="mt-2" />

2. Add the repository:

```bash
sudo tee /etc/apt/sources.list.d/arcane.sources << 'EOF'
Types: deb
URIs: https://pkgs.getarcane.app/repository/debian/
Suites: stable
Components: main
Signed-By: /usr/share/keyrings/arcane-archive-keyring.gpg
EOF
```

3. Install:

<Snippet text="sudo apt update && sudo apt install arcane-cli" class="mt-2" />

## Install with YUM / DNF (RHEL, Fedora, CentOS)

1. Add the repository:

```bash
sudo tee /etc/yum.repos.d/arcane.repo << 'EOF'
[arcane]
name=Arcane Repository
baseurl=https://pkgs.getarcane.app/repository/yum/$basearch/
enabled=1
gpgcheck=0
EOF
```

2. Install:

<Snippet text="sudo dnf install arcane-cli" class="mt-2" />

## Install with Homebrew

<Snippet text="brew install getarcaneapp/tap/arcane-cli" class="mt-2" />

## Install with Go

<Snippet text="go install github.com/getarcaneapp/arcane/cli/v2@latest" class="mt-2" />

Go names the installed binary `cli`, after the module path. Rename it to `arcane-cli` if you want the commands in these docs to work as written.

Next, point the CLI at your server and sign in. See <Link href="/docs/reference/cli/config">CLI Configuration</Link>.
