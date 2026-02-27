---
title: "Image Builds"
description: "Build container images in Arcane"
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

Arcane gives you two practical ways to build images:

- **Manual builds** in the **Build Workspace**
- **Project builds** from Compose services that use `build:`

This guide focuses on what each feature does, and how to pick the right provider and options.

## Choose the right build workflow

### Manual builds (Build Workspace)

Use this when you want full control over a one-off or repeatable image build.

Where to go:

- **Builds and Deployments → Builds** (`/images/builds`)

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

- **Local Docker**: build on your local environment
- **Depot**: build remotely with Depot BuildKit

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
   - Root folder used by the Build Workspace browser
   - Should be an absolute path
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
5. Choose provider (**Local Docker** or **Depot**).
6. Set **Push** / **Load** (or let Depot rules apply automatically).
7. Click **Build** and watch live output in the output tab.
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
