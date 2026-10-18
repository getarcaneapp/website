---
title: 'Quadlets'
description: 'Install Quadlet files and control their systemd units from Arcane.'
---

A Quadlet is a unit file, such as `web.container`, that Podman turns into a systemd service. Open **Podman → Quadlets** to see the installed Quadlets, their systemd unit names, and whether they're active.

## Install a Quadlet

1. Click **Install quadlet**.
2. Enter the file name with its extension. Supported types are `.container`, `.pod`, `.kube`, `.network`, `.volume`, `.image`, `.build`, and `.artifact`.
3. Paste the file contents.
4. Add any extra files the Quadlet needs, such as a Kubernetes YAML for a `.kube` Quadlet or an environment file.
5. On Podman 6.1 or later, optionally enter an **Application** name to group related Quadlets.
6. Click **Install**.

Podman writes the files and reloads systemd, so the unit is ready to start. Arcane doesn't start it for you.

## Manage Quadlets

The Quadlet page shows the file, the systemd unit status, and the containers it runs, with their logs. From there you can:

- **Start**, **Stop**, or **Restart** the unit. Template units (names ending in `@`) have no running instance, so these actions aren't offered for them.
- **Edit** the file. Arcane replaces it and Podman reloads systemd. Restart the unit to apply the change.
- **Delete** the Quadlet. This stops the unit and removes its files. If Podman can't remove something, the error is shown and the Quadlet stays installed.

## Containers that belong to a Quadlet

Containers started by a Quadlet carry a **Quadlet** badge on the containers list and the container page, linking to the Quadlet. Because systemd owns them:

- **Start**, **Stop**, and **Restart** on the container are sent to its systemd unit, so the unit and the container stay in sync.
- **Edit**, **Redeploy**, and **Delete** are refused. Change the Quadlet file instead.
- Arcane's [auto updates](/docs/docker/auto-updates) skip them. Use [Podman auto-update](/docs/podman/auto-update) for these containers.

On Podman versions before 5.8, Arcane can't confirm which Quadlet a container belongs to. Start and stop go through the Podman API, and edit, redeploy, and delete stay blocked.
