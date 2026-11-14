---
title: "Install the CLI"
description: "Install arcane-cli with a script, a package manager, or Homebrew."
---

`arcane-cli` manages containers, projects, images, agents, and more from a terminal or script.

> [!NOTE]
> The CLI is in early development. Report problems on [GitHub](https://github.com/getarcaneapp/arcane/issues).

## Install with the script

The script downloads the binary for your platform. Stable installs come from GitHub Releases.

1. Run the command for your channel. Stable latest:

   ```bash
   curl -fsSL https://getarcane.app/install-cli.sh | sh
   ```

   Stable pinned (replace `3.x.y` with a version from [GitHub Releases](https://github.com/getarcaneapp/arcane/releases)):

   ```bash
   curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- 3.x.y
   ```

   Beta latest:

   ```bash
   curl -fsSL https://getarcane.app/install-cli.sh | sh -s -- --beta
   ```

2. If the install directory isn't on your `PATH`, add the lines the script prints to your shell profile:

   ```bash
   export ARCANE_INSTALL_DIR="$HOME/.arcane/bin"
   export PATH="$ARCANE_INSTALL_DIR:$PATH"
   ```

- It installs to `$HOME/.arcane/bin` unless you set `ARCANE_INSTALL_DIR`.
- `--beta` always installs the latest build from the `next` channel. You can't pin a beta version.
- To install manually, download the binary from [GitHub Releases](https://github.com/getarcaneapp/arcane/releases/latest).

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

## Next step

Point the CLI at your server and sign in. See [CLI Configuration](/docs/reference/cli/config).
