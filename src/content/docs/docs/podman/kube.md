---
title: 'Kubernetes YAML'
description: 'Play, tear down, and generate Kubernetes YAML with Podman.'
---

**Podman → Kube** runs Kubernetes YAML with `podman kube play`, tears it down, and generates YAML from what's running.

- **Play** creates the YAML's pods, containers, and volumes. Turn off **Start** to create them stopped, turn on **Replace** to recreate existing pods, and list networks to attach. If some containers fail to start, Arcane lists the errors and reports the run as failed. **Down** removes those pods after confirmation, optionally with the YAML's volumes.
- **Generate** produces YAML from pods, containers, or volumes by name. Pick the kind (`pod`, `service`, `deployment`, `daemonset`, or `job`) and optionally add a Kubernetes service.
