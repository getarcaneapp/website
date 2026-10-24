---
title: 'Podman Auto-Update'
description: 'Run Podman auto-update for containers that opt in.'
---

Podman has its own auto-update for containers labelled `io.containers.autoupdate`, usually set with `AutoUpdate=registry` in a Quadlet. **Podman → Auto Update** lists each Podman environment with how it can run auto-update, and runs it on all of them at once. How it runs depends on each host's Podman version:

- **Podman 6.2 or later**: Arcane calls the Podman API and shows a report for each container, with the image, the policy, and whether it was updated. **Dry run** checks for updates without applying them. **Roll back failed updates** returns a container to its previous image if the new one doesn't start. Updated containers trigger the same update notifications as Arcane's own updater.
- **Older versions with systemd access**: Arcane starts `podman-auto-update.service` and shows the unit's result. There's no per-container report and no dry run, and the options above aren't available.
- **Neither**: the page explains what's missing.

Environments that can't run it are skipped. If a run finishes with errors, Arcane lists them with the environment they came from.

Podman's own `podman-auto-update.timer` keeps running on its schedule whether or not you use this page.
