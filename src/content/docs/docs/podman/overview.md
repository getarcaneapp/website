---
title: "Podman Overview"
description: "What Arcane manages on Podman hosts, what each feature needs, and who can use it."
---

On Podman agents, Arcane adds a **Podman** section to the sidebar for features the Docker-compatible API doesn't cover: [Pods](/docs/podman/pods), [Quadlets](/docs/podman/quadlets), [Kubernetes YAML](/docs/podman/kube), [Podman secrets](/docs/podman/secrets), and [Podman auto-update](/docs/podman/auto-update). Container, image, volume, and network pages work just like they do on Docker. To get started, see [Run Arcane on Podman](/docs/podman/setup).

## Version requirements

Arcane detects Podman automatically and only shows what the host supports.

| Feature                               | Needs                                     |
| ------------------------------------- | ----------------------------------------- |
| Pods, Kube, Secrets                   | Any supported Podman version              |
| Quadlets                              | Podman 5.8 or later                       |
| Grouping Quadlets into an application | Podman 6.1 or later                       |
| Auto-update with per-container report | Podman 6.2 or later                       |
| Auto-update on older versions         | Access to systemd (see below)             |
| Starting and stopping Quadlet units   | Podman 5.8 or later and access to systemd |

## Access to systemd

Starting, stopping, and restarting Quadlets (as well as auto-update before Podman 6.2) goes through systemd. Arcane reaches it over D-Bus:

- **Rootful Podman** uses the system bus at `/run/dbus/system_bus_socket`. Mount it into the Arcane container and run Arcane as root (`PUID=0`, `PGID=0`) so it's allowed to manage system services.
- **Rootless Podman** uses the user's session bus at `/run/user/<UID>/bus`. Mount it, set `DBUS_SESSION_BUS_ADDRESS`, and run Arcane as that user. [Run Arcane on Podman](/docs/podman/setup#give-arcane-access-to-systemd) has the full settings.

Without D-Bus access, everything else still works, but Quadlet start, stop, and restart are disabled (the Quadlet and Auto Update pages will explain why).

When `DOCKER_HOST` points to a Podman engine on another machine (`tcp://` or `ssh://`), Arcane ignores its local bus, which would control the wrong host. For systemd actions there, set `DBUS_SYSTEM_BUS_ADDRESS` or `DBUS_SESSION_BUS_ADDRESS` to that machine's bus. Usually it's simpler to run an [Arcane Agent](/docs/remote/agents) on the Podman machine.

## Multiple agents

The Podman pages show up as soon as at least one agent is running Podman, and they cover every Podman agent you have read access to. **Pods**, **Quadlets**, and **Secrets** combine them into one list with an **Agent** column, while **Auto Update** runs across all of them at once. **Kube** targets a single host, so you'll pick an **Agent** first.

## Permissions

Podman permissions are scoped per agent. See [Roles](/docs/access/roles#permission-catalog).

| Permission                                              | Allows                                        |
| ------------------------------------------------------- | --------------------------------------------- |
| `podman:read`                                           | View Podman info                              |
| `podman-pods:list`, `podman-pods:read`                  | View pods                                     |
| `podman-pods:create`, `delete`, `prune`                 | Create, delete, and prune pods                |
| `podman-pods:start`, `stop`, `restart`, `pause`, `kill` | Run pod lifecycle actions                     |
| `podman-quadlets:list`, `podman-quadlets:read`          | View Quadlets                                 |
| `podman-quadlets:create`, `update`, `delete`            | Install, edit, and delete Quadlets            |
| `podman-quadlets:start`, `stop`, `restart`              | Start, stop, and restart Quadlet units        |
| `podman-kube:read`, `create`, `delete`                  | Generate, play, and tear down Kubernetes YAML |
| `podman-secrets:list`, `podman-secrets:read`            | View Podman secrets                           |
| `podman-secrets:create`, `update`, `delete`             | Create, replace, and delete Podman secrets    |
| `podman:autoupdate`                                     | Run Podman auto-update                        |

The Kube, Auto Update, and Install quadlet pages also need `podman:read`.

## CLI

Everything here is also in `arcane-cli podman`. See [CLI Commands](/docs/reference/cli/commands#podman).
