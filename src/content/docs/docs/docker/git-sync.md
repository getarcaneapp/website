---
title: 'Git Sync'
description: 'Deploy projects from a Git repository, or commit project changes back to one.'
---

Git Sync connects a project to a Git repository. **Pull** deploys from Git: you edit in Git, and Arcane copies the files in and can redeploy. **Push** backs up to Git: you edit in Arcane, and Arcane commits the files.

A project has one sync; to change direction, disconnect and create a new one. Repositories live under **Customization → Git Repositories**; syncs from every environment are on the **Git Syncs** page, with an **Environment** column and filter.

## Connect a repository

1. Go to **Customization → Git Repositories** and click **Add Repository**.
2. Enter the repository URL and a name.
3. Choose an **Authentication Type**:
   - **HTTP (Username/Token)**: a username and personal access token.
   - **SSH Key**: use this if you already connect to Git over SSH.
4. For SSH, choose a **Host Key Verification** mode:
   - **Accept New** (default): accept the server's key on first connect and save it.
   - **Strict**: only connect if the server key is already known.
   - **Skip Verification**: no check. Insecure.
5. Save. For **Push**, the credentials need write access to the branch.

> [!NOTE]
> Arcane keeps its own `known_hosts` at `~/.ssh/known_hosts`; set `SSH_KNOWN_HOSTS` to use another path.

## Pull from Git

### Create a Git-synced project

1. On **Projects**, open the dropdown next to **Create Project** and choose **From Git Repo**. Or click **Add Sync** on **Git Syncs** and pick the **Environment**.
2. Choose **Pull** and enter a **Sync Name**, which becomes the project name.
3. Leave **Target Type** as **Project** (**Stack** deploys to a Swarm stack).
4. Leave **Project** as **Create a new project**, or pick an existing project to link.
5. Pick the **Git Repository** and **Branch**, then set the **Compose File Path** relative to the repository root, or click the folder icon to browse.
6. Optional: turn on [**Sync Files**](#sync-the-whole-folder), **Auto Sync** with a **Sync Interval** in minutes, **Pull Image After Sync**, or **Redeploy After Sync**.
7. Click **Add Sync**.

> [!WARNING]
> Linking an existing project replaces its files with the repository's on the first pull. Arcane keeps local `.env` values; save any other local changes first.

> [!IMPORTANT]
> After a sync changes the Compose file, Arcane redeploys the project only if it's already running. Two options change that:
>
> - **Pull Image After Sync** pulls each service's image even while the project is stopped, so the images are ready when it starts.
> - **Redeploy After Sync** recreates containers with freshly pulled images. This starts stopped projects too.

### Sync the whole folder

By default, only the Compose file is copied. **Sync Files** copies its whole folder, including files for `include`, `extends`, and relative paths, read-only in the workspace. [Pre-deploy hooks](/docs/docker/gitops-hooks), which run a script before each deploy, require it.

### Edit a Git-synced project

The Compose file is read-only for **Pull** projects. Use **Open Project in Git** or **Edit File in Git** to edit it in the Git host, commit, then click **Sync from Git** in Arcane. `.env` stays editable. Arcane merges the repository's `.env.git` with your `project.env` edits into `.env`; your values win, replacing keys in place (keeping order and inline comments) and appending new ones. Add `env_file: .env` to the Compose file to pass them to services.

### Import multiple syncs from JSON

On **Git Syncs**, click **Import .JSON**, pick the **Environment**, and paste or upload a JSON array of **Pull** syncs. Fields are under [Reference](#reference):

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

## Push to Git

Pushing doesn't deploy or restart the project; its files stay editable in Arcane.

### Set the commit identity

Before the first push, edit the repository under **Customization → Git Repositories**:

- **Commit identity**: **Author name** and **Author email**. Blank means `Arcane` <`arcane@localhost`>.
- **GPG signing key**: paste an armored OpenPGP private key (and its **Signing key passphrase**, if any) to sign commits; otherwise they're unsigned. It's separate from the SSH connection key. **Clear stored signing key** removes it.

### Set up a push sync

1. On the project's **Git Backup** tab, click **Back up to Git**. Or click **Add Sync** on **Git Syncs**, choose **Push**, and select the **Project**.
2. Pick the repository and branch.
3. Set **Destination folder** to a path inside the repository, such as `projects/my-app`, without a leading `/`.
4. Under **Included files**, select extra files or directories. Leave **Include environment file** off unless you want to commit `.env`.
5. Choose when to push: **Back up on save** (default on) pushes after you save in Arcane; **Automatic backup** checks on a schedule. Turn both off for manual only.
6. Click **Save and back up** to run the first push.

Use a separate folder per project; Arcane rejects folders overlapping another push sync on the same branch. To move it, disconnect and recreate the sync.

### Choose what to commit

Push always includes the Compose file and detected overrides. **Included files** adds other workspace files or directories, binary or text. **Include environment file** adds `.env`; select other environment files individually, since selecting their parent directory doesn't include them.

> [!WARNING]
> Environment files often contain passwords and tokens. Leave them out unless you want them in Git history. Turning off **Include environment file** or removing a file later doesn't remove earlier copies from history.

Push backs up project configuration only; use [backups](/docs/docker/backups) for data in Docker volumes.

### Check a push

The project's **Git Backup** tab shows pending changes, the last push, and errors. Click **Back up now** to push manually, or open the history for earlier commits. Arcane commits only when selected files differ. Files you delete or deselect, including `.env`, are removed on the next push; other repository files are left alone.

### Resolve repository changes

If someone changes files Arcane pushed, or the first push would overwrite existing files, Arcane pauses the sync as **Needs attention**. Open the conflict details and choose **Use Arcane files** to overwrite them in a new commit; history is kept. To keep the repository's version, copy the changes into the project first, or disconnect and choose another folder. Push never pulls changes into the project. Disconnecting a push sync stops future pushes and keeps the local files and repository history.

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
| `preDeployRunnerImage`, `preDeployEnv`, `preDeployExtraMounts`, `preDeployTimeoutSec`, `preDeployNetworkMode` | No       | Other [pre-deploy hook](/docs/docker/gitops-hooks) settings. Require `gitops:lifecycle`. |
