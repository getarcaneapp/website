---
title: 'Install the CLI'
description: 'Install arcane-cli with a script, a package manager, Homebrew, or Go.'
---

`arcane-cli` is Arcane's official command-line client. Use it to manage containers, projects, images, environments, and more from a terminal or script.

> [!NOTE]
> The CLI is in early development. Report problems on [GitHub](https://github.com/getarcaneapp/arcane/issues).

## Install with the script

The script downloads the binary for your platform. Stable installs come from GitHub Releases. Pick a channel:

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

> [!NOTE]
> `--beta` always installs the latest build from the `next` channel; you can't pin a beta version.

It installs to `$HOME/.arcane/bin` unless you set `ARCANE_INSTALL_DIR`. If that directory isn't on your `PATH`, the script prints the lines to add to your shell profile:

```bash
export ARCANE_INSTALL_DIR="$HOME/.arcane/bin"
export PATH="$ARCANE_INSTALL_DIR:$PATH"
```

To install manually, download the binary from [GitHub Releases](https://github.com/getarcaneapp/arcane/releases/latest).

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

## Install with Homebrew or Go

```bash
brew install getarcaneapp/tap/arcane-cli
```

```bash
go install github.com/getarcaneapp/arcane/cli/v2@latest
```

Go names the binary `cli`, after the module path. Rename it to `arcane-cli` so the commands in these docs work as written.

Next, point the CLI at your server and sign in. See [CLI Configuration](/docs/reference/cli/config).
