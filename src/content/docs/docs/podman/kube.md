---
title: "Kubernetes YAML"
description: "Play, tear down, and generate Kubernetes YAML with Podman."
---

**Podman → Kube** runs Kubernetes YAML with `podman kube play`. Kube works on one host, so pick its **Agent** first.

## Play YAML

1. Open **Podman → Kube** and add your YAML.
2. Optionally turn off **Start** to create everything stopped, turn on **Replace** to recreate existing pods, or list networks to attach.
3. Click **Play**.

Arcane creates the YAML's pods, containers, and volumes. If some containers fail to start, Arcane lists the errors and reports the run as failed.

## Tear it down

Click **Down** and confirm to remove the pods created from the YAML, and optionally their volumes too.

## Generate YAML

1. Choose **Generate**.
2. Enter pods, containers, or volumes by name.
3. Pick the kind: `pod`, `service`, `deployment`, `daemonset`, or `job`.
4. Optionally add a Kubernetes service.
