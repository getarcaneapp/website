---
title: 'Projects'
description: 'Manage Docker Compose projects in Arcane.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

A **Project** is a folder containing a Compose file (and any related `.env` or include files). The Projects page lists every project Arcane finds in your projects directory, and lets you deploy, edit, redeploy, or destroy them.

<ScreenshotFrame
  src="/img/screenshots/projects-page.jpeg"
  alt="Projects page in Arcane"
  caption="Projects page in Arcane."
  loading="lazy"
  decoding="async"
/>

## Where projects come from

Arcane treats your <Link href="/docs/configuration/environment">Projects Directory</Link> as the source of truth — whatever Compose folders are in there are the projects shown.

The scan is recursive, so projects can live in nested folders, not just direct children. If two folders share a name in different parts of the tree, Arcane disambiguates them by full path.

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

## Browse projects

Open **Projects** in the sidebar. The list shows project name, status (running, partially running, stopped), service count, and the project directory.

When you open a project, Arcane updates the browser tab title to the project name — useful when you keep several open at once.

## Tag projects

Tags are colored labels for organizing projects — `database`, `media`, `critical`, whatever fits your setup. They show in the **Tags** column of the Projects table, in the project detail header, and can be set when creating a project.

To add one, click the **+** next to a project's tags and type in the **Search or create a tag…** box. Pick an existing tag from the environment's catalog, or create a new one and choose one of the eight colors (gray, purple, blue, green, yellow, orange, red, pink). Clicking a listed tag toggles it on or off. Up to three tags render inline; the rest collapse into a **+N** badge.

The **Tags** column has a filter built from the same catalog — a project matches if it has **any** of the selected tags — and the free-text search on the Projects page matches tag names too.

Tags can also be declared in the compose file itself, under the `x-arcane` extension block:

```yaml
x-arcane:
  tags:
    - name: database
      color: purple
```

Compose-defined tags are reconciled on deploy and sync, and are read-only in Arcane — they show a lock icon, and can only be changed by editing the compose file.

A few rules:

- Tag names are trimmed and lowercased, up to 64 characters, with no commas.
- A tag name's color is shared everywhere it's used; attaching an existing name keeps its stored color.
- Each project holds up to 50 UI tags and 50 Compose tags.
- The tag catalog is per environment.
- Editing tags requires the `projects:update` permission, and discovered (unmanaged) projects can't be tagged.

## Create a project

1. Click **Create Project**.
2. Enter a name.
3. Paste or write the Compose YAML.
4. Optional: open the **Environment Configuration (.env)** editor and add variables. Arcane saves them to a `.env` file next to the compose file.
5. Click **Create Project**. Arcane saves the project and tries to start it.

## Control a project

Each project has these actions:

- **Up** — start all services.
- **Down** — stop and remove all containers.
- **Restart** — stop and start without recreating containers.
- **Redeploy** — pull the latest images and restart.
- **Destroy** — remove the project and its resources. You choose whether to keep or delete volumes and project files.

### Deploy options

The dropdown on the **Deploy** split button carries options that apply to that run:

- **Pull policy** — pull if not present, always pull latest, or never pull. It starts from the environment's **Default Deploy Pull Policy** (**Environments → the environment → Docker**) until you change it here.
- **Force recreate containers** — recreate every container even if nothing about it changed.
- **Recreate changed volumes (data loss)** — allow Compose to recreate a volume whose configuration no longer matches the Compose file.

Pull policy and force recreate are remembered. **Recreate changed volumes** is not: it applies to the next deploy only and clears itself afterwards, because it destroys data. A bulk **Up** takes one snapshot of the option for the whole batch.

### Deploy wait timeout

A deploy waits for `depends_on` conditions — `service_healthy` and `service_completed_successfully` — before it's considered done. How long it waits is the **Deploy Wait Timeout** in **Settings → Timeouts** (default 600 seconds, accepted range 30–14400). Raise it if services with slow healthchecks or long one-shot init containers make deploys fail with a timeout; note that `service_healthy` requires the dependency to actually define a healthcheck.

> [!WARNING]
> When a volume's configuration has diverged from what the Compose file declares, Compose has to destroy and rebuild it to apply the change — the data in it is lost. Compose asks before doing that. Arcane used to answer yes automatically for every operation; it now **declines** unless **Recreate changed volumes** is checked, and writes the question to the deploy log followed by `Declined; enable volume recreation on deploy to apply this change.` If a volume change is not taking effect, that log line is why.

### What gets pulled

A deploy's pull plan covers more than the `image:` of each service. Arcane also pulls images referenced by service lifecycle hooks such as `pre_start`, and images used as the source of a `type: image` volume — including for services that also have a `build:` section, where the hook or volume image can only ever be pulled.

