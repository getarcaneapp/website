---
title: 'Pods'
description: 'Create and manage Podman pods in Arcane.'
---

A pod is a group of containers that share network, IPC, and UTS namespaces, the same idea as a Kubernetes pod. Open **Podman → Pods** to see each pod's state, its containers, and when it was created.

## Create a pod

1. Click **Create pod**.
2. Choose the environment if more than one Podman environment is shown.
3. Enter a name. Everything else is optional.
4. Fill in the sections you need:
   - **Networking**: network mode, networks with aliases, static IPs and MAC addresses, published ports, and options for `pasta` or `slirp4netns`.
   - **DNS & hosts**: DNS servers, search domains, DNS options, and extra `/etc/hosts` entries.
   - **Resources**: CPUs, CPU shares, CPU sets, memory and swap limits, block I/O weight, and per-device read and write limits.
   - **Storage & devices**: bind mounts, named volumes, volumes from other containers, shared memory size, devices, and GPUs.
   - **Namespaces & security**: which namespaces the pod shares, the PID, IPC, UTS, and user namespace modes, UID and GID maps, security options, and sysctls.
   - **Lifecycle**: the pod's exit policy and restart policy.
   - **Infra container**: the image, command, and name of the container that holds the pod's namespaces, or no infra container at all.
5. Click **Create**.

Volume sources must be an absolute host path or a named volume. Relative paths such as `./data` are rejected because Arcane can't know which directory they're relative to. Device limits take a `MAJOR:MINOR` device number, for example `8:0`.

A few `podman pod create` flags have no API equivalent and aren't available: `--pod-id-file`, `--replace`, `--subuidname`, and `--subgidname`.

## Manage pods

From the row menu or the pod's page you can **Start**, **Stop**, **Restart**, and **Delete** a pod. Deleting a running pod needs **Force**. **Prune pods** removes every stopped pod in the shown environments.

The pod page shows the pod's settings, its containers (the infra container is marked), live resource usage, and the processes running in it. If Arcane loses contact with the host, the page says so and keeps showing the last state it loaded.
