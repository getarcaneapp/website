---
title: 'GitOps Lifecycle Hooks'
description: 'Run a pre-deploy script before a GitOps project sync redeploys.'
---

GitOps lifecycle hooks let Arcane run a script from a synced repository before deploying the project. Use them for repo-owned preparation steps such as decrypting secrets, generating config files, or validating the workspace before Compose runs.

> [!CAUTION]
> A lifecycle hook is repo-trusted code. Anyone who can push to the configured repository can change what the hook does on the next sync. Only enable hooks for repositories you control.

## Requirements

- Lifecycle hooks must be enabled by an admin.
- The sync target must be a project sync. Swarm stack syncs do not run pre-deploy hooks.
- The sync must include the whole project directory so the script is present when the hook runs.
- The user configuring the hook needs `gitops:lifecycle`.
- The script path must point to a file inside the synced project directory.
- The runner image must contain the script interpreter and tools the script needs.

## Enable lifecycle hooks

1. Open **Settings -> Security**.
2. Turn on **Enable Lifecycle Hooks** (`lifecycleEnabled`).
3. Set a default **Runner Image** (`lifecycleDefaultRunnerImage`), such as `alpine:latest`, or use an image that includes your required tools.
4. Set **Max Timeout** (`lifecycleMaxTimeoutSec`) to cap per-sync hook runtimes.
5. Save.

The default runner image is used when a GitOps sync does not set its own runner image.

## Configure a pre-deploy hook on a sync

1. Open the environment's **GitOps** page.
2. Create or edit a project sync.
3. Expand **Pre-deploy script**.
4. Set **Script path** to a file in the synced directory, e.g. `scripts/pre-deploy.sh`.
5. Enable syncing the whole project directory.
6. Set **Runner image** if this sync needs a different image than the environment default.
7. Set **Timeout** in seconds.
8. Leave **Network** as `none` unless the script needs network access.
9. Optional: add environment variables and extra mounts.
10. Save the sync.

Arcane runs the script before each deploy that follows the GitOps sync. If the script exits non-zero, times out, or cannot be started, Arcane stops the deploy.

## Script path and runner behavior

Arcane mounts the project workspace into the runner container and runs the script directly. The script's shebang chooses the interpreter, so commit the script with an executable mode and use an interpreter that exists in the runner image:

```sh
#!/bin/sh
set -eu

echo "Preparing project files"
```

Arcane clears the runner image entrypoint so the script path is the command. This allows purpose-built images to work even if they define their own default entrypoint.

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

## Last-run status

Arcane records the last hook run on the GitOps sync:

- run time
- status: `success`, `failed`, or `timeout`
- truncated combined stdout and stderr

Use this output to diagnose why a sync did not deploy. Full hook output should not be treated as long-term log storage.
