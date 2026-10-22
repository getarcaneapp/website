---
title: "GPU Monitoring"
description: "Show NVIDIA or AMD GPU memory usage on the Arcane dashboard."
---

GPU monitoring adds a **GPU Usage** meter to the Dashboard for NVIDIA and AMD GPUs. It's off by default.

## Turn on GPU monitoring

1. Install the GPU drivers on the host, following your GPU vendor's instructions.
2. Add the lines for your vendor ([NVIDIA](#nvidia) or [AMD](#amd)) to the Arcane service in `compose.yaml`. For a remote agent, change the agent container on the GPU host instead.
3. Recreate the container.
4. Check the Dashboard agent card for the **GPU Usage** meter.

Official Arcane images don't bundle vendor GPU tools. NVIDIA monitoring relies on the NVIDIA container runtime injecting `nvidia-smi`. AMD monitoring reads `/sys/class/drm` directly.

### NVIDIA

```yaml
services:
  arcane:
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - ARCANE_GPU_MONITORING_ENABLED=true
      - ARCANE_GPU_TYPE=nvidia
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

### AMD

```yaml
services:
  arcane:
    environment:
      - ARCANE_GPU_MONITORING_ENABLED=true
      - ARCANE_GPU_TYPE=amd
    devices:
      - /dev/dri:/dev/dri
```

## Check that it works

The meter shows average memory use across detected GPUs, with the device count below. On first collection, the logs show `NVIDIA GPU detected`, `AMD GPU detected`, or `Using configured GPU type`. If the meter doesn't appear, look for these errors:

| Log message                                          | Cause                                                                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `nvidia-smi not found but GPU_TYPE set to nvidia`    | The NVIDIA container runtime isn't injecting `nvidia-smi`. Check the NVIDIA Container Toolkit on the host. |
| `AMD GPU not found in sysfs but GPU_TYPE set to amd` | No AMD card with VRAM information was found under `/sys/class/drm`.                                        |
| `no supported GPU found`                             | Auto-detection found no GPU tool or AMD card.                                                              |

## Reference

| Variable                        | Default | Description                                                                                                                                                                                                                          |
| ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ARCANE_GPU_MONITORING_ENABLED` | `false` | Collect GPU stats.                                                                                                                                                                                                                   |
| `ARCANE_GPU_TYPE`               | `auto`  | `nvidia`, `amd`, `intel`, or `auto`. `auto` tries NVIDIA, then AMD, then Intel. Unknown values fall back to `auto`. Intel isn't supported yet: Arcane detects it via `intel_gpu_top` but reads no memory stats, so no meter appears. |
