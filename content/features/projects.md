---
title: 'Projects'
description: 'Manage Docker Compose projects in Arcane.'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
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

## Browse projects

Open **Projects** in the sidebar. The list shows project name, status (running, partially running, stopped), service count, and the project directory.

When you open a project, Arcane updates the browser tab title to the project name — useful when you keep several open at once.

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

## Where files are stored

Arcane saves project files and `.env` files in its data directory — by default `/app/data/projects`, or whatever you set as the Projects Directory in settings.

## Nested directories and symlinks

Arcane can manage projects in nested subdirectories under the projects root.

For symlinked layouts (e.g. GNU Stow), Arcane can follow child-directory symlinks. Enable **Follow project symlinks** in the environment's general settings to opt in.

> [!NOTE]
> On Linux, deeply nested project trees consume extra inotify watches because Arcane monitors them recursively. For very large trees, raise `fs.inotify.max_user_watches`.

## Sync from Git

Arcane can pull projects directly from a Git repository.

### Connect a repository

1. Go to **Customize → Git Repositories**.
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
6. Click **Create Sync**.

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
    "enabled": true
  },
  {
    "syncName": "project-name2",
    "gitRepo": "my-git-repo",
    "branch": "main",
    "dockerComposePath": "compose/myproject2/compose.yaml",
    "autoSync": true,
    "syncInterval": 5,
    "enabled": true
  }
]
```

> [!IMPORTANT]
> Redeployment only happens if the project is already running.

### Edit a Git-synced project

The compose file is read-only for Git-synced projects. The `.env` file stays editable. To inject those env values into your services, add `env_file: .env` to your compose file.
