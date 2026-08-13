---
title: API Reference
description: How to use the Arcane API
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import { Snippet } from '#lib/components/ui/snippet/index.js';
</script>

Arcane provides a REST API that allows you to programmatically manage your Docker resources. The API documentation is built into Arcane and available directly from your instance.

## Accessing the API Documentation

The full API reference is available within your Arcane instance:

1. Navigate to your Arcane instance (e.g., `https://arcane.example.com`)
2. Go to **Settings** → **API Keys** → **API Reference**
3. Browse the interactive documentation

The interactive reference lives at `/api/docs`, and the raw OpenAPI 3.1 document it renders is served at `/api/openapi.json`. Point any OpenAPI-aware tool — a client generator, Postman, Insomnia — at that URL.

### Exporting the specification

The Arcane binary can write the specification out without a running server:

<Snippet text="arcane openapi -o openapi.yaml" class="mt-2" />

- `--format`, `-f` — `yaml` (default) or `json`.
- `--output`, `-o` — write to a file instead of stdout.
- `--downgrade`, `-d` — emit OpenAPI 3.0.3 for tools that can't parse 3.1.

## Generating an API Key

To use the API, you'll need to create an API key:

1. Navigate to **Settings** → **API Keys** in your Arcane instance
2. Click **Add API Key**
3. Enter a **Name** for the new API Key
4. Select an **Expires At** date (leave blank for no expiration)
5. Enter a **Description** for the new API Key
6. Click **Create API Key**

> [!IMPORTANT]
> Make sure you copy the API Key from the dialog window — it will not be shown again!

## Static Admin API Key

If you manage Arcane declaratively, you can provide a fixed admin API key at startup with `ADMIN_STATIC_API_KEY`.

Arcane will reconcile that key for the built-in admin user automatically:

- create it when it does not exist yet
- rotate it when the configured value changes
- remove it when the setting is removed

Static keys are protected in the UI so they cannot be edited or deleted accidentally. They still work like normal API keys when you send them in the `X-Api-Key` header.

## Using the API

> [!TIP]
> You can use the API using the official <Link href="/docs/cli/install">arcane-cli</Link> client.

All API endpoints require authentication using the `X-Api-Key` header:

```bash
curl -X GET "https://arcane.example.com/api/environments/0/projects" \
  -H "X-Api-Key: your-api-key-here"
```

> [!NOTE]
> Replace `arcane.example.com` with your actual Arcane instance URL and `your-api-key-here` with your generated API key.

## Streaming operations

Long-running operations — project deploy, redeploy, pull, and build, plus image pull and build — respond with a stream of newline-delimited JSON objects rather than a single response body. Each line is one of:

- `{"activityId": "..."}` — sent first, identifying the activity you can follow in the UI.
- `{"log": "..."}` — a line of raw Docker output.
- `{"done": true}` — the operation finished successfully.
- `{"error": "..."}` — the operation failed.

Treat `{"done": true}` as the completion signal instead of waiting for the connection to close; behind a reverse proxy the socket may stay open well past the end of the work.

## Chunked uploads

Large-file endpoints — image import, volume backup upload, and build workspace upload — accept files through resumable upload sessions instead of one giant multipart request:

1. `POST /api/environments/{id}/uploads/{kind}` with the filename and size to create a session (`kind` is `image`, `volume-backup`, or `build-workspace`). The response includes the `uploadId` and chunk size.
2. `PUT /api/environments/{id}/uploads/{kind}/{uploadId}/chunks/{index}` with each chunk as `application/octet-stream`. Chunks can be re-sent safely, and `GET` on the session reports which chunks have been received if you need to resume.
3. Call the consuming endpoint with `{"uploadId": "..."}` — for example `POST /api/environments/{id}/images/upload`.

Chunks default to 10 MB (configurable per session from 1 to 50 MB), so requests stay under common reverse-proxy body-size limits — you no longer need to raise `client_max_body_size` (or its equivalent) to import a large image tar. Sessions that sit idle for 24 hours are discarded.

Sending `multipart/form-data` directly to the consuming endpoints still works but is deprecated. The web UI and `arcane-cli` already use chunked sessions.

## Inbound Webhooks

Arcane also supports inbound webhooks for simple external triggers.

Use a webhook when an external system, such as GitHub Actions or another CI job, needs to tell Arcane to do something without maintaining a logged-in session.

Current webhook targets include:

- a single container update
- a project redeploy
- an environment-wide updater run
- a Git Sync run

Webhook trigger requests use a tokenized public endpoint:

```bash
curl -X POST "https://arcane.example.com/api/webhooks/trigger/arc_wh_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

A valid trigger responds immediately with `202 Accepted` and `{"success": true, "data": {"status": "accepted"}}` — the deploy, sync, or update then runs in the background, and its outcome (success or failure) is recorded in the Event Log rather than the HTTP response. CI jobs no longer sit on an open connection waiting for the action to finish.

Important details:

- the token in the URL is the credential
- webhook tokens are shown once when created
- Arcane stores only a hashed form of the token at rest
- disabled webhooks return `403`
- unknown or invalid tokens return `404`

Create and manage webhooks in **Settings → Webhooks**.
