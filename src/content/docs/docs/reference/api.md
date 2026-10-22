---
title: 'API Reference'
description: 'Use the Arcane REST API, API keys, and inbound webhooks.'
---

Use Arcane's REST API to manage your Docker resources from scripts and tools. Its documentation is built into every Arcane instance.

## Accessing the API Documentation

In your Arcane instance (e.g., `https://arcane.example.com`), go to **Settings** → **API Keys** → **API Reference** to browse the interactive documentation.

It lives at `/api/docs`, and the raw OpenAPI 3.1 document is served at `/api/openapi.json`. Point any OpenAPI-aware tool (a client generator, Postman, Insomnia) at that URL.

### Exporting the specification

The Arcane binary can write the specification without a running server:

```bash
arcane openapi -o openapi.yaml
```

- `--format`, `-f` — `yaml` (default) or `json`.
- `--output`, `-o` — write to a file instead of stdout.
- `--downgrade`, `-d` — emit OpenAPI 3.0.3 for tools that can't parse 3.1.

## Generating an API Key

1. Go to **Settings** → **API Keys** and click **Add API Key**.
2. Enter a **Name** and **Description**, and pick an **Expires At** date (blank for no expiration).
3. Click **Create API Key**.

> [!IMPORTANT]
> Copy the API Key from the dialog. It will not be shown again!

## Static Admin API Key

To manage Arcane declaratively, set a fixed admin API key at startup with `ARCANE_ADMIN_STATIC_API_KEY`. Arcane reconciles it for the built-in admin user: it creates the key if missing, rotates it when the value changes, and removes it when the setting is removed.

Static keys are protected in the UI so they can't be edited or deleted by accident. They work like normal keys in the `X-Api-Key` header.

## Using the API

> [!TIP]
> You can also use the official [arcane-cli](/docs/reference/cli/install) client.

Every endpoint requires the `X-Api-Key` header:

```bash
curl -X GET "https://arcane.example.com/api/environments/0/projects" \
  -H "X-Api-Key: your-api-key-here"
```

> [!NOTE]
> Replace `arcane.example.com` with your Arcane instance URL and `your-api-key-here` with your API key.

## Streaming operations

Project deploy, redeploy, pull, and build, plus image pull and build, stream newline-delimited JSON objects instead of one response body. Each line is one of:

- `{"activityId": "..."}` — sent first; the activity you can follow in the UI.
- `{"log": "..."}` — a line of raw Docker output.
- `{"done": true}` — the operation finished successfully.
- `{"error": "..."}` — the operation failed.

Treat `{"done": true}` as completion; don't wait for the connection to close. Behind a reverse proxy the socket may stay open well past the end of the work.

## Chunked uploads

Image import, volume backup upload, and build workspace upload take files through resumable upload sessions:

1. `POST /api/environments/{id}/uploads/{kind}` with the filename and size to create a session (`kind` is `image`, `volume-backup`, or `build-workspace`). The response includes the `uploadId` and chunk size.
2. `PUT /api/environments/{id}/uploads/{kind}/{uploadId}/chunks/{index}` with each chunk as `application/octet-stream`. Re-sending chunks is safe; `GET` on the session lists received chunks so you can resume.
3. Call the consuming endpoint with `{"uploadId": "..."}`, for example `POST /api/environments/{id}/images/upload`.

Chunks default to 10 MB (configurable per session from 1 to 50 MB), so requests stay under common reverse-proxy body-size limits. You don't need to raise `client_max_body_size` (or equivalent) to import a large image tar. Sessions idle for 24 hours are discarded.

Sending `multipart/form-data` directly to the consuming endpoints still works but is deprecated. The web UI and `arcane-cli` use chunked sessions.

## Inbound Webhooks

Use a webhook when an external system, such as GitHub Actions or another CI job, needs to trigger Arcane without a logged-in session. Targets: a single container update, a project redeploy, an environment-wide updater run, or a Git Sync run.

Trigger it with a POST to its tokenized public endpoint:

```bash
curl -X POST "https://arcane.example.com/api/webhooks/trigger/arc_wh_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

A valid trigger returns `202 Accepted` and `{"success": true, "data": {"status": "accepted"}}` right away, so CI jobs don't wait on an open connection. The deploy, sync, or update runs in the background; its outcome is recorded in the Event Log, not the HTTP response.

- The token in the URL is the credential. It's shown once at creation, and Arcane stores only a hash.
- Disabled webhooks return `403`; unknown or invalid tokens return `404`.

Create and manage webhooks in **System → Webhooks**. The list shows webhooks from every environment, and **Environment** sets where a new webhook runs.
