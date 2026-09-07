---
title: 'Image Builds'
description: 'Build container images in Arcane.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

Choose the starting point that matches your files:

- <Link href="/docs/features/image-builds#building-from-a-project">Compose project</Link> with a `build:` section.
- <Link href="/docs/features/image-builds#manual-builds-build-workspace">Dockerfile and build folder</Link> in the Build Workspace.

## Building from a project

For Compose services with `build:`, use **Build** or **Build & Deploy** on the project page.

> [!NOTE]
> **Depot** and **Push** require explicit `image:` names in Compose. Generated local-only tags can't be pushed.

## Manual builds (Build Workspace)

Open **Images → Builds** (`/images/builds`).

The workspace looks for build contexts in `/builds` inside the container by default. Change the path in **Settings → Builds**.

Mount a host folder or named Docker volume to `/builds` in your `compose.yaml`:

- Host path: `/srv/arcane/builds:/builds`
- Named volume: `arcane-builds:/builds`

If you use a named volume, declare it under the top-level `volumes:` section too.

## Configure build settings first

Open **Settings → Builds** (`/settings/builds`) and configure:

1. **Builds Directory** — the folder the workspace opens. Use a full absolute path.
2. **Default Build Provider** — Local Docker or Depot.
3. **Build Timeout** — between 60 and 14,400 seconds.
4. **Depot Project ID** (optional).
5. **Depot Token** (optional).

> [!TIP]
> Leaving the Depot token blank during an update keeps the existing saved token.

## Run a manual build

1. Open the **Build Workspace** at `/images/builds`.
2. In the left panel, choose a context folder.
3. In **Build Configuration**, name the image — see [Naming the image](#naming-the-image) below.
4. Optional: expand **Advanced** for Dockerfile path, target stage, platforms, args, labels, cache, and runtime tuning.
5. Pick a provider.
6. Choose **Push** and/or **Load** (Depot applies its own limits).
7. Click **Build** and watch the live output.
8. Find finished builds in **Build History**.

### Naming the image

A build that only stays local keeps the free-form **Image Tags** field: one or more full references, separated by commas or newlines.

With **Push** enabled, including all Depot builds, choose:

- **Registry** — one of your enabled container registries.
- **Repository name** — one of the repository names configured on that registry.
- **Tag** — free text, e.g. `1.0.0`.

Arcane shows the resulting `host/repository:tag` as a read-only **Image reference** above the build button. Changing the registry clears the repository selection, and a repository name that is not in the selected registry's list is rejected.

| Message                                          | What to do                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| No repository names configured for this registry | Add repository names in your <Link href="/docs/features/images#private-registries">registry settings</Link>. |
| No enabled registries                            | Add or enable a container registry.                                                                          |
| No permission to list registries                 | Ask an admin for registry read access.                                                                       |

## Build history

The **Build History** tab tracks every build with status, provider, creation time, and duration. Open a row to see the full context, tags, Dockerfile/target, options, and output. Use **Rebuild** to load a previous configuration into the form as a starting point.

## Build providers

- **Local Docker** — builds on the same machine running Arcane.
- **Depot** — builds remotely via Depot's service.

### How Arcane picks a provider

- The default comes from **Settings → Builds**.
- The manual build UI lets you override it per build.
- If Depot credentials aren't configured, Arcane falls back to Local Docker.

### Provider behavior differences

When **Depot** is selected:

- **Push** is forced **on**.
- **Load** is forced **off**.

When **Local Docker** is selected, you control both **Push** and **Load**.

## Advanced options by provider

Arcane checks advanced options against the selected provider and rejects combinations it doesn't support.

**Local Docker supports:** Network, Isolation, SHM size, Ulimits, Extra hosts, single-platform builds.
Not supported: `cacheTo`, `entitlements`, `privileged`, multi-platform lists.

**Depot supports:** multi-platform builds, `cacheTo`, `entitlements`, `privileged`.
Not supported: Network, Isolation, SHM size, Ulimits, Extra hosts.
