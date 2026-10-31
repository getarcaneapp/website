---
title: 'OpenTelemetry'
description: 'Send Arcane metrics, traces, and logs to an OpenTelemetry collector.'
---

Export Arcane's metrics, traces, and logs with OpenTelemetry using the standard `OTEL_*` environment variables. Every exporter is off until you turn it on.

You need an OpenTelemetry Collector (or any OTLP backend) and somewhere to store the data. The examples use Prometheus for metrics, Tempo for traces, and Loki for logs.

## Enable export

Set these variables on the Arcane container. Leave out any signal you don't want; the endpoint alone sends nothing.

```yaml
environment:
  - OTEL_METRICS_EXPORTER=otlp
  - OTEL_TRACES_EXPORTER=otlp
  - OTEL_LOGS_EXPORTER=otlp
  - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
```

Arcane sends OTLP over HTTP/protobuf to port `4318`. To use gRPC instead, set `OTEL_EXPORTER_OTLP_PROTOCOL=grpc` and point the endpoint at port `4317`. If your collector needs authentication, set `OTEL_EXPORTER_OTLP_HEADERS`, for example `authorization=Bearer <token>`.

Set the same variables on agents to collect their data. Each installation reports its own instance ID, and `arcane.mode` (`manager` or `edge`) tells them apart.

## Run a collector

This Compose file runs Arcane next to an OpenTelemetry Collector. Prometheus must be started with `--web.enable-otlp-receiver` to accept OTLP metrics.

```yaml
services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    environment:
      - OTEL_METRICS_EXPORTER=otlp
      - OTEL_TRACES_EXPORTER=otlp
      - OTEL_LOGS_EXPORTER=otlp
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
    # ...the rest of your Arcane service

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: ['--config=/etc/otelcol/config.yaml']
    volumes:
      - ./collector.yaml:/etc/otelcol/config.yaml:ro
```

`collector.yaml` receives OTLP and forwards each signal to its backend:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 256
  batch: {}

exporters:
  otlphttp/prometheus:
    endpoint: http://prometheus:9090/api/v1/otlp
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true
  otlphttp/loki:
    endpoint: http://loki:3100/otlp

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlphttp/prometheus]
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/tempo]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlphttp/loki]
```

## Scrape with Prometheus instead

For metrics only, skip the collector and let Prometheus scrape Arcane. Web UI metrics are only sent over OTLP, so browser panels stay empty when you scrape.

```yaml
environment:
  - OTEL_METRICS_EXPORTER=prometheus
  - OTEL_EXPORTER_PROMETHEUS_HOST=0.0.0.0
```

Arcane then serves metrics at `http://<arcane>:9464/metrics` (change the port with `OTEL_EXPORTER_PROMETHEUS_PORT`). Add a scrape job named `arcane` so the dashboard finds them:

```yaml
scrape_configs:
  - job_name: arcane
    static_configs:
      - targets: ['arcane:9464']
```

## Import the dashboard

In Grafana, go to **Dashboards → New → Import**, enter dashboard ID `25894`, and pick your Prometheus, Tempo, and Loki data sources. It's also on [grafana.com](https://grafana.com/grafana/dashboards/25894). It expects metric names with Prometheus suffixes, such as `http_server_request_duration_seconds`, which Prometheus's OTLP receiver produces by default.

## What Arcane sends

- **Metrics:** API request rates and latency, containers, images, volumes, networks, and projects, per-container CPU, memory, network, and disk usage, image updates, vulnerability counts, job runs, edge agents, GitOps syncs, backups, notifications, Go runtime, and database connections.
- **Traces:** API requests, Docker and Compose calls, database queries, agent calls, jobs, GitOps syncs, backups, image patches, vulnerability scans, and registry calls.
- **Logs:** everything Arcane logs at the configured `ARCANE_LOG_LEVEL`. Logs still go to stdout too.

Database spans contain SQL without values. Authenticated API spans include the user's ID and username. URLs omit query strings; request bodies and credentials are never recorded.

The manager's web UI reports as `arcane-frontend`: page loads and API calls as traces, navigation times and Web Vitals as metrics, JavaScript errors as logs. Each is sent only when that signal uses OTLP over HTTP, via Arcane at `/api/telemetry/*`, so the browser needn't reach your collector. Behind a reverse proxy, set [`ARCANE_TRUSTED_PROXIES`](/docs/networking/reverse-proxy#trust-the-proxy-with-arcane_trusted_proxies) so Arcane rate-limits this per browser instead of per proxy.

## Other settings

| Variable                                         | Use                                                           |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` (and `_TRACES_`, `_LOGS_`) | Send one signal to a different endpoint.            |
| `OTEL_TRACES_SAMPLER`, `OTEL_TRACES_SAMPLER_ARG` | Keep only some traces, for example `parentbased_traceidratio` with `0.25`. |
| `OTEL_RESOURCE_ATTRIBUTES`                       | Add attributes such as `deployment.environment=prod`.         |
| `OTEL_SDK_DISABLED`                              | Set to `true` to turn off all telemetry.                      |

## Profiling

Administrators can download Go profiles from Arcane at `/api/debug/pprof/`, for example `/api/debug/pprof/profile?seconds=30` or `/api/debug/pprof/heap`. Open them with `go tool pprof`.