Hook and volume images follow the service's pull policy, except `type: image` volume sources, which always pull only if missing.

### Watch the output live

**Deploy**, **Redeploy**, and **Pull** are split buttons. Open the dropdown next to any of them and choose **Watch output** to run that action in an attached terminal window instead of in the background.

The window streams the same output the `docker` command line prints. For **Deploy** and **Redeploy**, once the services are up Arcane keeps following the project's live container logs, the way `docker compose up` does when you don't detach.

> [!WARNING]
> Closing the watch window for a Deploy or Redeploy **stops the project**, exactly like pressing `Ctrl-C` on an attached `docker compose up`. Arcane asks you to confirm first — the dialog is titled **Stop project?** and warns that the project and all of its containers will stop. To leave the project running, don't close the window; the operation continues on its own and you can follow it from the Activity Center.

Watch output is chosen per run — there is no setting to turn it on permanently. Without it, actions run in the background and you can track them in <Link href="/docs/features/activity-and-events">Activity & Events</Link>.

## Rename a project with managed volumes

When you rename a stopped project, Arcane preserves Compose-managed named volumes whose names were generated from the old project name. It creates the new Compose-generated volume name, copies the old volume data into it, updates the project, and removes the old source volume after the rename is committed.

Arcane skips volumes with an explicit Compose `name:` and volumes marked `external: true`, because those are not owned by the generated project name.

The rename is blocked if:

- the project is still running
- the target volume name already exists
- a source volume is still attached to a container
- Docker reports insufficient space to copy the volume data

## Build images from a project

If your Compose file has services with a `build:` directive, Arcane shows build actions on the project page:

- **Build** — build the project's images without deploying.
- **Build & Deploy** — build as part of the deploy flow.

How it works:

1. Open the project page.
2. Click **Build** or **Build & Deploy**.
3. Arcane sends `POST /environments/{id}/projects/{projectId}/build`.
4. BuildKit runs against each selected service.
5. Live build progress streams back to the UI.

Optional request fields:

- `services` — limit the build to specific service names
- `provider` — `local` or `depot`
- `push` — override push behavior
- `load` — override load behavior

> [!NOTE]
> If you use Depot or push images, services should set explicit `image:` names. Arcane blocks generated local-only tags in that case.

For the manual Build Workspace, build history, and API details, see <Link href="/docs/features/image-builds">Image Builds</Link>.

## Manage project files

A project is more than its compose file. Flip the **Workspace** toggle on a project to switch from the classic editor to the **tree** layout — a **Project Workspace** panel alongside a tabbed editor that lets you work with every file in the project folder. The same panel is available on the **Create Project** page, so you can stage extra files before the project is first deployed.

From the workspace panel you can:

- **New File** / **New Folder** — create files and folders anywhere in the project, including nested paths.
- **Upload File** — add a text file from your computer (UTF-8, up to the configured maximum, 10 MiB by default).
- **Edit** — open any text file in its own tab and change the contents.
- **Rename**, **Move**, and **Delete** — reorganize the folder; non-empty folders can be deleted recursively.

Open files show up as tabs next to the compose and `.env` editors. Edits you make in the tree — creating, changing, renaming, moving, or deleting — are staged and committed together when you **Save** the project.

> [!NOTE]
> The compose file, `.env`, `.env.git`, and `project.env` are **protected**. They show a lock icon and can't be renamed, moved, or deleted from the tree — edit them through their own editors instead.

A few limits to keep in mind:

- Only UTF-8 text files can be edited or uploaded; binary files are read-only.
- Build and dependency folders (`.git`, `node_modules`, `vendor`, `dist`, `build`, and similar) are hidden from the tree.
- For **Git-synced projects**, the workspace is read-only — manage those files in the source repository.

The workspace limits are configurable with the `PROJECT_WORKSPACE_MAX_FILE_SIZE_MB` (default 10), `PROJECT_WORKSPACE_MAX_DEPTH` (default 20), and `PROJECT_WORKSPACE_MAX_ENTRIES` (default 2000) environment variables.

> [!IMPORTANT]
> `PROJECT_WORKSPACE_MAX_DEPTH` replaces the old `PROJECT_FILE_TREE_MAX_DEPTH` variable, which is no longer read. If you had set the old name, switch to the new one.

## Where files are stored

Arcane saves project files and `.env` files in its data directory — by default `/app/data/projects`, or whatever you set as the Projects Directory in settings.

## Nested directories and symlinks

Arcane can manage projects in nested subdirectories under the projects root.

