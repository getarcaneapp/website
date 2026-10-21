---
title: 'Podman Auto-Update'
description: 'Run Podman auto-update for containers that opt in.'
---

Podman has its own auto-update for containers labelled `io.containers.autoupdate`, usually set with `AutoUpdate=registry` in a Quadlet. **Podman → Auto Update** runs it on demand. How it runs depends on the Podman version:

- **Podman 6.2 or later**: Arcane calls the Podman API and shows a report for each container, with the image, the policy, and whether it was updated. **Dry run** checks for updates without applying them. **Roll back failed updates** returns a container to its previous image if the new one doesn't start. Updated containers trigger the same update notifications as Arcane's own updater.
- **Older versions with systemd access**: Arcane starts `podman-auto-update.service` and shows the unit's result. There's no per-container report and no dry run, and the options above aren't available.
- **Neither**: the page explains what's missing.

If the run finishes with errors, Arcane reports it as failed and lists the errors.

Podman's own `podman-auto-update.timer` keeps running on its schedule whether or not you use this page.
