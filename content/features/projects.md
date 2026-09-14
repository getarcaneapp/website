---
title: 'Projects'
description: 'Manage Docker Compose projects in Arcane.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import ScreenshotFrame from '#lib/components/screenshot-frame.svelte';
</script>

A **Project** is a folder containing a Compose file and its related files.

- <Link href="/docs/features/projects#create-a-project">Create a project</Link> from a Compose file.
- <Link href="/docs/features/projects#sync-from-git">Sync from Git</Link> to deploy a repository with GitOps.
- <Link href="/docs/features/projects#push-to-git">Push to Git</Link> to save project files in a repository.
- <Link href="/docs/features/projects#manage-project-files">Edit project files</Link> in the workspace.
- <Link href="/docs/features/projects#where-projects-come-from">Find an existing project</Link> and check supported filenames.

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

### Commit identity and signing

For **Push**, the repository's token or SSH key must have write access to the destination branch. Pull-only credentials won't work.

In the repository settings, set **Author name** and **Author email** to choose the identity on commits Arcane creates. If left empty, Arcane uses `Arcane` and `arcane@localhost`.

To sign commits, add an armored OpenPGP private key under **GPG signing key**. Add its passphrase if the key requires one. Without a signing key, Arcane creates unsigned commits. The signing key is separate from the SSH key used to connect to the repository.

### Create a Git-synced project

1. On the **Projects** page, click the dropdown next to **Create Project** and pick **From Git Repo**.
2. Choose **Pull** and enter a **Sync Name**. This becomes the project name in Arcane.
3. Pick the **Repository** and **Branch**.
4. Set the **Compose File Path** relative to the repo root, or click the folder icon to browse interactively. Only `.yaml` / `.yml` files are selectable.
5. Optional: enable **Auto Sync** for periodic checks.
6. Optional: enable **Pull Image After Sync** or **Redeploy After Sync** to act on stopped projects too — see the note below.
7. Click **Create Sync**.

Arcane clones the repo, reads the compose file, and creates the project. With Auto Sync on, it polls for changes and updates the project automatically.

### Link an existing project

When creating a **Pull** sync, you can select an existing project instead of creating one. Choose the project, repository, branch, and Compose file path, then save the sync.

> [!WARNING]
> The first pull replaces the project's files with files from the repository. Arcane keeps local `.env` values. Save any other local changes you want to keep before linking the project.

### Open files in the repository

Use **Open Project in Git** on a Git-managed project to open its source repository. Where the Git host supports it, the link opens the project's directory on the configured branch. The Compose editor and synced workspace files also offer links to edit the source file in the Git host's web editor.

Save and commit your changes there, then sync the project in Arcane to apply them.

### Directory-aware Git sync

Git syncs pull the Compose file's directory, including files used by `include`, `extends`, and relative references. Inspect these companion files in the project's read-only file view.

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
> - **Redeploy After Sync** recreates containers with freshly pulled images after the Compose file changes. This starts stopped projects too.

JSON imports also accept `projectName`, `pullImageAfterSync`, and `redeployAfterSync`. To include a pre-deploy hook, set `preDeployScriptPath` and any required `preDeployRunnerImage`, `preDeployEnv`, `preDeployExtraMounts`, `preDeployTimeoutSec`, or `preDeployNetworkMode` fields. The same <Link href="/docs/guides/gitops-lifecycle-hooks">lifecycle hook requirements</Link> apply, including `gitops:lifecycle` permission and syncing the whole project directory.

### Edit a Git-synced project

The Compose file is read-only for projects using **Pull**. The `.env` file stays editable. To inject those env values into your services, add `env_file: .env` to your compose file.

Arcane combines the repository's `.env.git` with your `project.env` edits into `.env`. Your values win. Existing keys are replaced in place, preserving order and inline comments; new keys are appended.

## Push to Git

Use **Push** to keep editing a project in Arcane and save its configuration in Git. Project files stay editable. Pushing files does not deploy or restart the project.

### Set up a push sync

1. Connect a repository under **Customization → Git Repositories** with credentials that can write to it.
2. Open the environment's **GitOps** page and create a sync.
3. Choose **Push** and select the existing project to back up.
4. Pick the repository and branch.
5. Set **Destination folder** to a path inside the repository, such as `projects/my-app`. Don't start it with `/`.
6. Under **Included files**, select any extra files or directories the project needs. Arcane always includes the Compose file and detected Compose overrides.
7. Leave **Include environment file** off unless you want to commit the project's `.env` file.
8. Choose whether to push after saves in Arcane, check for changes on a schedule, or run pushes manually.
9. Save the sync to run the first push.

Use a separate destination folder for each project. Arcane rejects destinations that overlap another push sync on the same repository and branch. To change the destination folder later, disconnect the sync and create it again.

### Commit identity and signing

Edit the repository under **Customization → Git Repositories** to set **Author name** and **Author email** in **Commit identity**. Leave them blank to commit as Arcane.

To sign pushed commits, provide an armored OpenPGP private key in **GPG signing key**, with its passphrase if needed. Use **Clear stored signing key** to remove it.

### Choose what to commit

Push always includes the project's Compose file and detected Compose overrides. Use **Included files** to add other files or directories from the project workspace. If you clear the selection, Arcane still pushes the Compose files.

Selected files can include binary files as well as text.

**Include environment file** is off by default. Turn it on to include the project's `.env` file. Arcane shows a warning when you enable it. Other environment files must be selected explicitly; selecting their parent directory does not include them.

> [!WARNING]
> Environment files often contain passwords and tokens. Leave them out unless you intend to store those values in Git history. Turning off **Include environment file** or removing a file from a later push does not remove earlier copies.

This backs up project configuration. Use <Link href="/docs/features/volumes">volume backups</Link> to back up application data stored in Docker volumes.

### Check a push

The project's Git sync summary shows pending changes, the last push, and any error that needs attention. You can run a push manually or open the history to inspect earlier commits and file changes.

Arcane creates a commit only when the selected files differ from the repository. If you delete a previously pushed optional file or remove it from the selection, the next push removes its repository copy too. Turning off **Include environment file** also removes the previously pushed `.env` from the next commit. Other files in the repository are left alone.

### Resolve repository changes

If someone changes files in the destination folder that Arcane previously pushed, Arcane pauses the push for review. It also asks for review when the first push would change files in an occupied destination folder.

Open the conflict details and review the file changes. Choose **Use Arcane files** to replace the backed-up files with the current files from Arcane. This creates a new commit and keeps the existing Git history.

If you need to keep the repository changes, copy them into the local project before pushing again, or disconnect the sync and choose another destination. Push does not pull repository changes into the project.

Disconnecting a push sync stops future pushes and keeps both the local project files and the repository history.

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
