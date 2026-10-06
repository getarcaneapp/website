---
title: 'Install the CLI'
description: 'Install arcane-cli with a script, a package manager, Homebrew, or Go.'
---

`arcane-cli` is the official command-line client for Arcane. Use it to manage containers, projects, images, environments, and more on your Arcane server from a terminal or script.

> [!NOTE]
> The CLI is in early development. Report problems on [GitHub](https://github.com/getarcaneapp/arcane/issues).

## Install with the script

The install script downloads the binary for your platform. Pick the release channel you want:

**Stable latest**

```bash
curl -fsSL https://getarcane.app/install-cli.sh | sh
```

**Stable pinned**

```bash
curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- 2.5.0
```

**Beta latest**

```bash
curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- --beta
```

Stable installs come from GitHub Releases.

> [!NOTE]
> `--beta` always installs the latest build from the `next` channel; you can't pin a beta version.

The script installs to `$HOME/.arcane/bin` unless you set `ARCANE_INSTALL_DIR`. If that directory is not on your `PATH`, the script prints the lines to add to your shell profile:

```bash
export ARCANE_INSTALL_DIR="$HOME/.arcane/bin"
export PATH="$ARCANE_INSTALL_DIR:$PATH"
```

## Download manually

Download the binary for your platform from [GitHub Releases](https://github.com/getarcaneapp/arcane/releases/latest).

## Install with APT (Debian / Ubuntu)

1. Add the signing key:

```bash
curl -fsSL https://pkgs.getarcane.app/repository/raw/arcane-repo-signing.asc | sudo gpg --dearmor -o /usr/share/keyrings/arcane-archive-keyring.gpg
```

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

```bash
sudo apt update && sudo apt install arcane-cli
```

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

```bash
sudo dnf install arcane-cli
```

## Install with Homebrew

```bash
brew install getarcaneapp/tap/arcane-cli
```

## Install with Go

```bash
go install github.com/getarcaneapp/arcane/cli/v2@latest
```

Go names the installed binary `cli`, after the module path. Rename it to `arcane-cli` if you want the commands in these docs to work as written.

Next, point the CLI at your server and sign in. See [CLI Configuration](/docs/reference/cli/config).
