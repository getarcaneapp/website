---
title: 'Podman Auto-Update'
description: 'Run Podman auto-update for containers that opt in.'
---

**Podman → Auto Update** runs Podman's own auto-update on every Podman environment at once. It covers containers labelled `io.containers.autoupdate`, usually set with `AutoUpdate=registry` in a Quadlet. How it runs depends on each host's Podman version:

- **Podman 6.2 or later**: Arcane calls the Podman API and reports each container's image, policy, and whether it updated. **Dry run** checks without applying. **Roll back failed updates** restores the previous image if the new one doesn't start. Updates trigger the same notifications as Arcane's own updater.
- **Older versions with systemd access**: Arcane starts `podman-auto-update.service` and shows the unit's result. No per-container report, dry run, or the options above.
- **Neither**: the page explains what's missing, and the environment is skipped.

Errors are listed with the environment they came from. Podman's `podman-auto-update.timer` keeps running on its schedule regardless.
