---
title: 'GitOps Lifecycle Hooks'
description: 'Run a script from your repository before a Git-synced project deploys.'
---

Lifecycle hooks run a script from your repository before Arcane deploys a [Git Sync](/docs/docker/git-sync) **Pull** project. Use one to prepare the workspace, such as decrypting secrets, generating config, or checking files.

> [!CAUTION]
> A lifecycle hook is repo-trusted code: anyone who can push to the repository changes what it does on the next sync. Only enable hooks for repositories you control.

## Requirements

- An admin has enabled lifecycle hooks.
- The sync uses **Pull**, targets a project, and has **Sync Files** on. Push and Swarm stack syncs don't run hooks.
- You have `gitops:lifecycle`.
- The script is inside the synced project directory, and the runner image has its interpreter and tools.

## Enable lifecycle hooks

1. Open **Settings → Security → Lifecycle Hooks**.
2. Turn on **Enable Lifecycle Hooks**.
3. Set a default **Runner Image**, such as `alpine:latest`, with your scripts' tools. Syncs can override it.
4. Set **Max Timeout (seconds)** to cap per-sync hook runtimes; `0` removes the cap.
5. Save.

## Configure a pre-deploy hook on a sync

1. In **Git Syncs**, create or edit a **Pull** sync with **Target Type** set to **Project**.
2. Expand **Pre-deploy script** and set **Script path**, e.g. `scripts/pre-deploy.sh`.
3. Turn on **Sync Files**.
4. Optional: set **Runner image** to override the environment default.
5. Set **Timeout (seconds)**. Leave **Network** as `none` unless the script needs network access.
6. Optional: add environment variables and extra mounts, then save.

The script runs before each deploy that follows a sync. If it exits non-zero, times out, or can't start, the deploy stops.

## Script path and runner behavior

Arcane mounts the workspace into the runner and runs the script directly, clearing the image's entrypoint. The shebang picks the interpreter, so commit the script as executable and use an interpreter in the runner image:

```sh
#!/bin/sh
set -eu

echo "Preparing project files"
```

## Network mode

The default, `none`, blocks network access. Change it only when needed:

- `bridge` for normal outbound network access
- `host` when the script must use the host network
- a Docker network name when the script must reach a specific network

## Environment variables

**Environment variables** pass static values to the runner, one `KEY=VALUE` line each, as in a `.env` file. Keys use shell-style names:

```env
SOPS_AGE_KEY_FILE=/run/secrets/age.key
CONFIG_ENV=production
```

## Extra mounts

**Extra mounts** give the hook host files outside the workspace, one per line in Docker `src:tgt[:ro|:rw]` form:

```text
/srv/arcane/secrets:/run/secrets:ro
```

Source and target must be absolute paths. Prefer read-only unless the script must write there.

## Check the last run

When a sync doesn't deploy, check the last hook run on the sync: run time, status (`success`, `failed`, or `timeout`), and truncated combined stdout and stderr. Store hook logs elsewhere for long-term use.
