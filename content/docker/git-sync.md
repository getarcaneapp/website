---
title: 'Git Sync'
description: 'Deploy projects from a Git repository, or commit project changes back to one.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Git Sync connects a project to a Git repository in one of two directions. A **Pull** sync deploys from the repository: you edit files in Git, and Arcane copies them into the project and can redeploy it. A **Push** sync backs up to the repository: you edit the project in Arcane, and Arcane commits its files to Git.

A project can have one sync; to change direction, disconnect it and create a new one. Repositories live under **Customization → Git Repositories**, and syncs on each environment's **Git Syncs** page (**Environments → Git Syncs**).

## Connect a repository

1. Go to **Customization → Git Repositories**.
2. Click **Add Repository**.
3. Enter the repository URL and a name.
4. Choose an **Authentication Type**:
   - **HTTP (Username/Token)**: a username and personal access token.
   - **SSH Key**: use this if you already connect to Git over SSH.
5. For SSH, choose a **Host Key Verification** mode:
   - **Accept New** (default): accept the server's key on first connect and save it.
   - **Strict**: only connect if the server key is already known.
   - **Skip Verification**: no check. Insecure.
6. Save.

For **Push**, the credentials need write access to the branch.

> [!NOTE]
> Arcane keeps its own `known_hosts` at `~/.ssh/known_hosts`; set `SSH_KNOWN_HOSTS` to use another path.

## Pull from Git

### Create a Git-synced project

