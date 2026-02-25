---
title: "Image Builds"
description: "Build container images manually or from projects using Arcane and BuildKit."
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

This page explains how image building works in Arcane from a user perspective.

It covers:

- what Arcane's image build system does
- the main pieces involved
- how to build images manually
- how to build project images
- the API endpoints behind the UI

## What Arcane Image Builds Are

Arcane supports two build workflows:

1. **Manual image builds** from the **Build Workspace** (`/images/builds`)
2. **Project image builds** for Compose projects that define `build:` directives

Builds run through BuildKit and stream live progress back to the UI.

Arcane can build with:

- **Local BuildKit** (local Docker engine)
- **Depot BuildKit** (remote hosted BuildKit)

> [!NOTE]
> If you are new to Arcane image management, review <Link href="/docs/features/images">Images</Link> first. For Compose-focused workflows, see <Link href="/docs/features/projects">Projects</Link>.

## High-Level Flow

### Manual Build Flow

1. Open **Build Workspace** in the UI.
2. Choose a build context from the workspace browser.
3. Set required build fields (at minimum, image tags).
4. Arcane sends a build request to `POST /environments/{id}/images/build`.
5. Backend streams progress events (NDJSON) to the UI.
6. Arcane stores build history (status, metadata, logs, duration, provider, and more).
7. Review history with:
   - `GET /environments/{id}/images/builds`
   - `GET /environments/{id}/images/builds/{buildId}`

### Project Build Flow

1. On a project page, Arcane detects whether any service has a Compose `build:` directive.
2. If present, project actions expose **Build** and **Build & Deploy** behavior.
3. Project build requests go to `POST /environments/{id}/projects/{projectId}/build`.
4. Backend resolves each service build config into a BuildKit request and executes builds.
5. Progress is streamed back to the UI.

## Core Concepts

### Build Workspace

The build workspace is a file browser rooted at a configurable **Builds Directory**.

- Default root: `/builds`
- This root is managed in settings and must be an absolute path.
- Arcane enforces path safety so operations stay inside the configured root.

Workspace APIs:

- `GET /environments/{id}/builds/browse`
- `GET /environments/{id}/builds/browse/content`
- `GET /environments/{id}/builds/browse/download`
- `POST /environments/{id}/builds/browse/upload`
- `POST /environments/{id}/builds/browse/mkdir`
- `DELETE /environments/{id}/builds/browse`

### Build Providers

Arcane supports two providers:

- `local`: builds via local Docker/Moby client APIs
- `depot`: builds via Depot BuildKit sessions

Provider selection comes from:

1. explicit request override (`provider`), else
2. configured default in settings (`buildProvider`), else
3. fallback to `local`

### Output Behavior

Build progress is streamed as JSON lines containing status, IDs, optional progress bytes, and errors.

Arcane stores output for history and marks records as:

- `running`
- `success`
- `failed`

## Configure Image Builds

Open **Settings → Build** (`/settings/builds`) and configure:

1. **Builds Directory**
   - root path for manual build workspace files
2. **Build Provider**
   - choose default provider (`local` or `depot`)
3. **Build Timeout**
   - timeout in seconds
4. **Depot Project ID** (optional)
5. **Depot Token** (optional)

Notes:

- Depot provider is available when Depot credentials are configured.
- Leaving the Depot token blank in settings preserves an existing token.

## Run a Manual Image Build

1. Open **Builds and Deployments → Builds** (`/images/builds`).
2. In **Build Workspace**, select the folder to use as context.
3. In **Build Configuration**:
   - set **Image Tags** (required)
   - optionally set Dockerfile, target, platforms, args, labels, cache, network, and extra hosts
   - choose provider (`local` or `depot`)
   - set **Push** / **Load** options
4. Click **Build**.
5. Watch live output in the output panel.
6. Review completed entries in the **Build History** tab.

Provider behavior in the UI:

- For **Depot**, Arcane enforces `push=true` and `load=false`.
- For **local**, you can control push/load switches.

## Run a Project Image Build

1. Open a project page.
2. If the project contains Compose `build:` services, Arcane exposes build actions.
3. Use **Build** to build project services.
4. Use **Build & Deploy** (project deploy action label) when available to build during deployment flow.

Project build API:

- `POST /environments/{id}/projects/{projectId}/build`

Optional request body:

- `services`: list of service names to build
- `provider`: provider override (`local`/`depot`)
- `push`: override push behavior
- `load`: override load behavior

Project-specific rule:

- If using Depot (or pushing), services need explicit image names (Arcane prevents generated local-only tags for that case).

## Build Request Shape (Manual/API)

The manual build endpoint accepts fields such as:

- `contextDir` (required)
- `dockerfile`
- `tags`
- `target`
- `buildArgs`
- `labels`
- `cacheFrom` / `cacheTo`
- `noCache`
- `pull`
- `network`
- `isolation`
- `shmSize`
- `ulimits`
- `entitlements`
- `privileged`
- `extraHosts`
- `platforms`
- `push`
- `load`
- `provider`

## Build History

Arcane stores build metadata and output for auditing and reuse.

History includes:

- provider
- context and Dockerfile/target
- tags/platforms
- args/labels/cache settings
- push/load flags
- status, error message, duration, completion time
- captured output (with truncation marker when capped)

UI capabilities:

- list and filter builds
- inspect build details and output
- reuse a previous build configuration via **Rebuild**

## API Summary

### Manual Builds

- `POST /environments/{id}/images/build`
- `GET /environments/{id}/images/builds`
- `GET /environments/{id}/images/builds/{buildId}`

### Project Builds

- `POST /environments/{id}/projects/{projectId}/build`

### Build Workspace File Operations

- `GET /environments/{id}/builds/browse`
- `GET /environments/{id}/builds/browse/content`
- `GET /environments/{id}/builds/browse/download`
- `POST /environments/{id}/builds/browse/upload`
- `POST /environments/{id}/builds/browse/mkdir`
- `DELETE /environments/{id}/builds/browse`
