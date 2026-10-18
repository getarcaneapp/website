---
title: 'Podman Overview'
description: 'What Arcane manages on Podman hosts, what each feature needs, and who can use it.'
---

When an environment runs Podman, Arcane adds a **Podman** section to the sidebar alongside the usual container, image, volume, and network pages. Those regular pages work the same as on Docker, because Arcane talks to Podman through its Docker-compatible API. The Podman section covers what that API doesn't have:

- [Pods](/docs/podman/pods)
- [Quadlets](/docs/podman/quadlets)
- [Kubernetes YAML](/docs/podman/kube)
- [Podman secrets](/docs/podman/secrets)
- [Podman auto-update](/docs/podman/auto-update)

To set up Arcane on a Podman host, see [Run Arcane on Podman](/docs/podman/setup).

## Version requirements

Arcane detects Podman automatically and only shows what the host supports.

| Feature                               | Needs                                         |
| ------------------------------------- | --------------------------------------------- |
| Pods, Kube, Secrets                   | Any supported Podman version                  |
| Quadlets                              | Podman 5.8 or later                           |
| Filtering Quadlets by pod or status   | Podman 6.0 or later                           |
| Grouping Quadlets into an application | Podman 6.1 or later                           |
| Auto-update with per-container report | Podman 6.2 or later                           |
| Auto-update on older versions         | Access to systemd (see below)                 |
| Starting and stopping Quadlet units   | Podman 5.8 or later and access to systemd     |

## Access to systemd

Quadlets run as systemd services, so starting, stopping, and restarting them goes through systemd rather than the Podman API. The same applies to auto-update on Podman versions before 6.2. Arcane reaches systemd over D-Bus:

- **Rootful Podman** uses the system bus at `/run/dbus/system_bus_socket`. Mount it into the Arcane container and run Arcane as root (`PUID=0`, `PGID=0`) so it's allowed to manage system services.
- **Rootless Podman** uses the user's session bus at `/run/user/<UID>/bus`. Mount it, set `DBUS_SESSION_BUS_ADDRESS`, and run Arcane as that user. [Run Arcane on Podman](/docs/podman/setup#give-arcane-access-to-systemd) has the full settings.

If the bus isn't reachable, everything else still works. The Quadlet start, stop, and restart buttons are disabled, and the Quadlet and Auto Update pages show why.

When `DOCKER_HOST` points to a Podman engine on another machine (`tcp://` or `ssh://`), Arcane doesn't use its own local bus, because that would control services on the wrong host. Set `DBUS_SYSTEM_BUS_ADDRESS` or `DBUS_SESSION_BUS_ADDRESS` to that machine's bus if you want systemd actions there. For most remote hosts it's simpler to run an [Arcane Agent](/docs/remote/environments) on the Podman machine itself.

## All environments

With several environments shown at once, the **Pods** and **Quadlets** lists combine every Podman environment and add an **Environment** column. Docker environments are skipped. **Kube**, **Secrets**, and **Auto Update** act on the selected environment and only appear when it runs Podman.

## Permissions

Podman actions have their own permissions, scoped per environment. See [Roles](/docs/access/roles#permission-catalog).

| Permission                  | Allows                                        |
| --------------------------- | --------------------------------------------- |
| `podman:read`               | View pods, Quadlets, secrets, and Podman info |
| `podman:pods`               | Create, start, stop, delete, and prune pods   |
| `podman:quadlets`           | Install, edit, and delete Quadlets            |
| `podman:quadlets:lifecycle` | Start, stop, and restart Quadlet units        |
| `podman:kube`               | Play, tear down, and generate Kubernetes YAML |
| `podman:secrets`            | Create, replace, and delete Podman secrets    |
| `podman:autoupdate`         | Run Podman auto-update                        |

The Kube, Auto Update, and Install quadlet pages also need `podman:read`.

## CLI

Everything in this section is also available from `arcane-cli podman`. See [CLI Commands](/docs/reference/cli/commands#podman).
