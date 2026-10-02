---
title: Contributing to Arcane
description: Set up the Arcane development environment and submit a pull request.
---

<script lang="ts">
  import { GitCommand } from '#lib/components/ui/git-command/index.js';
  import { Snippet } from '#lib/components/ui/snippet/index.js';
  import { Link } from '#lib/components/ui/link/index.js';
</script>

This page covers running Arcane locally for development and getting a change merged. The dev environment runs the frontend and backend in Docker with hot reload.

> [!IMPORTANT]
> Using AI tools? Read the <Link href="https://github.com/getarcaneapp/arcane/blob/main/AI_POLICY.md">AI Usage Policy</Link> before contributing. For project conventions, see <Link href="https://github.com/getarcaneapp/arcane/blob/main/AGENTS.md">AGENTS.md</Link>.

## Ways to contribute

- **Report bugs** using the <Link href="https://github.com/getarcaneapp/arcane/issues/new?template=bug.yml">issue template</Link>.
- **Suggest features** in <Link href="https://github.com/getarcaneapp/arcane/discussions/new?category=feature-requests">Discussions</Link>. Proposals and voting happen there; maintainers open linked implementation issues when work is ready.
- **Ask development questions** in <Link href="https://github.com/getarcaneapp/arcane/discussions">Discussions</Link>.
- **Contribute code** (frontend, backend, DevOps), documentation, or testing.
- **Translate** via Crowdin. See <Link href="/docs/development/translate">Translating Arcane</Link>.

## Set up the development environment

You need:

- **Docker and Docker Compose**
- **<Link href="https://viteplus.dev">Vite+</Link>** for the Node toolchain, formatting, linting, and pre-commit hooks when working outside Docker:

<Snippet text="curl -fsSL https://vite.plus | bash" class="mt-2 mb-4 w-full" />

Run every command from the project root (`arcane/`) unless stated otherwise.

1. Fork and clone the repository, then enter it:

<GitCommand class="mt-2 mb-2 w-full" />
<Snippet text="cd arcane" class="mt-2 mb-4 w-full" />

2. Check Docker and the Compose config:

```bash
docker info
docker compose version
docker compose -f docker/compose.dev.yaml -p arcane-dev config
```

3. Start the development environment:

<Snippet text="./scripts/development/dev.sh start" class="mt-2 mb-4 w-full" />

This starts the frontend and backend with hot reload, installs dependencies inside Docker, and creates persistent storage for development data.

4. Confirm the stack is up:

```bash
./scripts/development/dev.sh status
curl -f http://localhost:3000
curl -f http://localhost:3552/api/health
```

- **Frontend**: <Link href="http://localhost:3000">http://localhost:3000</Link> (SvelteKit with HMR)
- **Backend**: <Link href="http://localhost:3552">http://localhost:3552</Link> (Go with Air hot reload)

5. Enable the pre-commit hooks once, so format checks run on staged files:

<Snippet text="vp hooks enable" class="mt-2 mb-4 w-full" />

### Use VS Code (optional)

Open the project root folder (`arcane/`) and install the recommended Docker, Go, and Svelte/TypeScript extensions. Use `Ctrl/Cmd+Shift+P` → **Tasks: Run Task** for Start, Stop, Restart, Rebuild, Logs, and Open Frontend. `Ctrl/Cmd+Shift+B` starts the environment. The **Clean** task removes the development containers and volumes, including their data.

## Make a change

1. Create a branch:

   ```bash
   git switch -c feat/project-labels
   git switch -c fix/issue-123
   ```

2. Edit code. Vite reloads the frontend and Air rebuilds and restarts the backend. Watch logs with `./scripts/development/dev.sh logs`, or `logs frontend` / `logs backend` for one service.

3. Run the checks before you commit:

```bash
vp fmt --check
vp check
docker compose -f docker/compose.dev.yaml exec backend go fmt ./...
docker compose -f docker/compose.dev.yaml exec backend go vet ./...
```

Frontend formatting and lint rules live in the root `vite.config.ts`. The backend also runs Go fmt and Go vet as part of Air hot reload.

4. Commit using **Conventional Commits**. Types are `feat`, `fix`, `docs`, `style`, `refactor`, `test`, and `chore`:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve Docker volume mounting issue"
```

## Open a pull request

1. Keep it focused: one feature or fix per PR.
2. Test that both frontend and backend work.
3. Update the documentation if you change APIs or add features.
4. Link issues with `Closes #123` or `Fixes #456`.
5. Respond to review feedback.

Before you submit, check that:

- [ ] The code builds in the development environment
- [ ] Hot reload works for frontend and backend
- [ ] There are no lint errors
- [ ] Commit messages follow the conventional format
- [ ] The PR description explains the change and why it's needed

## Reference

### Dev script

```bash
./scripts/development/dev.sh start
./scripts/development/dev.sh status
./scripts/development/dev.sh stop
./scripts/development/dev.sh restart
./scripts/development/dev.sh rebuild
./scripts/development/dev.sh logs [frontend|backend]
./scripts/development/dev.sh shell frontend
./scripts/development/dev.sh shell backend
```

Use `restart` after config changes and `rebuild` after dependency changes.

### Justfile

`just --list` shows every target. Common ones:

| Task                             | Command                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Start the Docker dev environment | `just dev docker`                                                                       |
| Follow logs                      | `just dev logs`                                                                         |
| Build the frontend or backend    | `just build single frontend`, `just build single backend`                               |
| Run tests                        | `just test all`, `just test backend`                                                    |
| Lint and format                  | `just lint frontend`, `just lint js`, `just format frontend`, `just format all --check` |
| Install dependencies             | `just deps install all`                                                                 |

### Checks inside the Docker dev environment

```bash
docker compose -f docker/compose.dev.yaml exec frontend pnpm check
docker compose -f docker/compose.dev.yaml exec frontend pnpm format
```
