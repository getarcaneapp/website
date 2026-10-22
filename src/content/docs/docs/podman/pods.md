---
title: 'Pods'
description: 'Create and manage Podman pods in Arcane.'
---

A pod is a group of containers sharing network, IPC, and UTS namespaces, like a Kubernetes pod. **Podman → Pods** shows each pod's state, containers, and creation time.

## Create a pod

1. Click **Create pod**, choose the environment if several are shown, and enter a name. Everything else is optional.
2. Fill in the sections you need:
   - **Networking**: network mode, networks with aliases, static IPs and MAC addresses, published ports, and options for `pasta` or `slirp4netns`.
   - **DNS & hosts**: DNS servers, search domains, DNS options, and extra `/etc/hosts` entries.
   - **Resources**: CPUs, CPU shares, CPU sets, memory and swap limits, block I/O weight, and per-device read and write limits.
   - **Storage & devices**: bind mounts, named volumes, volumes from other containers, shared memory size, devices, and GPUs.
   - **Namespaces & security**: which namespaces the pod shares, the PID, IPC, UTS, and user namespace modes, UID and GID maps, security options, and sysctls.
   - **Lifecycle**: the pod's exit policy and restart policy.
   - **Infra container**: the image, command, and name of the container that holds the pod's namespaces, or no infra container at all.
3. Click **Create**.

Volume sources must be an absolute host path or a named volume; relative paths such as `./data` are rejected. Device limits take a `MAJOR:MINOR` device number, for example `8:0`. These `podman pod create` flags have no API equivalent: `--pod-id-file`, `--replace`, `--subuidname`, and `--subgidname`.

## Manage pods

**Start**, **Stop**, **Restart**, and **Delete** pods from the row menu or pod page. Deleting a running pod needs **Force**. **Prune pods** removes every stopped pod in the shown environments.

The pod page shows settings, containers (infra container marked), live resource usage, and processes. If Arcane loses contact with the host, it says so and keeps the last loaded state.
