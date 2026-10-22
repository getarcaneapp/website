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

List every permission you hold in each environment, with any resource scopes and the bindings that grant them:

```bash
arcane-cli auth me --effective
```

For CI, use an API key or a federated credential instead of an interactive login — see [Federated Credentials](/docs/access/federated-credentials).

## Environments

Commands cover every environment by default. Limit one to a single environment with `--env`:

```bash
arcane-cli containers list --env 2
```

Changes without `--env` ask for confirmation before they run in all environments. See [Work across environments](/docs/reference/cli/config#work-across-environments).

List environments and check one is reachable:

```bash
arcane-cli environments list
```

```bash
arcane-cli environments test 2
```

Add an environment. The CLI prints its API key once, followed by the `docker run` and Compose commands to start the agent on the remote host:

```bash
arcane-cli environments create --name production
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

Free up space in every environment, or pass `--env` for one:

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

## Users and access

Bind a role to a user or group, globally or in one environment, optionally limited by a [resource scope](/docs/access/resource-scopes):

```bash
arcane-cli admin bindings create --user <user-id> --role role_deployer --environment <env-id> --project shop
```

List bindings with `--user`, `--group`, `--role`, or `--environment` filters, show a user's effective access, or remove a binding:

```bash
arcane-cli admin bindings list --user <user-id>
```

```bash
arcane-cli admin bindings access <user-id>
```

```bash
arcane-cli admin bindings delete <binding-id>
```

Manage [groups](/docs/access/groups) and their members:

```bash
arcane-cli admin groups create --name platform-team
```

```bash
arcane-cli admin groups members add <group-id> <user-id>
```

Map an OIDC claim value to a group:

```bash
arcane-cli admin oidc create --claim docker-admins --group <group-id>
```

Read and export the [audit log](/docs/access/audit-log):

```bash
arcane-cli admin audit list --outcome denied --since 24h
```

```bash
arcane-cli admin audit export --format csv -o audit.csv
```

Custom roles live under `admin roles` (`list`, `get`, `create`, `update`, `delete`, `permissions`). See [Roles & Permissions](/docs/access/roles).

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

## Podman

These commands work on environments that run Podman. Check what the host supports first:

```bash
arcane-cli podman status
```

Pods take the same flags as `podman pod create`:

```bash
arcane-cli podman pods list
```

```bash
arcane-cli podman pods create --name web -p 8080:80 --memory 512m
```

```bash
arcane-cli podman pods stop web --timeout 30
```

```bash
arcane-cli podman pods delete web --force
```

Install a Quadlet with any files it needs, then start its unit:

```bash
arcane-cli podman quadlets install web.kube --extra-file web.yaml
```

```bash
arcane-cli podman quadlets start web.kube
```

Play, tear down, or generate Kubernetes YAML:

```bash
arcane-cli podman kube play web.yaml --replace
```

```bash
arcane-cli podman kube down web.yaml
```

```bash
arcane-cli podman kube generate web --type deployment --service
```

Create or replace a secret. Without `--file`, the CLI prompts for the value, or reads one line from stdin:

```bash
arcane-cli podman secrets create db-password --file ./db-password.txt
```

```bash
arcane-cli podman secrets update db-password
```

Run Podman auto-update. `--dry-run` needs Podman 6.2 or later:

```bash
arcane-cli podman autoupdate --dry-run
```

See [Podman Overview](/docs/podman/overview) for what each feature needs on the host.

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

To check release signatures before updating, turn on the [signature verification preview](/docs/reference/cli/config#verify-self-update-signatures).

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
arcane-cli containers list --json | jq -r ".data[].name"
```

In JSON mode, stdout carries exactly one JSON document. Status messages and progress go to stderr. List commands print the server's paginated response with `data` and `pagination`. Other commands print only the resource or result. `images pull`, `images build`, and the streaming `projects` commands print an array of the server's progress frames once the operation finishes.

Commands that remove or reset resources ask for confirmation first. Add `--yes` to skip confirmation prompts in unattended scripts. On delete commands, `--force` skips the prompt too.

> [!IMPORTANT]
> Without a terminal, or with `--json`, a prompt fails with `confirmation required: re-run with --yes` instead of waiting for input. Piping `y` into the command does not answer it.

List commands are paginated. `--all` (`-a`) returns every item, ignoring pagination — it cannot be combined with `--limit` or `--start`:

```bash
arcane-cli containers list --all --json
```

> [!NOTE]
> `--all` means "ignore pagination", not "include stopped containers". `containers list` already returns containers in every state.

## Renamed flags

Some flags were renamed so they no longer clash with the global `--env`, `--config`, and `--output` flags, or to replace a separate off switch. Arcane 3.0 removed the old names, so a script that still passes one fails with `unknown flag`. Use the new names:

| Command                                                                                                                                                                                                  | Old flag     | New flag              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| `containers create`                                                                                                                                                                                      | `--env`      | `--env-var`, `-e`     |
| `admin notifications settings set`                                                                                                                                                                       | `--config`   | `--provider-config`   |
| `templates download`                                                                                                                                                                                     | `--output`   | `--output-file`, `-o` |
| `environments create`, `environments update`, `registries create`, `registries update`, `templates registries update`, `admin federated create`, `admin federated update`, `admin backups policies update` | `--disabled` | `--enabled=false`     |
