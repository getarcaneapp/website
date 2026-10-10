---
title: 'Template Registries'
description: 'Publish a registry of Compose templates for your team or the community.'
---

A template registry is a hosted `registry.json` file that lists Compose [templates](/docs/docker/templates) and their download URLs. Create one to share templates with your team. For container image registries, see [private registries](/docs/docker/images#private-registries).

## Create a registry

### 1. Lay out the files

Give each template its own directory next to `registry.json`:

```text
docker-templates/
├── registry.json
├── wordpress/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
└── nextcloud/
    ├── docker-compose.yml
    ├── .env.example
    └── README.md
```

### 2. Write the registry file

Include `$schema` so editors can validate the file:

```json
{
	"$schema": "https://github.com/getarcaneapp/arcane-templates/schema.json",
	"name": "My Company Templates",
	"description": "Docker templates for internal applications",
	"version": "1.0.0",
	"author": "Your Team",
	"url": "https://github.com/yourcompany/docker-templates",
	"templates": [
		{
			"id": "internal-app",
			"name": "Internal Application",
			"description": "Company application stack with database",
			"version": "1.0.0",
			"author": "DevOps Team",
			"compose_url": "https://raw.githubusercontent.com/yourcompany/docker-templates/main/internal-app/docker-compose.yml",
			"env_url": "https://raw.githubusercontent.com/yourcompany/docker-templates/main/internal-app/.env.example",
			"documentation_url": "https://github.com/yourcompany/docker-templates/tree/main/internal-app",
			"icon_url": "https://raw.githubusercontent.com/yourcompany/docker-templates/main/internal-app/icon.svg",
			"tags": ["internal", "webapp", "postgres"]
		}
	]
}
```

### 3. Host the files

Upload the files to GitHub or an HTTPS server. Download URLs must point directly to files, not repository pages: on GitHub use raw URLs, and on a custom domain enable CORS. For a repository named `my-docker-templates`, the registry URL is:

```text
https://raw.githubusercontent.com/username/my-docker-templates/main/registry.json
```

### 4. Test the registry

1. Validate `registry.json` against the schema.
2. Open each file URL and check that it downloads.
3. Add the registry in **Customization → Templates → Add Registry** and check that the templates appear.

## Write templates others can rely on

- Pin image versions, include health checks and restart policies, and test before publishing.
- Document required variables in `.env.example` with working, non-secret values.
- Use semantic versioning and keep images patched.

To submit a template to the community registry, open a pull request to [getarcaneapp/templates](https://github.com/getarcaneapp/templates).

## Reference

The registry must match the schema at `https://github.com/getarcaneapp/arcane-templates/schema.json` (JSON Schema Draft 07). Other fields are rejected.

### Registry fields

| Field         | Required | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `$schema`     | No       | URL of the registry schema, for editor validation. |
| `name`        | Yes      | Registry display name.                             |
| `description` | Yes      | Short description.                                 |
| `version`     | Yes      | Registry version (semver).                         |
| `author`      | Yes      | Registry maintainer.                               |
| `url`         | Yes      | Repository or homepage URL.                        |
| `templates`   | Yes      | Array of template objects, at least one.           |

### Template fields

All template fields are required except `icon_url`.

| Field               | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `id`                | Unique slug (lowercase, hyphens only).                    |
| `name`              | Display name.                                             |
| `description`       | Detailed description.                                     |
| `version`           | Template version (semver).                                |
| `author`            | Template author.                                          |
| `compose_url`       | Direct URL to the Compose file.                           |
| `env_url`           | Direct URL to the `.env.example` file.                    |
| `documentation_url` | URL to the template's docs or README.                     |
| `icon_url`          | Direct URL to the template's icon.                        |
| `tags`              | Array of unique slugs (lowercase, hyphens), at least one. |

Arcane shows `icon_url` for remote templates and doesn't read icons from their Compose files. After you **Download** a template, an `x-arcane` icon in its Compose file takes precedence.
