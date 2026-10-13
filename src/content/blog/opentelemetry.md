---
title: 'OpenTelemetry in Arcane 2.16.0'
description: 'Arcane 2.16.0 can export metrics, traces, and logs to any OpenTelemetry collector.'
date: 2026-10-10
kind: update
featured: true
banner: 'Arcane 2.16.0 adds OpenTelemetry metrics, traces, and logs.'
---

Arcane 2.16.0 can export metrics, traces, and logs with [OpenTelemetry](https://opentelemetry.io), so you can send them to a collector and view them alongside the rest of your monitoring.

It is off by default. Turn it on with the standard `OTEL_*` environment variables:

```yaml
environment:
  - OTEL_METRICS_EXPORTER=otlp
  - OTEL_TRACES_EXPORTER=otlp
  - OTEL_LOGS_EXPORTER=otlp
  - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
```

## What gets sent

Metrics include container counts and states, CPU and memory for each container, API latency, background jobs, image updates, and vulnerability counts.

Traces follow a request through Arcane, down to the Docker calls and database queries it makes. If your agents send to the same backend, a request the manager passes to an agent stays in one trace.

Logs are the same lines Arcane already prints to stdout, now with the trace ID attached so you can jump from a log line to its trace.

The web UI sends its own page load times, Web Vitals, and JavaScript errors. It posts them to Arcane, and Arcane forwards them to your collector, so you don't have to expose the collector to browsers.

Query strings, SQL parameter values, request bodies, and credentials are left out.

## Dashboard

There is an official Grafana dashboard covering everything Arcane sends. Import dashboard ID [`25894`](https://grafana.com/grafana/dashboards/25894) and pick your Prometheus, Tempo, and Loki data sources.

## Getting started

The [OpenTelemetry guide](/docs/settings/opentelemetry) has a full collector config, the Prometheus scrape option, and the other settings you can use.
