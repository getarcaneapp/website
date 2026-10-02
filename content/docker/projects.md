---
title: 'Projects'
description: 'Create, deploy, and edit Docker Compose projects in Arcane.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

A **project** is a folder with a Compose file and its related files, such as `.env` and config files, that Arcane deploys and manages as one unit. Use a project whenever you would otherwise run `docker compose up`: for an app made of several services, or for any container you want defined in a file you can edit, version, and redeploy. The <Link href="/docs/docker/containers">Containers</Link> page manages individual containers, including ones started outside Arcane.

<ScreenshotFrame
  src="/img/screenshots/projects-page.jpeg"
  alt="A running Compose project with three services."
  caption="Manage related services together as a Compose project."
  loading="lazy"
  decoding="async"
/>

## Where projects live

Each project is a folder inside the **Projects Directory**: `/app/data/projects` by default, or the absolute path you set with `PROJECTS_DIRECTORY` or on the environment's **Storage & Limits** tab. Arcane saves the Compose file and `.env` there, and scans the directory, including nested folders, for Compose files, so projects created outside Arcane show up too. Folders with the same name are told apart by their full paths.

Mounting the folder at the same path on the host and in the container is the simplest setup. <Link href="/docs/get-started/installation">Installation</Link> explains the mount and how Arcane translates paths when they differ.

## Browse projects

Open **Projects** in the sidebar. The list shows project name, status (running, partially running, stopped), service count, and the project directory.

Use the **Labels** filter to find projects with a container label. Enter a key such as `com.example.team`, or an exact match such as `com.example.team=media`. A project matches when at least one of its existing service containers has that label. This is separate from the project's colored tags.

## Create a project

1. Click **Create Project**.
2. Enter a name.
3. Paste or write the Compose YAML.
4. Optional: open the **Environment Configuration (.env)** editor and add variables. Arcane saves them to a `.env` file next to the Compose file.
5. Click **Create Project**. Arcane saves the project and tries to start it.

## Control a project

- **Up**: start all services.
- **Down**: stop and remove all containers.
- **Restart**: stop and start without recreating containers.
- **Redeploy**: pull the latest images and restart.
- **Destroy**: remove the project and its resources. You choose whether to keep or delete volumes and project files.

### Set deploy options

Open the **Deploy** dropdown to set:

- **Pull policy**: pull if not present, always pull latest, or never pull. It starts from the environment's **Default Deploy Pull Policy** (**Environments → the environment → Docker**) until you change it here.
- **Force recreate containers**: recreate every container even if nothing about it changed.
- **Recreate changed volumes (data loss)**: allow Compose to recreate a volume whose configuration no longer matches the Compose file.

Arcane remembers pull policy and force recreate. **Recreate changed volumes** resets after each deploy because it destroys data. For bulk **Up**, it applies to the whole batch.

> [!WARNING]
> Applying a changed volume configuration destroys and rebuilds the volume, losing its data. Arcane refuses unless **Recreate changed volumes** is checked. The deploy log explains a refusal with `Declined; enable volume recreation on deploy to apply this change.`

Deploys pull service `image:` references, lifecycle hook images such as `pre_start`, and `type: image` volume sources. Hook and volume images are also pulled for services with `build:`. Hook and volume images follow the service's pull policy, except `type: image` volume sources, which are pulled only if missing.

### Set the deploy wait timeout

A deploy waits for `depends_on` conditions such as `service_healthy` and `service_completed_successfully`. If slow healthchecks or initialization cause timeouts, raise **Deploy Wait Timeout** in **Settings → Timeouts**. The default is 600 seconds; the range is 30–14400. Dependencies using `service_healthy` must define a healthcheck.

### Watch deploy output live

**Deploy**, **Redeploy**, and **Pull** are split buttons. Open the dropdown next to any of them and choose **Watch output** to run that action in an attached terminal window instead of in the background. The window streams Docker output. **Deploy** and **Redeploy** keep streaming container logs after startup, like an attached `docker compose up`.

> [!WARNING]
> Closing the watch window for **Deploy** or **Redeploy** stops the project and all its containers, like `Ctrl-C` on an attached `docker compose up`. Arcane asks **Stop project?** before doing so. To keep the project running, leave the window open; you can also follow the operation in the Activity Center.

Choose **Watch output** per run. Otherwise, actions run in the background under <Link href="/docs/docker/activity">Activity & Events</Link>.

## Manage project files

Turn on **Workspace** to browse project files in a tree and edit them in tabs. It's also available on **Create Project** for adding files before the first deploy.

From the workspace panel you can:

- **New File** / **New Folder**: create files and folders anywhere in the project, including nested paths.
- **Upload File**: add a file from your computer, including binary files, up to 10 MiB by default.
- **Edit**: open any UTF-8 text file in its own tab. Binary files can be uploaded but not edited.
- **Rename**, **Move**, and **Delete**: reorganize the folder. Non-empty folders can be deleted recursively.

All file changes are staged until you **Save** the project. Build and dependency folders (`.git`, `node_modules`, `vendor`, `dist`, `build`, and similar) are hidden from the tree. For projects using Git **Pull**, files managed by the sync are read-only; other workspace files stay editable.

> [!NOTE]
> The Compose file, `.env`, `.env.git`, and `project.env` are protected. They show a lock icon and can't be renamed, moved, or deleted from the tree. Edit them through their own editors instead.

