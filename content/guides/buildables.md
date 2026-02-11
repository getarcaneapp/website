---
title: 'Buildables'
description: 'Compile-time optional features for Arcane builds'
---

<script lang="ts">
import { Snippet } from '$lib/components/ui/snippet/index.js';
import BuildablesTable from '$lib/components/buildables-table.svelte';
</script>

Buildables are optional features that you compile into Arcane on purpose. They are only included when you build with the `buildables` tag, and then activated via a comma-separated feature list embedded at build time.

These are typically niche features or ones that could introduce risk in standard builds, which is why they’re opt-in.

## Overview

- Buildables are **compiled** with the `buildables` tag.
- Individual features are **enabled** via `buildables.EnabledFeatures` (set with `-ldflags`).
- Runtime checks use `buildables.HasBuildFeature("<feature>")`.
- When buildables are disabled, their config fields are pruned and the feature logic is excluded.

## Quick start

If you’re building from source, enable the build tag and set a feature list at link time. If you’re using Docker, build a custom image with those same flags.

## Build from source

Build with the `buildables` tag and set enabled features via `-ldflags`:

- Build tag: `buildables`
- Enabled features: `github.com/getarcaneapp/arcane/backend/buildables.EnabledFeatures`

Example flags:

<Snippet class="mt-2" text="-tags=buildables" />
<Snippet class="mt-2" text='-ldflags "-X github.com/getarcaneapp/arcane/backend/buildables.EnabledFeatures=autologin"' />

## Build with Docker

If you want buildables in a container image, build your own image and pass the build tag + enabled feature list. Here’s a minimal example that uses the official image as the runtime base:

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
> Official images are standard builds. If you need buildables, you’ll want a custom image like the one above.

## Selecting features

`EnabledFeatures` is a comma-separated list. Feature names are case-insensitive and trimmed.

Example:

- `autologin`
- `feature-a,feature-b,feature-c`

## Runtime checks

Use `buildables.HasBuildFeature("feature")` to gate execution paths and route registration.

## Configuration

Buildable-specific config fields live in `BuildablesConfig` and are only present when buildables are enabled. For example, the `autologin` feature uses:

- `AUTO_LOGIN_USERNAME`
- `AUTO_LOGIN_PASSWORD`

## Available buildables

> [!NOTE]
> **Official** buildables are maintained by the Arcane team. **Community** buildables are built and supported by the community.

<BuildablesTable />

## Adding a new buildable feature

1. Guard feature entry points using `//go:build buildables` where appropriate.
2. Gate behavior with `buildables.HasBuildFeature("your-feature")`.
3. Add any buildable-only config to `BuildablesConfig`.
4. Ensure tests that use the feature build with the `buildables` tag.
