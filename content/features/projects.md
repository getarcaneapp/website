---
title: 'Projects'
description: 'Learn how to manage Docker projects with Arcane'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

## What is a Project?

A **Project** is a collection of services defined in a `compose.yaml` file.

## What Can You Do With Projects in Arcane?

- **View Projects:** See all your managed projects and any external projects detected on your Docker host.
- **Create Projects:** Add a new project by giving it a name and pasting your `compose.yaml` content.
- **Edit Environment Variables:** Use the built-in `.env` editor to manage environment variables for your project.
- **Up/Down Projects:** Easily start or stop all services in a project with one click.
- **Restart or Redeploy:** Restart a project or redeploy it to pull the latest images for your services.
- **Update Projects:** Change the project's name, update its file, or modify its environment variables.
- **Remove Projects:** Delete a project and its definition from Arcane.

## How to Use Projects

### Viewing Projects

1. Go to the **Projects** section in the sidebar.
2. You'll see a list of all projects, including their names, status (running, partially running, stopped), and how many services are running.

> [!NOTE]
> Arcane treats <Link href="/docs/configuration/environment">Projects Directory</Link>  as the single source of truth. Any files you place in this directory—whether created through Arcane or added externally—are automatically detected and imported as projects.

### Creating a Project

1. Click the **Create Project** button.
2. Enter a name for your project.
3. Paste or write your `compose.yaml` content.
4. (Optional) Use the **Environment Configuration (.env)** editor to define environment variables for your project. These variables will be saved in a `.env` file alongside your file.
5. Click **Create Project**. Arcane will save your project and try to start it.

### Controlling a Project

- **Up:** Click the **Up** button to pull and start all services in the project. 
- **Down:** Click **Down** to down and remove all containers in the project.
- **Restart:** Click **Restart** to stop and then start the project again, this does **NOT**** recreate the containers.
- **Redeploy:** Click **Redeploy** to pull the latest images and restart the project (equivalent to docker pull && docker up -d).
- **Destroy:** Click **Destroy** to down and destroy all resources made by the project, this has two options one to remove volumes, amd one to remove the actual project files on the disk.


## Where Are My Projects Stored?

Arcane saves your project definitions (files, `.env` files, and metadata) in its data directory (by default `/app/data/projects` or where you `Projects Directory` is set to in the arcane settings).
