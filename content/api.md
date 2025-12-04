---
title: API Reference
description: How to use the Arcane API
---

> [!WARNING]
> This feature is slated to be released in `v1.11.0`

Arcane provides a REST API that allows you to programmatically manage your Docker resources. The API documentation is built into Arcane and available directly from your instance.

## Accessing the API Documentation

The full API reference is available within your Arcane instance:

1. Navigate to your Arcane instance (e.g., `https://arcane.example.com`)
2. Go to **Settings** → **API Keys** → **API Reference**
3. Browse the interactive documentation

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

## Using the API

All API endpoints require authentication using the `X-Api-Key` header:

```bash
curl -X GET "https://arcane.example.com/api/environments/0/projects" \
  -H "X-Api-Key: your-api-key-here"
```

> [!NOTE]
> Replace `arcane.example.com` with your actual Arcane instance URL and `your-api-key-here` with your generated API key.