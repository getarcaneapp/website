---
title: 'Projects'
description: 'Manage Docker Compose projects in Arcane.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

A **Project** is a folder containing a Compose file and its related files.

<ScreenshotFrame
  src="/img/screenshots/projects-page.jpeg"
  alt="A running Compose project with three services."
  caption="Manage related services together as a Compose project."
  loading="lazy"
  decoding="async"
/>

## Browse projects

Open **Projects** in the sidebar. The list shows project name, status (running, partially running, stopped), service count, and the project directory.

Use the **Labels** filter to find projects with a container label. Enter a key such as `com.example.team`, or an exact match such as `com.example.team=media`. A project matches when at least one of its existing service containers has that label. This is separate from the project's colored tags.

## Where files are stored

Arcane saves project files and `.env` files in its data directory — by default `/app/data/projects`, or whatever you set as the Projects Directory in settings.

## Create a project

1. Click **Create Project**.
2. Enter a name.
3. Paste or write the Compose YAML.
4. Optional: open the **Environment Configuration (.env)** editor and add variables. Arcane saves them to a `.env` file next to the compose file.
5. Click **Create Project**. Arcane saves the project and tries to start it.

## Control a project

- **Up** — start all services.
- **Down** — stop and remove all containers.
- **Restart** — stop and start without recreating containers.
- **Redeploy** — pull the latest images and restart.
- **Destroy** — remove the project and its resources. You choose whether to keep or delete volumes and project files.

### Deploy options

Open the **Deploy** dropdown to set:

- **Pull policy** — pull if not present, always pull latest, or never pull. It starts from the environment's **Default Deploy Pull Policy** (**Environments → the environment → Docker**) until you change it here.
- **Force recreate containers** — recreate every container even if nothing about it changed.
- **Recreate changed volumes (data loss)** — allow Compose to recreate a volume whose configuration no longer matches the Compose file.

Arcane remembers pull policy and force recreate. **Recreate changed volumes** resets after each deploy because it destroys data. For bulk **Up**, it applies to the whole batch.

### Deploy wait timeout

A deploy waits for `depends_on` conditions such as `service_healthy` and `service_completed_successfully`. Set **Deploy Wait Timeout** in **Settings → Timeouts** if slow healthchecks or initialization cause timeouts. The default is 600 seconds; the range is 30–14400. Dependencies using `service_healthy` must define a healthcheck.

> [!WARNING]
> Applying a changed volume configuration destroys and rebuilds the volume, losing its data. Arcane refuses unless **Recreate changed volumes** is checked. The deploy log explains a refusal with `Declined; enable volume recreation on deploy to apply this change.`

### What gets pulled

Deploys pull service `image:` references, lifecycle hook images such as `pre_start`, and `type: image` volume sources. Hook and volume images are also pulled for services with `build:`.

Hook and volume images follow the service's pull policy, except `type: image` volume sources, which always pull only if missing.

### Watch the output live

**Deploy**, **Redeploy**, and **Pull** are split buttons. Open the dropdown next to any of them and choose **Watch output** to run that action in an attached terminal window instead of in the background.

The window streams Docker output. **Deploy** and **Redeploy** keep streaming container logs after startup, like an attached `docker compose up`.

> [!WARNING]
> Closing the watch window for **Deploy** or **Redeploy** stops the project and all its containers, like `Ctrl-C` on an attached `docker compose up`. Arcane asks **Stop project?** before doing so. To keep the project running, leave the window open; you can also follow the operation in the Activity Center.

Choose **Watch output** per run. Otherwise, actions run in the background under <Link href="/docs/features/activity-and-events">Activity & Events</Link>.

## Manage project files

Turn on **Workspace** to browse project files in a tree and edit them in tabs. It's also available on **Create Project** for adding files before the first deploy.

From the workspace panel you can:

- **New File** / **New Folder** — create files and folders anywhere in the project, including nested paths.
- **Upload File** — add a file from your computer, including binary files, up to the configured maximum of 10 MiB by default.
- **Edit** — open any text file in its own tab and change the contents.
- **Rename**, **Move**, and **Delete** — reorganize the folder; non-empty folders can be deleted recursively.

All file changes are staged until you **Save** the project.

> [!NOTE]
> The compose file, `.env`, `.env.git`, and `project.env` are **protected**. They show a lock icon and can't be renamed, moved, or deleted from the tree — edit them through their own editors instead.

