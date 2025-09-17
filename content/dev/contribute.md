---
title: Contributing to Arcane
description: Thanks for helping make Arcane better! A streamlined guide with Docker-based dev, VS Code tasks, and clear contribution steps.
blueprint: default
---

<script lang="ts">
  import { GitCommand } from '$lib/components/ui/git-command';
  import { Snippet } from '$lib/components/ui/snippet/index.js';
  import { Link } from '$lib/components/ui/link/index.js';
</script>

Thanks for helping make Arcane better! We've built a modern, streamlined development experience that gets you up and running in minutes.

## 🌟 Ways to Contribute

- 🐛 <strong>Report bugs</strong> using our issue templates
- 💡 <strong>Suggest features</strong> or improvements
- 🔧 <strong>Code contributions</strong> (frontend, backend, DevOps)
- 📚 <strong>Documentation</strong> improvements
- 🌍 <strong>Translations</strong> via <Link href="https://crowdin.com/project/arcane-docker-management">Crowdin</Link>
- 🧪 <strong>Testing</strong> and quality assurance

## 🚀 Quick Start

### Prerequisites

- <strong>Docker & Docker Compose</strong> (that's it! 🎉)
- <strong>VS Code</strong> based IDE (recommended for the best developer experience)

> 💡 <strong>Working Directory</strong>: Unless otherwise specified, all commands in this guide should be run from the project root directory (<code>arcane/</code>).

### 1. Fork and Clone

<GitCommand class="mt-2 mb-2 w-full" />
<Snippet text="cd arcane" class="mt-2 mb-4 w-full" />

### 2. Start Development Environment

From the project root directory:

<Snippet text="./scripts/development/dev.sh start" class="mt-2 mb-4 w-full" />

That's it! The development environment will automatically:
- 🔥 Start both frontend and backend with hot reload
- 🐳 Handle all dependencies via Docker
- 📊 Set up health checks and monitoring
- 💾 Create persistent storage for your development data

Access your development environment:
- <strong>Frontend</strong>: <Link href="http://localhost:3000">http:\/\/localhost:3000</Link> (SvelteKit with HMR)
- <strong>Backend</strong>: <Link href="http://localhost:3552">http:\/\/localhost:3552</Link> (Go with Air hot reload)

## 🎯 VS Code Integration

For the best development experience, we've included VS Code tasks and workspace configuration.

### Recommended Extensions

When you open the project in VS Code, you'll be prompted to install our recommended extensions. These provide:
- Docker integration and management
- Go language support with debugging
- Svelte/TypeScript support
- Integrated terminal management

### One-Click Development Commands

Use <code>Ctrl/Cmd+Shift+P</code> → "Tasks: Run Task" to access:

| Task | Description |
|------|-------------|
| <strong>Start</strong> | Start the development environment |
| <strong>Stop</strong> | Stop all services |
| <strong>Restart</strong> | Restart all services |
| <strong>Rebuild</strong> | Rebuild containers (after dependency changes) |
| <strong>Clean</strong> | Remove all containers and volumes |
| <strong>Logs</strong> | Interactive log viewer with service selection |
| <strong>Open Frontend</strong> | Launch frontend in browser |

### Quick Build Shortcut

Press <code>Ctrl/Cmd+Shift+B</code> to run the default build task (Start Environment).

## 🔍 Development Workflow

### Making Changes

1. <strong>Create a feature branch</strong>:
```bash
git switch -c feat/my-awesome-feature
# or
git switch -c fix/issue-123
```

2. <strong>Start development</strong> (from project root):
```bash
./scripts/development/dev.sh start
# or use VS Code Task: "Start"
```

3. <strong>Monitor logs</strong> (choose your preferred method):
```bash
# Interactive selector
./scripts/development/dev.sh logs

# Specific service
./scripts/development/dev.sh logs frontend
./scripts/development/dev.sh logs backend

# Or use VS Code Task: "Logs"
```

4. <strong>Make your changes</strong> - hot reload will automatically update:
- <strong>Frontend</strong>: Instant HMR via Vite
- <strong>Backend</strong>: Auto-rebuild and restart via Air

## 🛠️ Development Commands

Note: All commands should be run from the project root directory (<code>arcane/</code>).

### Environment Management
```bash
# Start development environment
./scripts/development/dev.sh start

# View service status
./scripts/development/dev.sh status

# Stop all services
./scripts/development/dev.sh stop

# Restart services (for config changes)
./scripts/development/dev.sh restart

# Rebuild containers (for dependency changes)
./scripts/development/dev.sh rebuild

# Clean up everything (nuclear option)
./scripts/development/dev.sh clean
```

### Debugging & Logs
```bash
# Interactive log selection
./scripts/development/dev.sh logs

# All services
./scripts/development/dev.sh logs

# Frontend only (Vite/SvelteKit)
./scripts/development/dev.sh logs frontend

# Backend only (Go/Air)
./scripts/development/dev.sh logs backend

# Shell access
./scripts/development/dev.sh shell frontend
./scripts/development/dev.sh shell backend
```

## 🎨 Code Quality

### Manual Commands

If you need to run checks manually:

```bash
# Frontend checks
docker compose -f docker-compose.dev.yml exec frontend pnpm check
docker compose -f docker-compose.dev.yml exec frontend pnpm format
```

```bash
# Backend checks
docker compose -f docker-compose.dev.yml exec backend go fmt ./...
docker compose -f docker-compose.dev.yml exec backend go vet ./...
```


## 📝 Commit Guidelines

We use <strong>Conventional Commits</strong> for clear, semantic commit messages:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve Docker volume mounting issue"
git commit -m "docs: update development setup guide"
git commit -m "refactor: simplify API response handling"
```

<strong>Types</strong>: <code>feat</code>, <code>fix</code>, <code>docs</code>, <code>style</code>, <code>refactor</code>, <code>test</code>, <code>chore</code>

## 🔄 Pull Request Process

1. <strong>Keep changes focused</strong> - One feature/fix per PR
2. <strong>Test your changes</strong> - Ensure both frontend and backend work
3. <strong>Update documentation</strong> - If you change APIs or add features
4. <strong>Link issues</strong> - Reference issues with "Closes #123" or "Fixes #456"
5. <strong>Be responsive</strong> - Address review feedback promptly

### PR Checklist

- [ ] Code builds successfully in development environment
- [ ] Frontend hot reload works correctly
- [ ] Backend hot reload works correctly
- [ ] No linting errors
- [ ] Commit messages follow conventional format
- [ ] PR description explains the change and why it's needed

## 🐛 Troubleshooting

### Common Issues

<strong>Port conflicts:</strong>
```bash
# Stop and clean everything (from project root)
./scripts/development/dev.sh clean

# Check for conflicting processes
lsof -i :3000  # Frontend port
lsof -i :3552  # Backend port
```

<strong>Docker issues:</strong>
```bash
# Reset Docker environment (from project root)
./scripts/development/dev.sh clean
docker system prune -f

# Restart development
./scripts/development/dev.sh start
```

<strong>VS Code tasks not working:</strong>
- Ensure you've opened the project root folder (<code>arcane/</code>) in VS Code, not a subfolder or parent directory
- Install recommended extensions when prompted
- Restart VS Code if tasks don't appear
- Verify you're in the correct working directory when running terminal commands

### Need Help?

- <strong>Bug Report</strong>: <Link href="https://github.com/ofkm/arcane/issues/new?template=bug.yml">Create an issue</Link>
- <strong>Feature Request</strong>: <Link href="https://github.com/ofkm/arcane/issues/new?template=feature.yml">Suggest a feature</Link>
- <strong>Development Question</strong>: Open a discussion in the repository

Thank you for contributing to Arcane! Your help makes this project better for everyone. 🚀
