---
title: "Podman Auto-Update"
description: "Run Podman auto-update for containers that opt in."
---

This runs Podman's own auto-update on every Podman agent at once. It covers containers labelled `io.containers.autoupdate`, usually set with `AutoUpdate=registry` in a Quadlet.

## Run auto-update

1. Open **Podman → Auto Update**.
2. Optional (Podman 6.2 or later): turn on **Dry run** to check without applying, or **Roll back failed updates** to restore the previous image if the new one doesn't start.
3. Run it.
4. Check the results. Errors are listed with the agent they came from.

Podman's `podman-auto-update.timer` keeps running on its schedule either way.

## What each Podman version supports

| Host                       | What happens                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Podman 6.2 or later        | Arcane calls the Podman API and reports each container's image, policy, and whether it updated. Updates trigger the same notifications as Arcane's own updater. |
| Older, with systemd access | Arcane starts `podman-auto-update.service` and shows the unit's result. No per-container report, dry run, or rollback option.                                   |
| Neither                    | The page explains what's missing, and the agent is skipped.                                                                                                     |

See [Access to systemd](/docs/podman/overview#access-to-systemd).
