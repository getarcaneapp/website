---
title: 'Git Sync for Projects'
description: 'Connect projects to Git repositories: pull, push, imports, env merging, and conflicts.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

A project can have one Git sync, either **Pull** (edit in the repository) or **Push** (edit in Arcane). To change its direction, disconnect the existing sync and create a new one. See <Link href="/docs/features/projects#sync-from-git">Projects → Sync from Git</Link> for when to choose each direction.

## Connect a repository

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

## Pull from Git

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

### Directory-aware sync

Git syncs pull the Compose file's directory, including files used by `include`, `extends`, and relative references. Inspect these companion files in the project's read-only file view.

> [!NOTE]
> Compose loading supports Podman and custom YAML names, but the **Directory Files** filter in the detail view still hides only classic Docker Compose filenames plus `.env`. Newer/custom filenames may show up in the list until the filter is updated.

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

## Import multiple syncs from JSON

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

## Commit identity and signing

For **Push**, the repository's token or SSH key must have write access to the destination branch. Pull-only credentials won't work.

Edit the repository under **Customization → Git Repositories**. In **Commit identity**, set **Author name** and **Author email** to choose the identity on commits Arcane creates. If left blank, Arcane uses `Arcane` and `arcane@localhost`.

To sign commits, add an armored OpenPGP private key under **GPG signing key**, with its passphrase if the key requires one. Without a signing key, Arcane creates unsigned commits. The signing key is separate from the SSH key used to connect to the repository. Use **Clear stored signing key** to remove it.
