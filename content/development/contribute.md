---
title: Contributing to Arcane
description: How to set up the Arcane development environment and submit contributions.
---

<script lang="ts">
  import { GitCommand } from '#lib/components/ui/git-command/index.js';
  import { Snippet } from '#lib/components/ui/snippet/index.js';
  import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!IMPORTANT]
> Using AI tools? Read the <Link href="https://github.com/getarcaneapp/arcane/blob/main/AI_POLICY.md">AI Usage Policy</Link> before contributing. For project conventions, see <Link href="https://github.com/getarcaneapp/arcane/blob/main/AGENTS.md">AGENTS.md</Link>.

<span id="need-help"></span>

## Ways to Contribute

- **Report bugs** using our <Link href="https://github.com/getarcaneapp/arcane/issues/new?template=bug.yml">issue template</Link>
- **Suggest features** in <Link href="https://github.com/getarcaneapp/arcane/discussions/new?category=feature-requests">Discussions</Link>. Proposals and voting belong there. Maintainers can create linked implementation issues when work is ready.
- **Development questions**: <Link href="https://github.com/getarcaneapp/arcane/discussions">open a discussion</Link>
- **Code contributions** (frontend, backend, DevOps)
- **Documentation** improvements
- **Translations** via <Link href="https://crowdin.com/project/arcane-docker-management">Crowdin</Link> — see <Link href="/docs/development/translate">Translating Arcane</Link>
- **Testing** and quality assurance

<span id="quick-start"></span>

## Setup

<span id="prerequisites"></span>

Prerequisites:

- **Docker & Docker Compose**
- **<Link href="https://viteplus.dev">Vite+</Link>** manages the Node toolchain, formatting, linting, and pre-commit hooks when working outside Docker.
- <span id="vs-code-integration"></span><span id="recommended-extensions"></span>**VS Code** is optional. Open the project root folder (`arcane/`) and install the recommended Docker, Go, and Svelte/TypeScript extensions.

<Snippet text="curl -fsSL https://vite.plus | bash" class="mt-2 mb-4 w-full" />

<span id="one-click-development-commands"></span>
<span id="quick-build-shortcut"></span>

In VS Code, use `Ctrl/Cmd+Shift+P` → "Tasks: Run Task" for Start, Stop, Restart, Rebuild, Logs, and Open Frontend. `Ctrl/Cmd+Shift+B` starts the environment. The **Clean** task removes development containers and volumes, including their stored data.

Unless otherwise specified, run every command from the project root (`arcane/`).

<span id="1-fork-and-clone"></span>

1. Fork and clone, then enter the project:

<GitCommand class="mt-2 mb-2 w-full" />
<Snippet text="cd arcane" class="mt-2 mb-4 w-full" />

<span id="troubleshooting"></span>
<span id="development-startup-checklist"></span>
<span id="common-issues"></span>

2. Verify Docker and the compose config before starting:

```bash
docker info
docker compose version
docker compose -f docker/compose.dev.yaml -p arcane-dev config
```

<span id="2-start-development-environment"></span>

3. Start the development environment:

<Snippet text="./scripts/development/dev.sh start" class="mt-2 mb-4 w-full" />

This starts frontend and backend with hot reload, handles dependencies via Docker, sets up health checks, and creates persistent storage for development data.

4. Confirm the stack is up:

```bash
./scripts/development/dev.sh status
curl -f http://localhost:3000
curl -f http://localhost:3552/api/health
```

- **Frontend**: <Link href="http://localhost:3000">http://localhost:3000</Link> (SvelteKit with HMR)
- **Backend**: <Link href="http://localhost:3552">http://localhost:3552</Link> (Go with Air hot reload)

<span id="development-workflow"></span>
<span id="making-changes"></span>

## Workflow

1. Create a branch:

   ```bash
   git switch -c feat/my-awesome-feature
   # or
   git switch -c fix/issue-123
   ```

2. Make changes — hot reload updates the frontend via Vite and rebuilds/restarts the backend via Air. Watch logs with `./scripts/development/dev.sh logs`, or target a service with `logs frontend` / `logs backend`.

<span id="development-commands"></span>

## Command Reference

<span id="justfile-shortcuts"></span>

`just --list` shows every Justfile category and target.

```bash
# Development
just dev docker
just dev logs

# Build
just build single frontend
just build single backend

# Tests
just test all
just test backend

# Quality checks
just lint frontend
just format frontend
just format all --check

# Dependencies
just deps install all
```

<span id="environment-management"></span>
<span id="debugging--logs"></span>

```bash
# Environment management
./scripts/development/dev.sh start
./scripts/development/dev.sh status
./scripts/development/dev.sh stop
./scripts/development/dev.sh restart   # for config changes
./scripts/development/dev.sh rebuild   # for dependency changes

# Logs and shell access
./scripts/development/dev.sh logs
./scripts/development/dev.sh logs frontend
./scripts/development/dev.sh logs backend
./scripts/development/dev.sh shell frontend
./scripts/development/dev.sh shell backend
```

## Code Quality

<span id="automatic-formatting--linting"></span>

- **Frontend / TypeScript**: <Link href="https://viteplus.dev">Vite+</Link> (`vp fmt`, `vp check`) plus Svelte/TypeScript checks. Formatting and lint rules live in the root `vite.config.ts`.
- **Backend**: Go fmt + Go vet (built into Air hot reload).

<span id="pre-commit-hooks"></span>

Format checks run automatically on staged files via the Vite+ git hook dispatcher. Enable it once after cloning:

<Snippet text="vp hooks enable" class="mt-2 mb-4 w-full" />

<span id="manual-commands"></span>

Manual checks:

```bash
# JS/TS formatting and lint (Vite+, run from project root)
vp fmt --check
vp check

# Or via the Justfile
just format all --check
just lint js

# Inside the Docker dev environment
docker compose -f docker/compose.dev.yaml exec frontend pnpm check
docker compose -f docker/compose.dev.yaml exec frontend pnpm format

# Backend checks
docker compose -f docker/compose.dev.yaml exec backend go fmt ./...
docker compose -f docker/compose.dev.yaml exec backend go vet ./...
```

## Commit Guidelines

We use **Conventional Commits**:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve Docker volume mounting issue"
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Process

1. **Keep changes focused** — one feature or fix per PR
2. **Test your changes** — ensure both frontend and backend work
3. **Update documentation** — if you change APIs or add features
4. **Link issues** — reference issues with `Closes #123` or `Fixes #456`
5. **Be responsive** — address review feedback promptly

### PR Checklist

- [ ] Code builds successfully in the development environment
- [ ] Hot reload works correctly for frontend and backend
- [ ] No linting errors
- [ ] Commit messages follow conventional format
- [ ] PR description explains the change and why it's needed
