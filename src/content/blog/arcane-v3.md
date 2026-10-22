---
title: 'Arcane 3.0 is here'
description: 'A faster Arcane with a customizable dashboard, live upgrades, one agent, and activity across every environment.'
date: 2026-10-30
kind: release
featured: true
banner: 'Arcane 3.0 is out. See what changed.'
---

Arcane 3.0 is out. It's faster, the dashboard is yours to arrange, and a lot of old code is gone.

This is a major release with breaking changes. Read the [v3 migration guide](/docs/get-started/migrate-v3) before you upgrade.

## Faster everywhere

Startup, first page load, list pages, and SQLite queries are all quicker. API key checks use less memory, and image vulnerabilities are paginated in the database instead of loaded all at once.

## A dashboard you can arrange

The dashboard is now made of widgets. Move them around on a free-form grid and Arcane saves your layout. The environments table also shows memory usage and how much space you can reclaim on each host.

## Live upgrades

Upgrades now stream their progress and logs as they happen, for one environment or all of them. You can choose how many agents upgrade at once when you hit **Update all**.

## One agent

The polling agent is gone. Edge agents are now just the **Arcane agent**, and they reconnect faster after a dropped connection.

## Activity across all environments

The redesigned activity center pulls activity from every environment into one place.

## Smaller things worth knowing

- Release notes show up next to image updates.
- List views have a grid layout option.
- Container status shows health icons, and stat rings show memory used.
- Environment colors come from a swatch picker, with custom colors.
- You can pick where toasts appear in your account settings.

## Breaking changes

- Config environment variables now start with `ARCANE_`.
- Notification settings are global to the manager, not per environment.
- Deprecated CLI flags and old container image tags are removed.

The [migration guide](/docs/get-started/migrate-v3) covers each one.
