---
title: 'Podman Overview'
description: 'What Arcane manages on Podman hosts, what each feature needs, and who can use it.'
---

On Podman environments, Arcane adds a **Podman** sidebar section for what the Docker-compatible API lacks: [Pods](/docs/podman/pods), [Quadlets](/docs/podman/quadlets), [Kubernetes YAML](/docs/podman/kube), [Podman secrets](/docs/podman/secrets), and [Podman auto-update](/docs/podman/auto-update). Container, image, volume, and network pages work as on Docker. To set up, see [Run Arcane on Podman](/docs/podman/setup).

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

Starting, stopping, and restarting Quadlets, and auto-update before Podman 6.2, go through systemd. Arcane reaches it over D-Bus:

- **Rootful Podman** uses the system bus at `/run/dbus/system_bus_socket`. Mount it into the Arcane container and run Arcane as root (`PUID=0`, `PGID=0`) so it's allowed to manage system services.
- **Rootless Podman** uses the user's session bus at `/run/user/<UID>/bus`. Mount it, set `DBUS_SESSION_BUS_ADDRESS`, and run Arcane as that user. [Run Arcane on Podman](/docs/podman/setup#give-arcane-access-to-systemd) has the full settings.

Without the bus, everything else works; Quadlet start, stop, and restart are disabled, and the Quadlet and Auto Update pages show why.

When `DOCKER_HOST` points to a Podman engine on another machine (`tcp://` or `ssh://`), Arcane ignores its local bus, which would control the wrong host. For systemd actions there, set `DBUS_SYSTEM_BUS_ADDRESS` or `DBUS_SESSION_BUS_ADDRESS` to that machine's bus. Usually it's simpler to run an [Arcane Agent](/docs/remote/environments) on the Podman machine.

## Multiple environments

Podman pages appear when at least one environment runs Podman, and cover every Podman environment you can read. **Pods**, **Quadlets**, and **Secrets** combine them with an **Environment** column; **Auto Update** runs on all at once. **Kube** works on one host, so pick its **Environment** first.

## Permissions

Podman permissions are scoped per environment. See [Roles](/docs/access/roles#permission-catalog).

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

Everything here is also in `arcane-cli podman`. See [CLI Commands](/docs/reference/cli/commands#podman).
