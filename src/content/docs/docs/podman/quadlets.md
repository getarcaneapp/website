---
title: 'Quadlets'
description: 'Install Quadlet files and control their systemd units from Arcane.'
---

A Quadlet is a unit file, such as `web.container`, that Podman turns into a systemd service. **Podman → Quadlets** shows installed Quadlets, their unit names, and whether they're active.

## Install a Quadlet

1. Click **Install quadlet**.
2. Enter the file name with its extension: `.container`, `.pod`, `.kube`, `.network`, `.volume`, `.image`, `.build`, or `.artifact`.
3. Paste the contents, and add any extra files it needs, such as a `.kube` Quadlet's YAML or an environment file.
4. On Podman 6.1 or later, optionally enter an **Application** name to group related Quadlets.
5. Click **Install**. Podman writes the files and reloads systemd; Arcane doesn't start the unit for you.

## Manage Quadlets

The Quadlet page shows the file, unit status, and its containers with logs. From there you can:

- **Start**, **Stop**, or **Restart** the unit. Not offered for template units (names ending in `@`), which have no running instance.
- **Edit** the file. Podman reloads systemd; restart the unit to apply the change.
- **Delete** the Quadlet, stopping the unit and removing its files. If Podman can't remove something, the error is shown and the Quadlet stays.

## Containers that belong to a Quadlet

Quadlet containers carry a **Quadlet** badge on the containers list and container page, linking to the Quadlet. Because systemd owns them:

- **Start**, **Stop**, and **Restart** go to the systemd unit, keeping unit and container in sync.
- **Edit**, **Redeploy**, and **Delete** are refused. Change the Quadlet file instead.
- Arcane's [auto updates](/docs/docker/auto-updates) skip them. Use [Podman auto-update](/docs/podman/auto-update).

Before Podman 5.8, Arcane can't confirm a container's Quadlet. Start and stop go through the Podman API, and edit, redeploy, and delete stay blocked.