The file size, depth, and entry limits are set by environment variables listed under [Reference](#reference).

<ScreenshotFrame
  src="/img/screenshots/project-workspace.jpeg"
  alt="The Compose editor for a running project with web, cache, and worker services."
  caption="Review and edit the Compose configuration alongside its environment file."
  loading="lazy"
  decoding="async"
/>

## Sync from Git

A Git sync connects a project to a repository in one of two directions. **Pull** deploys from Git: you edit files in the repository, and Arcane pulls them in and can redeploy the project. **Push** backs up to Git: you keep editing in Arcane, and Arcane commits the project's files to the repository without deploying or restarting anything.

A project can have one Git sync. To change its direction, disconnect the existing sync and create a new one. <Link href="/docs/docker/git-sync">Git Sync</Link> covers connecting a repository, setting up each direction, and resolving conflicts.

## Build images from a project

If a service in the Compose file has a `build:` directive, the project page shows **Build** and **Build & Deploy**. <Link href="/docs/docker/image-builds">Image Builds</Link> covers build providers, history, and the build API.

> [!NOTE]
> If you use Depot or push images, services should set explicit `image:` names. Arcane blocks generated local-only tags in that case.

## Tag projects

Add colored tags when creating a project or from its table row or detail header. Click **+**, then use **Search or create a tag…** to select an existing tag or create one with a color. Click a selected tag to remove it. Extra tags appear under **+N** after the first three.

Filter the **Tags** column to match any selected tag, or search by tag name.

Tags can also be declared in the Compose file itself, under the `x-arcane` extension block:

```yaml
x-arcane:
  tags:
    - name: database
      color: purple
```

Compose-defined tags are applied on deploy and sync, and are read-only in Arcane. They show a lock icon and can only be changed by editing the Compose file.

- Tag names are trimmed and lowercased, up to 64 characters, with no commas.
- A tag name's color is shared everywhere it's used; attaching an existing name keeps its stored color.
- Each project holds up to 50 UI tags and 50 Compose tags.
- The tag catalog is per environment.
- Editing tags requires the `projects:update` permission. Discovered (unmanaged) projects can't be tagged.

## Rename a project with managed volumes

Renaming a stopped project copies its Compose-managed volumes to their new names, updates the project, then removes the old volumes. Volumes with an explicit `name:` or `external: true` are left alone.

The rename is blocked if:

- the project is still running
- the target volume name already exists
- a source volume is still attached to a container
- Docker reports insufficient space to copy the volume data

## Nested folders and symlinks

For symlinked layouts (for example GNU Stow), turn on **Follow Project Symlinks** on the environment's **Storage & Limits** tab so Arcane follows child-directory symlinks.

> [!NOTE]
> On Linux, deeply nested project trees consume extra inotify watches because Arcane monitors them recursively. For very large trees, raise `fs.inotify.max_user_watches`.

A folder Arcane can't read appears empty. Other folders remain accessible.

Compose files that reference paths outside the projects mount with a relative path (such as `../../data:/app/data`) are resolved against the host projects directory, so they behave the same as running `docker compose up` yourself. `include:` entries may also point outside the project directory, for example a shared fragment kept next to several projects (`include: [../shared.yaml]`).

## Reference

### Supported Compose filenames

Arcane recognizes any of these as the project's Compose file:

- `compose.yaml` / `compose.yml`
- `docker-compose.yaml` / `docker-compose.yml`
- `podman-compose.yaml` / `podman-compose.yml`
- a single custom `.yaml` / `.yml` file in the project folder, when it's unambiguous

### How Arcane picks a Compose file

When a folder has more than one YAML file, Arcane chooses in this order:

1. A name from the list above.
2. A custom file whose name matches the folder name (for example `radarr.yaml` in `Radarr-3/`).
3. A single custom file with `compose` in its name.
4. Any single visible `.yaml` / `.yml` file.

If two or more custom files are equally plausible, Arcane reports the directory as ambiguous instead of guessing.

### Compose environment variables

Arcane honors these Docker Compose [pre-defined environment variables](https://docs.docker.com/compose/how-tos/environment-variables/envvars/) when they are set in the project's `.env` file:

| Variable                                            | Effect                                                                                                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `COMPOSE_FILE`                                      | Deploy a specific Compose file, or several merged in order. Separate entries with `:` (or the value of `COMPOSE_PATH_SEPARATOR`). The first entry is the base file. |
| `COMPOSE_PROFILES`                                  | Comma-separated list of profiles to activate.                                                                                                                       |
| `COMPOSE_PROJECT_NAME`                              | Override the project name Compose uses.                                                                                                                             |
| `COMPOSE_ENV_FILES`                                 | Additional env files to load, in order.                                                                                                                             |
| `COMPOSE_REMOVE_ORPHANS` / `COMPOSE_IGNORE_ORPHANS` | Control how containers left over from removed services are handled.                                                                                                 |
| `COMPOSE_PARALLEL_LIMIT`                            | Cap how many operations Compose runs at once.                                                                                                                       |

Paths in `COMPOSE_FILE` and `COMPOSE_ENV_FILES` resolve relative to the project folder and must stay inside it; an entry that points outside the project is rejected.

When `COMPOSE_FILE` selects more than one file, the project detail view shows a **Multiple compose files** card listing them. The base file opens in the Compose editor; edit the others in **Workspace**.

### Workspace limits

Set these on the Arcane container to change the workspace limits:

| Variable                             | Default | Sets                                            |
| ------------------------------------ | ------- | ----------------------------------------------- |
| `PROJECT_WORKSPACE_MAX_FILE_SIZE_MB` | `10`    | Maximum size of a single workspace file, in MiB |
| `PROJECT_WORKSPACE_MAX_DEPTH`        | `20`    | Maximum folder depth                            |
| `PROJECT_WORKSPACE_MAX_ENTRIES`      | `2000`  | Maximum number of files and folders             |

> [!IMPORTANT]
> Use `PROJECT_WORKSPACE_MAX_DEPTH` to set the folder depth. Arcane doesn't read `PROJECT_FILE_TREE_MAX_DEPTH`, so rename it if your environment still sets it.