- Only UTF-8 text files can be edited. Binary files can be uploaded, but can't be edited in the text editor.
- Build and dependency folders (`.git`, `node_modules`, `vendor`, `dist`, `build`, and similar) are hidden from the tree.
- For projects using **Pull**, files managed by Git sync are read-only. Other workspace files can be edited in Arcane.

The workspace limits are configurable with the `PROJECT_WORKSPACE_MAX_FILE_SIZE_MB` (default 10), `PROJECT_WORKSPACE_MAX_DEPTH` (default 20), and `PROJECT_WORKSPACE_MAX_ENTRIES` (default 2000) environment variables.

> [!IMPORTANT]
> `PROJECT_WORKSPACE_MAX_DEPTH` replaces the old `PROJECT_FILE_TREE_MAX_DEPTH` variable, which is no longer read. If you had set the old name, switch to the new one.

<ScreenshotFrame
  src="/img/screenshots/project-workspace.jpeg"
  alt="The Compose editor for a running project with web, cache, and worker services."
  caption="Review and edit the Compose configuration alongside its environment file."
  loading="lazy"
  decoding="async"
/>

## Sync from Git

Choose a direction based on where you edit your project:

| Direction | Where you edit        | What Arcane does                                                  |
| --------- | --------------------- | ----------------------------------------------------------------- |
| **Pull**  | In the Git repository | Pulls files into Arcane and can deploy the project after syncing. |
| **Push**  | In Arcane             | Commits selected project files and pushes them to the repository. |

A project can have one Git sync. To change its direction, disconnect the existing sync and create a new one.

<span id="connect-a-repository"></span>

Start by <Link href="/docs/features/git-sync#connect-a-repository">connecting a repository</Link>.
<span id="create-a-git-synced-project"></span>
Then <Link href="/docs/features/git-sync#create-a-git-synced-project">create a Git-synced project</Link> or
<span id="link-an-existing-project"></span>
<Link href="/docs/features/git-sync#link-an-existing-project">link an existing project</Link> for Pull sync.
<span id="import-multiple-syncs-from-json"></span>
For several projects, <Link href="/docs/features/git-sync#import-multiple-syncs-from-json">import syncs from JSON</Link>.

<span id="open-files-in-the-repository"></span>

For a Pull-managed project, <Link href="/docs/features/git-sync#open-files-in-the-repository">open files in the repository</Link> to edit their source.
<span id="directory-aware-git-sync"></span>
See <Link href="/docs/features/git-sync#directory-aware-sync">directory-aware sync</Link> for companion files and
<span id="edit-a-git-synced-project"></span>
<Link href="/docs/features/git-sync#edit-a-git-synced-project">editing a Git-synced project</Link> for local environment values.

## Push to Git

Use **Push** to keep editing a project in Arcane and save its configuration in Git. Project files stay editable, and pushing files does not deploy or restart the project.
<span id="set-up-a-push-sync"></span>
Follow <Link href="/docs/features/git-sync#set-up-a-push-sync">push sync setup</Link> to choose the destination and schedule.

<span id="commit-identity-and-signing"></span>
<span id="commit-identity-and-signing-1"></span>

Configure <Link href="/docs/features/git-sync#commit-identity-and-signing">commit identity and signing</Link> in the repository settings, then
<span id="choose-what-to-commit"></span>
<Link href="/docs/features/git-sync#choose-what-to-commit">choose what to commit</Link>, including whether to include environment files.

<span id="check-a-push"></span>

<Link href="/docs/features/git-sync#check-a-push">Check a push</Link> for pending changes, history, and errors.
<span id="resolve-repository-changes"></span>
If repository files have changed, <Link href="/docs/features/git-sync#resolve-repository-changes">review and resolve the repository changes</Link> before pushing again.

## Build images from a project

If your Compose file has services with a `build:` directive, Arcane shows build actions on the project page:

- **Build** — build the project's images without deploying.
- **Build & Deploy** — build as part of the deploy flow.

BuildKit builds the selected services and streams progress to the UI. API clients can call `POST /environments/{id}/projects/{projectId}/build` with these optional fields:

- `services` — limit the build to specific service names
- `provider` — `local` or `depot`
- `push` — override push behavior
- `load` — override load behavior

> [!NOTE]
> If you use Depot or push images, services should set explicit `image:` names. Arcane blocks generated local-only tags in that case.

