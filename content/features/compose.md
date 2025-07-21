---
title: 'Compose Projects'
description: 'Learn how to manage Docker Compose projects with Arcane - create, edit, start, stop, and deploy multi-service applications.'
---

<script lang="ts">
import ComposeEnvNote from '$lib/components/compose-env-note.svelte';
</script>

# Compose Projects

## What is a Compose Project?

A **Compose Project** is a collection of services defined in a `compose.yaml` file. For example, a compose project might include a web server, a database, and a cache, all running together.

## What Can You Do With Compose Projects in Arcane?

- **View Compose Projects:** See all your managed compose projects and any external compose projects detected on your Docker host.
- **Create Compose Projects:** Add a new compose project by giving it a name and pasting your `compose.yaml` content.
- **Edit Environment Variables:** Use the built-in `.env` editor to manage environment variables for your compose project.
- **Start/Stop Compose Projects:** Easily start or stop all services in a compose project with one click.
- **Restart or Redeploy:** Restart a compose project or redeploy it to pull the latest images for your services.
- **Update Compose Projects:** Change the compose project's name, update its compose file, or modify its environment variables.
- **Remove Compose Projects:** Delete a compose project and its definition from Arcane.

## How to Use Compose Projects

### Viewing Compose Projects

1. Go to the **Compose Projects** section in the sidebar.
2. You'll see a list of all compose projects, including their names, status (running, partially running, stopped), and how many services are running.

> **Note:** Arcane treats `/app/data/stacks` as the single source of truth. Any Compose files you place in this directory—whether created through Arcane or added externally—are automatically detected and imported as projects.

### Creating a Compose Project

1. Click the **Create Compose Project** button.
2. Enter a name for your compose project.
3. Paste or write your `compose.yaml` content.
4. (Optional) Use the **Environment Configuration (.env)** editor to define environment variables for your compose project. These variables will be saved in a `.env` file alongside your compose file.
5. Click **Create**. Arcane will save your compose project and try to start it.

<ComposeEnvNote />

### Controlling a Compose Project

- **Start:** Click the **Start** button to launch all services in the compose project.
- **Stop:** Click **Stop** to stop and remove all containers in the compose project.
- **Restart:** Click **Restart** to stop and then start the compose project again.
- **Redeploy:** Click **Redeploy** to pull the latest images and restart the compose project.

### Updating or Removing a Compose Project

- To update, open the compose project and click **Edit**. Change the name, compose file, or environment variables, then save.
- To remove, click the **Remove** button. Confirm the action to delete the compose project from Arcane.

## Where Are My Compose Projects Stored?

Arcane saves your compose project definitions (compose files, `.env` files, and metadata) in its data directory (by default `/app/data/compose-projects`).

**Tip:** To keep your compose projects safe, make sure to mount this directory as a Docker volume if you're running Arcane in a container.