For symlinked layouts (e.g. GNU Stow), Arcane can follow child-directory symlinks. Enable **Follow Project Symlinks** on the environment's **Storage & Limits** tab to opt in.

> [!NOTE]
> On Linux, deeply nested project trees consume extra inotify watches because Arcane monitors them recursively. For very large trees, raise `fs.inotify.max_user_watches`.

A subdirectory Arcane can't read — a bind-mounted data folder owned by another user, for example — is listed but shown with no children, rather than blocking the rest of the file tree.

Compose files that reference paths **outside** the projects mount with a relative path (such as `../../data:/app/data`) are resolved against the host projects directory, so they behave the same as running `docker compose up` yourself. `include:` entries may also point outside the project directory — for example a shared fragment kept next to several projects (`include: [../shared.yaml]`).

## Sync from Git

Arcane can pull projects directly from a Git repository.

### Connect a repository

1. Go to **Customization → Git Repositories**.
2. Click **Add Repository**.
3. Enter the repository URL and a name.
4. Configure authentication:
   - **Personal Access Token** — easiest for HTTPS.
   - **SSH Key** — use this if you already connect to Git over SSH.
5. For SSH, choose a **Host Key Verification** mode:
   - **Accept and Remember** (default) — accept the server's first key and save it.
   - **Strict** — only connect if the server key is already known.
   - **Skip Verification** — disables the safety check. Insecure; only use it if you understand the risks.
6. Click **Save**.

> [!NOTE]
> Arcane manages its own `known_hosts` file at `~/.ssh/known_hosts` by default. Override the location with the `SSH_KNOWN_HOSTS` environment variable.

### Create a Git-synced project

1. On the **Projects** page, click the dropdown next to **Create Project** and pick **From Git Repo**.
2. Enter a **Sync Name** (this becomes the project name in Arcane).
3. Pick the **Repository** and **Branch**.
4. Set the **Compose File Path** relative to the repo root, or click the folder icon to browse interactively. Only `.yaml` / `.yml` files are selectable.
5. Optional: enable **Auto Sync** for periodic checks.
6. Optional: enable **Pull Image After Sync** or **Redeploy After Sync** to act on stopped projects too — see the note below.
7. Click **Create Sync**.

Arcane clones the repo, reads the compose file, and creates the project. With Auto Sync on, it polls for changes and updates the project automatically.

### Directory-aware Git sync

Git syncs pull the entire directory the compose file lives in, not just the file itself. That keeps related files together when your project uses:

- Compose `include`
- Compose `extends`
- relative file references (`.env`, build files, sidecar configs)

The project detail view shows synced companion files as read-only references, so you can inspect what was pulled without leaving the page.

> [!NOTE]
> Compose loading supports Podman and custom YAML names, but the **Directory Files** filter in the detail view still hides only classic Docker Compose filenames plus `.env`. Newer/custom filenames may show up in the list until the filter is updated.

### Import multiple syncs from JSON

To create several syncs at once, paste or upload a JSON array:

```json
[
	{
		"syncName": "project-name",
		"gitRepo": "my-git-repo",
		"branch": "main",
		"dockerComposePath": "compose/myproject/compose.yaml",
		"autoSync": true,
		"syncInterval": 5,
		"syncDirectory": true
	},
	{
		"syncName": "project-name2",
		"gitRepo": "my-git-repo",
		"branch": "main",
		"dockerComposePath": "compose/myproject2/compose.yaml",
		"autoSync": true,
		"syncInterval": 5
	}
]
```

> [!IMPORTANT]
> By default, a sync only redeploys a project that is already running. Two per-sync options change that:
>
> - **Pull Image After Sync** pulls each service's image after a sync changes the compose file, even while the project is stopped, so the images are ready when it starts again.
> - **Redeploy After Sync** goes further: it recreates the project's containers with freshly pulled images right after a sync changes the compose file — even if the project is stopped, which starts it. This is similar to Portainer's "Re-pull image" option.

### Edit a Git-synced project

The compose file is read-only for Git-synced projects. The `.env` file stays editable. To inject those env values into your services, add `env_file: .env` to your compose file.

Behind the scenes, Arcane keeps the repository's environment in `.env.git`, your edits in `project.env`, and writes the combination to the effective `.env`. A key you override is rewritten **in place** on the line it occupies in the Git-sourced content, keeping the original ordering and any trailing inline comment — so overriding `PORT=3001 # Port to run the server on` with `3011` yields `PORT=3011 # Port to run the server on` rather than a duplicate `PORT` line appended at the bottom. Keys that exist only in your override are appended after the Git content, as before. Your value always wins either way; only the layout of the file you read differs.
