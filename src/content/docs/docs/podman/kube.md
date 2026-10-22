---
title: 'Kubernetes YAML'
description: 'Play, tear down, and generate Kubernetes YAML with Podman.'
---

**Podman → Kube** runs Kubernetes YAML with `podman kube play`. Kube works on one host, so pick its **Environment** first.

## Play YAML

1. Open **Podman → Kube** and add your YAML.
2. Optional: turn off **Start** to create everything stopped.
3. Optional: turn on **Replace** to recreate existing pods.
4. Optional: list networks to attach.
5. Run **Play**.

Arcane creates the YAML's pods, containers, and volumes. If some containers fail to start, Arcane lists the errors and reports the run as failed.

## Tear it down

Run **Down** and confirm. It removes the YAML's pods, and optionally its volumes.

## Generate YAML

1. Choose **Generate**.
2. Enter pods, containers, or volumes by name.
3. Pick the kind: `pod`, `service`, `deployment`, `daemonset`, or `job`.
4. Optional: add a Kubernetes service.
