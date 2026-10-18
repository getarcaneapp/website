---
title: 'Kubernetes YAML'
description: 'Play, tear down, and generate Kubernetes YAML with Podman.'
---

**Podman → Kube** runs Kubernetes YAML with `podman kube play`, tears it down again, and generates YAML from what's already running.

- **Play** creates the pods, containers, and volumes described in the YAML. Turn off **Start** to create them stopped, turn on **Replace** to recreate pods that already exist, and list networks to attach the pods to. If some containers fail to start, Arcane lists the errors under the result and reports the run as failed.
- **Down** removes the pods created from the same YAML. Arcane asks for confirmation first, and you can choose to remove the YAML's volumes as well.
- **Generate** produces YAML from pods, containers, or volumes by name. Pick the kind to generate (`pod`, `service`, `deployment`, `daemonset`, or `job`), and optionally add a Kubernetes service.
