---
title: 'Projects'
description: 'Learn how to manage Docker compose projects with Arcane'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

## What is a Project?

A `Project` is a collection of services defined in a `compose.yaml` file.

## How to Use Projects

### Viewing Projects

1. Go to the `Projects` section in the sidebar.
2. You'll see a list of all projects, including their names, status (running, partially running, stopped), and how many services are running.

> [!NOTE]
> Arcane treats <Link href="/docs/configuration/environment">Projects Directory</Link>  as the single source of truth. Any files you place in this directory—whether created through Arcane or added externally—are automatically detected and imported as projects.

### Creating a Project

1. Click the `Create Project` button.
2. Enter a name for your project.
3. Paste or write your `compose.yaml` content.
4. (Optional) Use the `Environment Configuration (.env)` editor to define environment variables for your project. These variables will be saved in a `.env` file alongside your file.
5. Click `Create Project`. Arcane will save your project and try to start it.

### Controlling a Project

- `Up:` Click the `Up` button to pull and start all services in the project. 
- `Down:` Click `Down` to down and remove all containers in the project.
- `Restart:` Click `Restart` to stop and then start the project again, this does `NOT` recreate the containers.
- `Redeploy:` Click `Redeploy` to pull the latest images and restart the project (equivalent to docker pull && docker up -d).
- `Destroy:` Click `Destroy` to down and destroy all resources made by the project, this has two options one to remove volumes, amd one to remove the actual project files on the disk.


## Where Are My Projects Stored?

Arcane saves your project definitions (files, and `.env` files) in its data directory (by default `/app/data/projects` or where you `Projects Directory` is set to in the arcane settings).

## Git Integration

Arcane allows you to sync your projects directly from a Git repository.

### Connecting a Repository

Before you can sync a project, you need to add a Git repository to Arcane.

1. Go to `Customize > Git Repositories`.
2. Click `Add Repository`.
3. Enter the `Repository URL` and a `Name`.
4. Configure authentication if needed:
    - **Personal Access Token**: For HTTPS repositories.
    - **SSH Key**: Paste your private key for SSH repositories.
5. If using **SSH**, configure the **Host Key Verification** mode:
    - **Accept and Remember (Default)**: Automatically accepts the remote server's host key on first connection and saves it to the `known_hosts` file.
    - **Strict**: Requires the remote host key to be pre-existing in the `known_hosts` file.
    - **Skip Verification**: Disables host key checking entirely. This is **insecure** and should only be used if you understand the risks.
6. Click `Save`.

> [!NOTE]
> Arcane manages its own `known_hosts` file. By default, this is stored at `~/.ssh/known_hosts`. You can override this path by setting the `SSH_KNOWN_HOSTS` environment variable in your environment.

### Syncing a Project from Git

Once your repository is connected, you can create a project that syncs from it.

1. Go to the `Projects` page.
2. Click the arrow next to "Create Project" and select `From Git Repo`.
3. Enter a `Sync Name` this will also be the project name used within arcane.
4. Select the `Repository` you want to use.
5. Select the `Branch` from the dropdown menu.
6. Specify the `Compose File Path` relative to the repository root or Click the `Folder Icon` to browse the Git Repo interactively (**Note** Only YAML/YML Files can be selected)
7. (Optional) Enable `Auto Sync` to automatically poll for changes.
8. Click `Create Sync`.

Arcane will clone the repository, read the compose file, and create a project. If `Auto Sync` is enabled, it will periodically check for changes in the repository and automatically update and redeploy your project.

### Import Multiple Syncs via JSON

If have mutilpe syncs you want to create at one time you can import multiple via a json content or file.

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
> The Redployment will only happenn if the project is currently running.

## Editing a Git Synced Project

The Compose file is `Read-Only` for all projects synced from Git; however, the .env is still able to edited and used. If you want to use the environment file provided by arcanes editor make sure to add: `- env_file: .env` to your compose file. 
