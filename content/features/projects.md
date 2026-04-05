---
title: 'Projects'
description: 'Learn how to manage Docker compose projects with Arcane'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

## What is a Project?

A `Project` is a collection of services defined in a `compose.yaml` file.

## Screenshot

<ScreenshotFrame
  src="/img/screenshots/projects-page.jpeg"
  alt="Projects page in Arcane"
  caption="Projects page in Arcane."
  loading="lazy"
  decoding="async"
/>

## How to Use Projects

### Viewing Projects

1. Go to the `Projects` section in the sidebar.
2. You'll see a list of all projects, including their names, status (running, partially running, stopped), how many services are running, and the project directory.

> [!NOTE]
> Arcane uses your <Link href="/docs/configuration/environment">Projects Directory</Link> as the source of truth. In simple terms: whatever files are in that folder are the projects Arcane shows.

Arcane now scans projects recursively under that root, so projects can live in nested folders instead of only direct children. If you use repeated folder names in different parts of the tree, Arcane tracks them by full path rather than just the last directory name.

When you open a project detail page, Arcane also updates the browser tab title to the current project name, which helps when you keep several project tabs open at once.

### Creating a Project

1. Click the `Create Project` button.
2. Enter a name for your project.
3. Paste or write your `compose.yaml` content.
4. (Optional) Use the `Environment Configuration (.env)` editor to add environment variables for your project. Arcane saves them in a `.env` file next to your compose file.
5. Click `Create Project`. Arcane will save your project and try to start it.

### Controlling a Project

- `Up:` starts all services in the project
- `Down:` stops and removes all containers in the project
- `Restart:` stops and starts the project again without recreating the containers
- `Redeploy:` pulls the latest images and starts the project again
- `Destroy:` removes the project and its resources. You can choose whether to keep or delete volumes and project files.

### Project Image Builds

Arcane can build project images directly from Compose services that define a `build:` directive.

When buildable services are detected, Arcane exposes build actions on the project:

- `Build`: builds project services without deployment
- `Build & Deploy`: builds as part of the deploy flow

How it works:

1. Open your project page.
2. Trigger `Build` (or `Build & Deploy`).
3. Arcane sends a request to `POST /environments/{id}/projects/{projectId}/build`.
4. Arcane resolves each selected service build config and runs BuildKit.
5. Live build progress is streamed back to the UI.

Optional project build request options include:

- `services`: a list of specific service names to build
- `provider`: provider override (`local` or `depot`)
- `push`: override push behavior
- `load`: override load behavior

> [!NOTE]
> If you use Depot (or enable image push), services should define explicit image names. Arcane prevents generated local-only tags in that case.

For manual build workflows, build workspace behavior, build history, and API details, see <Link href="/docs/features/image-builds">Image Builds</Link>.

## Where Are My Projects Stored?

Arcane saves your project files and `.env` files in its data directory. By default, that is `/app/data/projects`, or whatever you set as the Projects Directory in Arcane settings.

## Nested Directories and Symlinks

Arcane can manage projects stored in nested subdirectories under the configured projects root.

If you use a symlinked layout, such as GNU Stow-managed folders, Arcane can follow child-directory symlinks too. Enable **Follow project symlinks** in the environment general settings when you want those linked folders to be treated as projects.

> [!NOTE]
> On Linux, very deep project trees can consume extra inotify watches because Arcane monitors nested folders recursively. If you manage a very large tree, you may need to raise `fs.inotify.max_user_watches`.

## Git Integration

Arcane allows you to sync your projects directly from a Git repository.

### Connecting a Repository

Before you can sync a project, you need to add a Git repository to Arcane.

1. Go to `Customize > Git Repositories`.
2. Click `Add Repository`.
3. Enter the `Repository URL` and a `Name`.
4. Configure authentication if needed:

- **Personal Access Token**: easiest for HTTPS repositories
- **SSH Key**: use this if you already connect to Git over SSH

5. If using **SSH**, configure the **Host Key Verification** mode:

- **Accept and Remember (Default)**: accepts the server's first key and saves it for next time
- **Strict**: only connects if the server key is already known
- **Skip Verification**: turns off this safety check completely. This is **insecure** and should only be used if you understand the risks.

6. Click `Save`.

> [!NOTE]
> Arcane manages its own `known_hosts` file. By default, this is stored at `~/.ssh/known_hosts`. You can change the location with the `SSH_KNOWN_HOSTS` environment variable.

### Syncing a Project from Git

Once your repository is connected, you can create a project that syncs from it.

1. Go to the `Projects` page.
2. Click the arrow next to "Create Project" and select `From Git Repo`.
3. Enter a `Sync Name`, this will also be the project name used within Arcane.
4. Select the `Repository` you want to use.
5. Select the `Branch` from the dropdown menu.
6. Specify the `Compose File Path` relative to the repository root or click the `Folder Icon` to browse the Git Repo interactively (**Note** Only YAML/YML Files can be selected)
7. (Optional) Enable `Auto Sync` so Arcane checks for changes automatically.
8. Click `Create Sync`.

Arcane will clone the repository, read the compose file, and create a project. If `Auto Sync` is enabled, it will check for changes from time to time and update the project automatically.

### Directory-Aware Git Sync

Git-synced projects now sync the compose file's directory, not just the single compose file.

That means Arcane can keep related files together when your project uses:

- Compose `include`
- Compose `extends`
- relative file references such as `.env`, build files, or sidecar config files

Arcane also shows synced companion files in the project detail view as read-only reference files, so you can inspect what was synced without leaving the project page.

### Import Multiple Syncs via JSON

If you want to create several syncs at once, you can import them from JSON content or a JSON file.

The file is a simple JSON Array as shown below:

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

## Editing a Git Synced Project

The Compose file is read-only for projects synced from Git. You can still edit and use the `.env` file. If you want Arcane's editor to supply environment values, add `- env_file: .env` to your compose file.
