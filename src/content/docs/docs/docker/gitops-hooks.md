---
title: 'GitOps Lifecycle Hooks'
description: 'Run a script from your repository before a Git-synced project deploys.'
---

GitOps lifecycle hooks run a script from your repository before Arcane deploys a project that uses a [Git Sync](/docs/docker/git-sync) **Pull** sync. Use a hook to prepare the workspace for Compose, for example by decrypting secrets, generating config files, or checking the workspace.

> [!CAUTION]
> A lifecycle hook is repo-trusted code. Anyone who can push to the configured repository can change what the hook does on the next sync. Only enable hooks for repositories you control.

## Requirements

- Lifecycle hooks must be enabled by an admin.
- The sync must use **Pull** and target a project. Push syncs and Swarm stack syncs do not run pre-deploy hooks.
- The sync must have **Sync Files** turned on so the script is copied with the Compose file.
- The user configuring the hook needs `gitops:lifecycle`.
- The script path must point to a file inside the synced project directory.
- The runner image must contain the script interpreter and tools the script needs.

## Enable lifecycle hooks

1. Open **Environments → your environment → Security → Lifecycle Hooks**.
2. Turn on **Enable Lifecycle Hooks**.
3. Set a default **Runner Image**, such as `alpine:latest`, that includes the tools your scripts need. Syncs use it unless they set their own.
4. Set **Max Timeout (seconds)** to cap per-sync hook runtimes. `0` removes the cap.
5. Save.

## Configure a pre-deploy hook on a sync

1. Open the environment's **Git Syncs** page.
2. Create or edit a **Pull** sync with **Target Type** set to **Project**.
3. Expand **Pre-deploy script**.
4. Set **Script path** to a file in the synced directory, e.g. `scripts/pre-deploy.sh`.
5. Turn on **Sync Files**.
6. Set **Runner image** if this sync needs a different image than the environment default.
7. Set **Timeout (seconds)**.
8. Leave **Network** as `none` unless the script needs network access.
9. Optional: add environment variables and extra mounts.
10. Save the sync.

Arcane runs the script before each deploy that follows a sync. If it exits non-zero, times out, or can't start, the deploy stops.

## Script path and runner behavior

Arcane mounts the project workspace into the runner container and runs the script directly. The script's shebang chooses the interpreter, so commit the script with an executable mode and use an interpreter that exists in the runner image:

```sh
#!/bin/sh
set -eu

echo "Preparing project files"
```

Arcane clears the image's entrypoint so the script path is the command, so images with their own entrypoint still work.

## Network mode

The default network mode is `none`, which blocks network access from the hook container.

Use another mode only when the script needs it:

- `bridge` for normal outbound network access
- `host` when the script must use the host network
- a Docker network name when the script must reach a specific network

## Environment variables

Use **Environment variables** to pass static values into the runner container. Enter one `KEY=VALUE` line per variable, using the same format as a `.env` file:

```env
SOPS_AGE_KEY_FILE=/run/secrets/age.key
CONFIG_ENV=production
```

Keys must use shell-style names, such as `CONFIG_ENV` or `SOPS_AGE_KEY_FILE`.

## Extra mounts

Use **Extra mounts** when the hook needs host files that are not in the project workspace. Enter one mount per line in Docker `src:tgt[:ro|:rw]` form:

```text
/srv/arcane/secrets:/run/secrets:ro
```

Both source and target must be absolute paths. Prefer read-only mounts unless the script must write to the mounted path.

## Check the last run

Arcane records the last hook run on the sync:

- run time
- status: `success`, `failed`, or `timeout`
- truncated combined stdout and stderr

Check this output when a sync doesn't deploy. Store hook logs elsewhere if you need them long term.