For the manual Build Workspace, build history, and API details, see <Link href="/docs/features/image-builds">Image Builds</Link>.

## Tag projects

Add colored tags when creating a project or from its table row or detail header. Click **+**, then use **Search or create a tag…** to select an existing tag or create one with a color. Click a selected tag to remove it. Extra tags appear under **+N** after the first three.

Filter the **Tags** column to match any selected tag, or search by tag name.

Tags can also be declared in the compose file itself, under the `x-arcane` extension block:

```yaml
x-arcane:
  tags:
    - name: database
      color: purple
```

Compose-defined tags are reconciled on deploy and sync, and are read-only in Arcane — they show a lock icon, and can only be changed by editing the compose file.

- Tag names are trimmed and lowercased, up to 64 characters, with no commas.
- A tag name's color is shared everywhere it's used; attaching an existing name keeps its stored color.
- Each project holds up to 50 UI tags and 50 Compose tags.
- The tag catalog is per environment.
- Editing tags requires the `projects:update` permission, and discovered (unmanaged) projects can't be tagged.

## Rename a project with managed volumes

Renaming a stopped project copies its Compose-managed volumes to their new names, updates the project, then removes the old volumes. Volumes with an explicit `name:` or `external: true` are left alone.

The rename is blocked if:

- the project is still running
- the target volume name already exists
- a source volume is still attached to a container
- Docker reports insufficient space to copy the volume data

## Where projects come from

Arcane scans your <Link href="/docs/configuration/environment">Projects Directory</Link>, including nested folders, for Compose files. Folders with the same name are identified by their full paths.

### Supported filenames

Arcane recognizes any of these as the project's compose file:

- `compose.yaml` / `compose.yml`
- `docker-compose.yaml` / `docker-compose.yml`
- `podman-compose.yaml` / `podman-compose.yml`
- a single custom `.yaml` / `.yml` file in the project folder, when it's unambiguous

### How Arcane picks a compose file

When a folder has more than one YAML file, Arcane chooses in this order:

1. A canonical name from the list above.
2. A custom file whose stem matches the folder name (e.g. `radarr.yaml` in `Radarr-3/`).
3. A single custom file with `compose` in the stem.
4. Otherwise, any single visible `.yaml` / `.yml` file.

If two or more custom files are equally plausible, Arcane stops and reports the directory as ambiguous instead of guessing.

### Compose pre-defined environment variables

Arcane honors Docker Compose's [pre-defined environment variables](https://docs.docker.com/compose/how-tos/environment-variables/envvars/) when they are set in the project's `.env` file:

- `COMPOSE_FILE` — deploy a specific compose file, or several files merged in order. Separate entries with `:` (or whatever `COMPOSE_PATH_SEPARATOR` is set to). The first entry is the base file.
- `COMPOSE_PROFILES` — comma-separated list of profiles to activate.
- `COMPOSE_PROJECT_NAME` — override the project name Compose uses.
- `COMPOSE_ENV_FILES` — additional env files to load, in order.
- `COMPOSE_REMOVE_ORPHANS` / `COMPOSE_IGNORE_ORPHANS` — control how containers left over from removed services are handled.
- `COMPOSE_PARALLEL_LIMIT` — cap how many operations Compose runs at once.

File paths in `COMPOSE_FILE` and `COMPOSE_ENV_FILES` resolve relative to the project folder and must stay inside it — an entry that points outside the project is rejected.

When `COMPOSE_FILE` selects more than one file, the project detail view shows a **Multiple compose files** card listing the selection. The base file opens in the compose editor; the other files are edited in the **Workspace** view.

## Nested directories and symlinks

For symlinked layouts (e.g. GNU Stow), Arcane can follow child-directory symlinks. Enable **Follow Project Symlinks** on the environment's **Storage & Limits** tab to opt in.

> [!NOTE]
> On Linux, deeply nested project trees consume extra inotify watches because Arcane monitors them recursively. For very large trees, raise `fs.inotify.max_user_watches`.

A folder Arcane can't read appears empty. Other folders remain accessible.

Compose files that reference paths **outside** the projects mount with a relative path (such as `../../data:/app/data`) are resolved against the host projects directory, so they behave the same as running `docker compose up` yourself. `include:` entries may also point outside the project directory — for example a shared fragment kept next to several projects (`include: [../shared.yaml]`).
