---
title: 'CLI Commands'
description: 'Practical arcane-cli invocations for everyday tasks.'
---

The `arcane-cli` commands you'll use most often, grouped by task. For the full flag list run `arcane-cli <command> --help`, and for the complete command tree run `arcane-cli --help`.

Set your server URL and sign in first. See [CLI Configuration](/docs/reference/cli/config).

## Sign in

Log in interactively with the device-code flow:

```bash
arcane-cli auth login
```

Check who you're signed in as, or sign out:

```bash
arcane-cli auth me
```

```bash
arcane-cli auth logout
```

For CI, use an API key or a federated credential instead of an interactive login — see [Federated Credentials](/docs/access/federated-credentials).

## Choose an environment

Most resource commands act on your default environment. Set it once:

```bash
arcane-cli environments switch
```

Or override it for a single command with `--env`:

```bash
arcane-cli containers list --env 2
```

List environments and check one is reachable:

```bash
arcane-cli environments list
```

```bash
arcane-cli environments test 2
```

## Containers

```bash
arcane-cli containers list
```

```bash
arcane-cli containers get my-container
```

```bash
arcane-cli containers restart my-container
```

Show which containers have a newer image available:

```bash
arcane-cli containers updates
```

Pull the newer image and recreate the container:

```bash
arcane-cli containers update my-container
```

## Projects

```bash
arcane-cli projects list
```

Bring a project up, or take it down:

```bash
arcane-cli projects up my-project
```

```bash
arcane-cli projects down my-project
```

Pull the latest images and restart:

```bash
arcane-cli projects redeploy my-project
```

> [!TIP]
> `projects up`, `projects redeploy`, and `projects pull` print the raw Docker output line by line as the operation runs, so you see the same thing you would from `docker compose` directly. These commands allow up to 30 minutes for large pulls and builds.

Remove a project and its resources:

```bash
arcane-cli projects destroy my-project
```

> [!WARNING]
> `destroy` removes the project's files from disk by default. Pass `--remove-files=false` to keep them. Volumes are kept unless you add `--remove-volumes`.

## Images and volumes

```bash
arcane-cli images list
```

```bash
arcane-cli images pull nginx:latest
```

Reclaim space:

```bash
arcane-cli images prune
```

```bash
arcane-cli volumes sizes
```

Find out what's using a volume before you remove it:

```bash
arcane-cli volumes usage my-volume
```

## GitOps

```bash
arcane-cli gitops list
```

Check a sync's state, then run it now:

```bash
arcane-cli gitops status my-sync
```

```bash
arcane-cli gitops sync my-sync
```

## System

Free up space across the environment:

```bash
arcane-cli system prune
```

Check whether an Arcane upgrade is available, and apply it:

```bash
arcane-cli system upgrade --check
```

```bash
arcane-cli system upgrade
```

Turn a `docker run` command into Compose:

```bash
arcane-cli system convert "docker run -d -p 8080:80 nginx"
```

## Vulnerabilities

Get an overview of scan results, or the full findings list:

```bash
arcane-cli images vulnerabilities summary
```

```bash
arcane-cli images vulnerabilities list
```

Scan an image now, or show one image's findings:

```bash
arcane-cli images vulnerabilities scan nginx:latest
```

```bash
arcane-cli images vulnerabilities image nginx:latest
```

Silence a CVE you've reviewed (and list or undo ignores with `ignored` / `unignore`):

```bash
arcane-cli images vulnerabilities ignore CVE-2026-1234
```

## System backups

Manage [Arcane system backups](/docs/docker/backups) from the terminal:

```bash
arcane-cli admin backups list
```

```bash
arcane-cli admin backups create
```

```bash
arcane-cli admin backups restore <backup-id>
```

There are also subcommands for retention policies (`policies`), the recovery key (`recovery`), uploading a local backup to S3 (`upload`), and finding S3 restore points not in the database (`discover`).

## Activities and webhooks

Follow what the server is doing:

```bash
arcane-cli activities list
```

```bash
arcane-cli activities get <activity-id>
```

Manage webhooks, or fire one by its token:

```bash
arcane-cli webhooks list
```

```bash
arcane-cli webhooks trigger <token>
```

## Updater

Inspect the automatic updater and trigger a run:

```bash
arcane-cli updater status
```

```bash
arcane-cli updater run
```

```bash
arcane-cli updater history
```

History shows one row per resource — resource, type, status, whether the update was applied, and when it started. Use `--limit` (`-n`) to change how many entries you get back; the default is 50.

## Update the CLI

```bash
arcane-cli self-update run
```

Switch between the stable and next release channels:

```bash
arcane-cli self-update channel next
```

## Diagnose problems and set up your shell

Diagnose connectivity and configuration problems:

```bash
arcane-cli doctor
```

Install shell completion:

```bash
arcane-cli completion zsh
```

Generate secrets and certificates for a new install:

```bash
arcane-cli generate secret
```

## Scripting

Every command accepts `--output json` (or the shorthand `--json`), which makes the CLI easy to pair with `jq`:

```bash
arcane-cli containers list --json | jq -r ".[].name"
```

Add `--yes` to skip confirmation prompts in unattended scripts.

List commands are paginated. `--all` (`-a`) returns every item, ignoring pagination — it cannot be combined with `--limit` or `--start`:

```bash
arcane-cli containers list --all --json
```

> [!NOTE]
> `--all` means "ignore pagination", not "include stopped containers". `containers list` already returns containers in every state.
