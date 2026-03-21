---
title: 'Image Builds'
description: 'Build container images in Arcane'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Arcane gives you two practical ways to build images:

- **Manual builds** in the **Build Workspace**
- **Project builds** from Compose services that use `build:`

This guide focuses on what each feature does and how to pick the right provider and options.

## Choose the right build workflow

### Manual builds (Build Workspace)

Use this when you want full control over a one-off or repeatable image build.

Where to go:

- **Builds and Deployments → Builds** (`/images/builds`)

The default workspace looks in `/builds` inside the container for the files you want to build. You can change this in settings.

You can provide that workspace by mounting either a host folder or a named Docker volume to `/builds` in your Arcane `compose.yaml`, just like you would for projects.

- Host path example: `/srv/arcane/builds:/builds`
- Docker volume example: `arcane-builds:/builds`

If you use a named Docker volume, also declare it under the top-level `volumes:` section in Compose.

What you get:

- File browser for selecting your build context
- Build form with required and advanced options
- Live build output panel
- Build history with **Rebuild** support

### Project builds (Compose projects)

Use this when your project has one or more services with `build:` in `compose.yaml`.

Where to go:

- Open a project page in **Projects**

What you’ll see:

- **Build** action (when build directives are detected)
- **Build & Deploy** on deploy actions when applicable

## Build providers (Local Docker vs Depot)

Arcane supports two providers:

- **Local Docker**: builds on the same machine running Arcane
- **Depot**: builds remotely using Depot's build service

### How provider selection works

- Arcane uses your default provider from **Settings → Build**.
- You can override provider in the manual build UI.
- If Depot credentials are not configured, Arcane falls back to Local Docker.

### Important provider behavior

When **Depot** is selected:

- **Push** is forced **on**
- **Load** is forced **off**

When **Local Docker** is selected:

- You control both **Push** and **Load** toggles

## Configure build settings first

Go to **Settings → Build** (`/settings/builds`) and configure:

1. **Builds Directory**
   - The main folder the Build Workspace will open
   - Use a full path starting with `/`
2. **Default Build Provider**
   - Local Docker or Depot
3. **Build Timeout**
   - Allowed range in UI: 60 to 14,400 seconds
4. **Depot Project ID** (optional)
5. **Depot Token** (optional)

> [!TIP]
> Leaving the Depot token blank during an update keeps the existing saved token.

## Run a manual build

1. Open **Build Workspace** at `/images/builds`.
2. In the left panel, choose your context folder.
3. In **Build Configuration**, set **Image Tags** (required).
4. Optionally expand **Advanced** for Dockerfile/target/platforms/args/labels/cache and runtime tuning fields.
5. Choose a provider (**Local Docker** or **Depot**).
6. Choose whether to **Push** the image or **Load** it locally (Depot applies its own limits).
7. Click **Build** and watch the live output.
8. Review finished builds in **Build History**.

## Advanced options compatibility

Arcane validates advanced options against the selected provider so you don’t accidentally send unsupported combinations.

### Local Docker (supported highlights)

- Network
- Isolation
- SHM size
- Ulimits
- Extra hosts
- Single-platform builds

Not supported for Local Docker in Arcane build UI validation:

- `cacheTo`
- `entitlements`
- `privileged`
- Multi-platform lists

### Depot (supported highlights)

- Multi-platform builds
- `cacheTo`
- `entitlements`
- `privileged`

Not supported for Depot in Arcane build UI validation:

- Network
- Isolation
- SHM size
- Ulimits
- Extra hosts

## Use Build History effectively

The **Build History** tab helps you track and reuse builds.

You can:

- See status, provider, created time, and duration
- Open full details for context, tags, Dockerfile/target, options, and output
- Use **Rebuild** to load a previous configuration back into the form

## Build from projects

On a project page, Arcane automatically detects build-capable services (`build:` in Compose).

Typical flow:

1. Open a project with build directives.
2. Use **Build** to build images only.
3. Use **Build & Deploy** to build as part of deployment.

### Project build note for Depot or Push

If you build project services with **Depot** or with **Push enabled**, each built service should define an explicit `image:` name in Compose.

This avoids local-only generated tags that are not valid for pushed/remote workflows.