1. On the **Projects** page, open the dropdown next to **Create Project** and choose **From Git Repo**. You can also click **Add Sync** on the **Git Syncs** page.
2. Choose **Pull** and enter a **Sync Name**. This becomes the project name in Arcane.
3. Leave **Target Type** set to **Project**. (**Stack** deploys to a Swarm stack instead.)
4. Leave **Project** set to **Create a new project**, or pick an existing project to link it.
5. Pick the **Git Repository** and **Branch**.
6. Set the **Compose File Path** relative to the repository root, or click the folder icon to browse.
7. Optional: turn on [**Sync Files**](#sync-the-whole-folder) to also copy the files next to the Compose file.
8. Optional: turn on **Auto Sync** and set a **Sync Interval** in minutes.
9. Optional: turn on **Pull Image After Sync** or **Redeploy After Sync**.
10. Click **Add Sync**.

> [!WARNING]
> Linking an existing project replaces its files with the repository's on the first pull. Arcane keeps local `.env` values; save any other local changes first.

> [!IMPORTANT]
> After a sync changes the Compose file, Arcane redeploys the project only if it is already running. Two options change that:
>
> - **Pull Image After Sync** pulls each service's image even while the project is stopped, so the images are ready when it starts.
> - **Redeploy After Sync** recreates containers with freshly pulled images. This starts stopped projects too.

To run a script before each deploy, add a <Link href="/docs/docker/gitops-hooks">pre-deploy hook</Link>.

### Sync the whole folder

By default, a sync copies only the Compose file. **Sync Files** copies its whole folder, including files used by `include`, `extends`, and relative paths. They appear read-only in the workspace. Pre-deploy hooks require **Sync Files**.

### Edit a Git-synced project

The Compose file is read-only for **Pull** projects. Use **Open Project in Git** or **Edit File in Git** to edit it in the Git host, commit, then click **Sync from Git** in Arcane.

`.env` stays editable. Arcane merges the repository's `.env.git` with your `project.env` edits into `.env`, and your values win. Existing keys are replaced in place, preserving order and inline comments; new keys are appended. To pass those values into your services, add `env_file: .env` to the Compose file.

### Import multiple syncs from JSON

On the **Git Syncs** page, click **Import .JSON**, then paste or upload a JSON array to create several **Pull** syncs at once:

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
	}
]
```

The fields are listed under [Reference](#reference).

## Push to Git

Pushing does not deploy or restart the project, and its files stay editable in Arcane.

### Set the commit identity

Before the first push, edit the repository under **Customization → Git Repositories**:

- **Commit identity**: set **Author name** and **Author email**. If left blank, Arcane commits as `Arcane` <`arcane@localhost`>.
- **GPG signing key**: to sign commits, paste an armored OpenPGP private key, plus its **Signing key passphrase** if it has one. Without a key, commits are unsigned. This key is separate from the SSH key used to connect. **Clear stored signing key** removes it.

### Set up a push sync

1. On the project's **Git Backup** tab, click **Back up to Git**. Or click **Add Sync** on the **Git Syncs** page, choose **Push**, and select the **Project**.
2. Pick the repository and branch.
3. Set **Destination folder** to a path inside the repository, such as `projects/my-app`, without a leading `/`.
4. Under **Included files**, select any extra files or directories the project needs.
5. Leave **Include environment file** off unless you want to commit the project's `.env` file.
6. Choose when to push. **Back up on save** (on by default) pushes right after you save changes in Arcane. **Automatic backup** checks for changes on a schedule. Turn both off to push only manually.
7. Click **Save and back up** to run the first push.

Use a separate destination folder per project; Arcane rejects folders that overlap another push sync on the same branch. To move it later, disconnect and recreate the sync.

### Choose what to commit

Push always includes the Compose file and detected Compose overrides. **Included files** adds other workspace files or directories, binary or text. **Include environment file** adds `.env`. Other environment files must be selected individually; selecting their parent directory does not include them.

> [!WARNING]
> Environment files often contain passwords and tokens. Leave them out unless you intend to store those values in Git history. Turning off **Include environment file** or removing a file from a later push does not remove earlier copies from history.

Push backs up project configuration only. Use <Link href="/docs/docker/backups">backups</Link> for application data stored in Docker volumes.

### Check a push

The project's **Git Backup** tab shows pending changes, the last push, and errors. Click **Back up now** to push manually, or open the history to inspect earlier commits.

Arcane commits only when the selected files differ from the repository. A file you delete or deselect, including `.env`, is removed from the repository on the next push. Other repository files are left alone.

### Resolve repository changes

If someone changes files Arcane previously pushed, or the first push would overwrite files already in the folder, Arcane pauses and marks the sync **Needs attention**. Open the conflict details and choose **Use Arcane files** to overwrite them with a new commit; history is kept. To keep the repository's version, copy the changes into the project first, or disconnect and choose another folder. Push never pulls changes into the project.

Disconnecting a push sync stops future pushes and keeps the local files and repository history.

## Reference

### JSON import fields

| Field                                                                                                         | Required | Description                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `syncName`                                                                                                    | Yes      | Sync name. Also the project name unless `projectName` is set.                                             |
| `gitRepo`                                                                                                     | Yes      | Name of a repository already added under **Git Repositories**.                                            |
| `branch`                                                                                                      | Yes      | Branch to sync from.                                                                                      |
| `dockerComposePath`                                                                                           | Yes      | Compose file path relative to the repository root.                                                        |
| `autoSync`                                                                                                    | Yes      | Check for changes on a schedule.                                                                          |
| `syncInterval`                                                                                                | Yes      | Minutes between automatic syncs.                                                                          |
| `syncDirectory`                                                                                               | No       | Same as **Sync Files**: copy the Compose file's whole folder.                                             |
| `projectName`                                                                                                 | No       | Project name, if different from `syncName`.                                                               |
| `pullImageAfterSync`                                                                                          | No       | Same as **Pull Image After Sync**.                                                                        |
| `redeployAfterSync`                                                                                           | No       | Same as **Redeploy After Sync**.                                                                          |
| `maxSyncFiles`                                                                                                | No       | Maximum number of files copied per sync.                                                                  |
| `maxSyncTotalSize`                                                                                            | No       | Maximum combined size of synced files, in bytes.                                                          |
| `maxSyncBinarySize`                                                                                           | No       | Maximum size of a single binary file, in bytes.                                                           |
| `preDeployScriptPath`                                                                                         | No       | Path to a pre-deploy script. Requires `syncDirectory: true`.                                              |
| `preDeployRunnerImage`, `preDeployEnv`, `preDeployExtraMounts`, `preDeployTimeoutSec`, `preDeployNetworkMode` | No       | Other <Link href="/docs/docker/gitops-hooks">pre-deploy hook</Link> settings. Require `gitops:lifecycle`. |
