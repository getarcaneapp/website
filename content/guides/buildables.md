---
title: 'Buildables'
description: 'Compile-time optional features for Arcane builds'
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import BuildablesTable from '$lib/components/buildables-table.svelte';
</script>

Buildables are optional features that you add to Arcane when you build it. Most users do not need them.

These are usually niche features or ones that could add extra risk in standard builds, which is why they are opt-in.

## Overview

- Buildables are included with the `buildables` tag.
- Specific features are turned on with `buildables.EnabledFeatures`.
- Arcane checks for them with `buildables.HasBuildFeature("<feature>")`.
- When buildables are off, their settings and logic are removed from the build.

## Quick start

If you are building from source, enable the build tag and set the feature list when you build. If you are using Docker, build a custom image with the same settings.

## Build from source

Build with the `buildables` tag and set enabled features via `-ldflags`:

- Build tag: `buildables`
- Enabled features: `github.com/getarcaneapp/arcane/backend/buildables.EnabledFeatures`

Example flags:

<Snippet class="mt-2" text="-tags=buildables" />
<Snippet class="mt-2" text='-ldflags "-X github.com/getarcaneapp/arcane/backend/buildables.EnabledFeatures=autologin"' />

## Build with Docker

If you want buildables in a container image, build your own image and pass the build tag plus the feature list. Here is a minimal example that uses the official image as the runtime base:

```dockerfile
# docker/Dockerfile.buildables
FROM --platform=$BUILDPLATFORM golang:1.25-trixie AS builder
ARG TARGETARCH
ARG BUILD_TAGS="buildables"
ARG ENABLED_FEATURES="autologin"
ARG VERSION="dev"
ARG REVISION="unknown"

WORKDIR /build
COPY go.work ./
COPY types ./types
COPY cli ./cli
COPY backend/go.mod backend/go.sum ./backend/
WORKDIR /build/backend
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY backend ./

RUN --mount=type=cache,target=/root/.cache/go-build \
	BUILD_TIME=$(date -u '+%Y-%m-%dT%H:%M:%SZ') && \
	CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH go build \
	-tags "${BUILD_TAGS}" \
	-ldflags "-w -s -X github.com/getarcaneapp/arcane/backend/internal/config.Version=${VERSION} \
		-X github.com/getarcaneapp/arcane/backend/internal/config.Revision=${REVISION} \
		-X github.com/getarcaneapp/arcane/backend/internal/config.BuildTime=${BUILD_TIME} \
		-X github.com/getarcaneapp/arcane/backend/buildables.EnabledFeatures=${ENABLED_FEATURES}" \
	-trimpath \
	-o /out/arcane \
	./cmd/main.go

FROM ghcr.io/getarcaneapp/arcane:latest
# For headless builds, use: ghcr.io/getarcaneapp/arcane-headless:latest
COPY --from=builder /out/arcane /app/arcane
```

Build it explicitly:

```bash
docker build -f docker/Dockerfile.buildables \
	--build-arg BUILD_TAGS=buildables \
	--build-arg ENABLED_FEATURES=autologin \
	-t arcane:buildables .
```

> [!NOTE]
> Official images do not include buildables. If you need them, use a custom image like the one above.

## Selecting features

`EnabledFeatures` is a comma-separated list. Feature names are case-insensitive and trimmed.

Example:

- `autologin`
- `feature-a,feature-b,feature-c`

## Runtime checks

Use `buildables.HasBuildFeature("feature")` to check whether a feature is available before running code for it.

## Configuration

Buildable-specific settings live in `BuildablesConfig` and only exist when buildables are enabled. For example, the `autologin` feature uses:

- `AUTO_LOGIN_USERNAME`
- `AUTO_LOGIN_PASSWORD`

## Available buildables

> [!NOTE]
> **Official** buildables are maintained by the Arcane team. **Community** buildables are built and supported by the community.

<BuildablesTable />

## Adding a new buildable feature

1. Guard feature entry points using `//go:build buildables` where appropriate.
2. Check `buildables.HasBuildFeature("your-feature")` before using the feature.
3. Add any buildable-only config to `BuildablesConfig`.
4. Make sure any tests for the feature are built with the `buildables` tag.
