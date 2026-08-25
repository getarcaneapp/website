---
title: 'Common Commands'
description: 'Practical arcane-cli invocations for everyday tasks.'
---

<script lang="ts">
import { Snippet } from '#lib/components/ui/snippet/index.js';
import { Link } from '#lib/components/ui/link/index.js';
</script>

A tour of the commands you'll reach for most often. This is not an exhaustive reference — run `arcane-cli <command> --help` for the full flag list on any command, and `arcane-cli --help` for the complete command tree.

Before anything else, make sure the CLI knows where your server is and who you are. See <Link href="/docs/cli/config">Configuration</Link>.

## Sign in

Log in interactively with the device-code flow:

<Snippet text="arcane-cli auth login" class="mt-2" />

Check who you're signed in as, or sign out:

<Snippet text="arcane-cli auth me" class="mt-2" />

<Snippet text="arcane-cli auth logout" class="mt-2" />

For CI, use an API key or a federated credential instead of an interactive login — see <Link href="/docs/authentication/federated-credentials">Federated Credentials</Link>.

## Choose an environment

Most resource commands act on your default environment. Set it once:

<Snippet text="arcane-cli environments switch" class="mt-2" />

Or override it for a single command with `--env`:

<Snippet text="arcane-cli containers list --env 2" class="mt-2" />

List environments and check one is reachable:

<Snippet text="arcane-cli environments list" class="mt-2" />

<Snippet text="arcane-cli environments test 2" class="mt-2" />

## Containers

<Snippet text="arcane-cli containers list" class="mt-2" />

<Snippet text="arcane-cli containers get my-container" class="mt-2" />

<Snippet text="arcane-cli containers restart my-container" class="mt-2" />

Show which containers have a newer image available:

<Snippet text="arcane-cli containers updates" class="mt-2" />

Pull the newer image and recreate the container:

<Snippet text="arcane-cli containers update my-container" class="mt-2" />

## Projects

<Snippet text="arcane-cli projects list" class="mt-2" />

Bring a project up, or take it down:

<Snippet text="arcane-cli projects up my-project" class="mt-2" />

<Snippet text="arcane-cli projects down my-project" class="mt-2" />

Pull the latest images and restart:

<Snippet text="arcane-cli projects redeploy my-project" class="mt-2" />

> [!TIP]
> `projects up`, `projects redeploy`, and `projects pull` print the raw Docker output line by line as the operation runs, so you see the same thing you would from `docker compose` directly. These commands allow up to 30 minutes for large pulls and builds.

Remove a project and its resources:

<Snippet text="arcane-cli projects destroy my-project" class="mt-2" />

> [!WARNING]
> `destroy` removes the project's files from disk by default. Pass `--remove-files=false` to keep them. Volumes are kept unless you add `--remove-volumes`.

## Images and volumes

<Snippet text="arcane-cli images list" class="mt-2" />

<Snippet text="arcane-cli images pull nginx:latest" class="mt-2" />

Reclaim space:

<Snippet text="arcane-cli images prune" class="mt-2" />

<Snippet text="arcane-cli volumes sizes" class="mt-2" />

Find out what's using a volume before you remove it:

<Snippet text="arcane-cli volumes usage my-volume" class="mt-2" />

## GitOps

<Snippet text="arcane-cli gitops list" class="mt-2" />

Check a sync's state, then run it now:

<Snippet text="arcane-cli gitops status my-sync" class="mt-2" />

<Snippet text="arcane-cli gitops sync my-sync" class="mt-2" />

## System

Free up space across the environment:

<Snippet text="arcane-cli system prune" class="mt-2" />

Check whether an Arcane upgrade is available, and apply it:

<Snippet text="arcane-cli system upgrade-check" class="mt-2" />

<Snippet text="arcane-cli system upgrade" class="mt-2" />

Turn a `docker run` command into Compose:

<Snippet text={'arcane-cli system convert "docker run -d -p 8080:80 nginx"'} class="mt-2" />

## Updater

Inspect the automatic updater and trigger a run:

<Snippet text="arcane-cli updater status" class="mt-2" />

<Snippet text="arcane-cli updater run" class="mt-2" />

<Snippet text="arcane-cli updater history" class="mt-2" />

History shows one row per resource — resource, type, status, whether the update was applied, and when it started. Use `--limit` (`-n`) to change how many entries you get back; the default is 50.

## Keeping the CLI current

<Snippet text="arcane-cli self-update run" class="mt-2" />

Switch between the stable and next release channels:

<Snippet text="arcane-cli self-update channel next" class="mt-2" />

## Utilities

Diagnose connectivity and configuration problems:

<Snippet text="arcane-cli doctor" class="mt-2" />

Install shell completion:

<Snippet text="arcane-cli completion zsh" class="mt-2" />

Generate secrets and certificates for a new install:

<Snippet text="arcane-cli generate secret" class="mt-2" />

## Scripting

Every command accepts `--output json` (or the shorthand `--json`), which makes the CLI easy to pair with `jq`:

<Snippet text={'arcane-cli containers list --json | jq -r ".[].name"'} class="mt-2" />

Add `--yes` to skip confirmation prompts in unattended scripts.

List commands are paginated. `--all` (`-a`) returns every item, ignoring pagination — it cannot be combined with `--limit` or `--start`:

<Snippet text="arcane-cli containers list --all --json" class="mt-2" />

> [!NOTE]
> `--all` means "ignore pagination", not "include stopped containers". `containers list` already returns containers in every state.
