#!/bin/sh
# Based on Deno installer: Copyright 2019 the Deno authors. All rights reserved. MIT license.

set -e

os=$(uname -s)
arch=$(uname -m)
version=latest
beta=0

for arg in "$@"; do
  case "$arg" in
    --beta)
      beta=1
      ;;
    *)
      version="$arg"
      ;;
  esac
done

case "$os" in
  Darwin) os="darwin" ;;
  Linux) os="linux" ;;
  *)
    echo "Error: Unsupported OS: $os" 1>&2
    exit 1
    ;;
esac

case "$arch" in
  x86_64 | amd64) arch="amd64" ;;
  arm64 | aarch64) arch="arm64" ;;
  i386 | i686) arch="386" ;;
  armv7l | armv7) arch="armv7" ;;
  *)
    echo "Error: Unsupported architecture: $arch" 1>&2
    exit 1
    ;;
esac

asset="arcane-cli_${os}_${arch}"

if [ "$beta" = "1" ]; then
  release_url="https://bucket.getarcane.app/bin/cli-next/$asset"
else
  if [ "$version" = "latest" ]; then
    release_url="https://github.com/getarcaneapp/arcane/releases/latest/download/$asset"
  else
    version="v${version#v}"
    release_url="https://github.com/getarcaneapp/arcane/releases/download/$version/$asset"
  fi
fi

install_dir="${ARCANE_INSTALL_DIR:-$HOME/.arcane/bin}"
bin="$install_dir/arcane-cli"

if [ ! -d "$install_dir" ]; then
  mkdir -p "$install_dir"
fi

extract_dir="$(mktemp -d)"
if ! curl -q --fail --location --progress-bar --output "$extract_dir/arcane-cli" "$release_url"; then
  echo "Error: Unable to find an Arcane CLI release for $os/$arch/$version - see https://github.com/getarcaneapp/arcane/releases for all stable versions" 1>&2
  exit 1
fi

mv "$extract_dir/arcane-cli" "$bin"
chmod +x "$bin"
rm -rf "$extract_dir"

echo "Arcane CLI was installed successfully to $bin"
if command -v arcane-cli >/dev/null; then
  echo "Run 'arcane-cli --help' to get started"
else
  case $SHELL in
  /bin/zsh) shell_profile=".zshrc" ;;
  *) shell_profile=".bash_profile" ;;
  esac
  echo "Manually add the directory to your \$HOME/$shell_profile (or similar)"
  echo "  export ARCANE_INSTALL_DIR=\"$install_dir\""
  echo "  export PATH=\"\$ARCANE_INSTALL_DIR:\$PATH\""
  echo "Run '$bin --help' to get started"
fi
