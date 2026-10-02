---
title: 'GPU Monitoring'
description: 'Show NVIDIA or AMD GPU memory usage on the Arcane dashboard.'
---

GPU monitoring adds a **GPU Usage** meter to the Dashboard so you can see how much GPU memory a host is using. It supports NVIDIA and AMD GPUs and is off by default.

> [!IMPORTANT]
> Install the GPU drivers on the host first, following your GPU vendor's instructions. Official Arcane images don't bundle vendor GPU tools: NVIDIA monitoring relies on the NVIDIA container runtime injecting `nvidia-smi`, and AMD monitoring reads `/sys/class/drm` directly.

## Turn on GPU monitoring

1. Add the lines for your vendor below to the Arcane service in your `compose.yaml`.
2. Recreate the container.
3. Open the Dashboard and check the environment card for the **GPU Usage** meter.

For a remote environment, make the same changes on the agent container running on the GPU host.

### NVIDIA

Expose the GPUs to the container through the NVIDIA container runtime:

```yaml
services:
  arcane:
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - GPU_MONITORING_ENABLED=true
      - GPU_TYPE=nvidia
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

### AMD

Pass the DRM devices into the container:

```yaml
services:
  arcane:
    environment:
      - GPU_MONITORING_ENABLED=true
      - GPU_TYPE=amd
    devices:
      - /dev/dri:/dev/dri
```

## Check that it works

The meter shows the average memory use across detected GPUs, with the number of devices below it. When Arcane first collects stats, its logs show `NVIDIA GPU detected`, `AMD GPU detected`, or `Using configured GPU type`.

If the meter doesn't appear, look for these errors in the logs:

| Log message                                          | Cause                                                                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `nvidia-smi not found but GPU_TYPE set to nvidia`    | The NVIDIA container runtime isn't injecting `nvidia-smi`. Check the NVIDIA Container Toolkit on the host. |
| `AMD GPU not found in sysfs but GPU_TYPE set to amd` | No AMD card with VRAM information was found under `/sys/class/drm`.                                        |
| `no supported GPU found`                             | Auto-detection found no GPU tool or AMD card.                                                              |

Intel GPUs aren't supported yet. Arcane can detect one when `intel_gpu_top` is available in the container, but it doesn't read Intel memory stats, so no meter appears.

## Reference

| Variable                 | Default | Description                                                                                                         |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `GPU_MONITORING_ENABLED` | `false` | Collect GPU stats.                                                                                                  |
| `GPU_TYPE`               | `auto`  | `nvidia`, `amd`, `intel`, or `auto`. `auto` tries NVIDIA, then AMD, then Intel. Unknown values fall back to `auto`. |
