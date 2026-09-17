---
title: 'Template Registries'
description: 'Create a template registry to share Compose templates with your team or the community.'
---

A template registry is a hosted JSON file listing templates and their download URLs.

## Quick Setup

### 1. Create the registry file

Create `registry.json`. Include `$schema` for editor validation:

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
			"tags": ["internal", "webapp", "postgres"]
		}
	]
}
```

### 2. Host your files

Upload `registry.json` and your template directories to GitHub or an HTTPS web server. Download URLs must point directly to accessible files, not repository pages. Use raw GitHub URLs for downloads and enable CORS on custom-domain hosting.

### 3. Template file structure

For each template, create a directory with:

```text
docker-templates/
└── your-template/
  ├── docker-compose.yml
  ├── .env.example
  └── README.md
```

## Registry JSON Reference

The registry must match the Arcane Templates Registry Schema:

- Schema ID: `https://github.com/getarcaneapp/arcane-templates/schema.json`
- JSON Schema Draft: 07
- No extra fields are allowed beyond the ones listed below

### Top-level fields

- Optional:
  - `$schema`: URL to the registry schema (recommended for tooling)
- Required:
  - `name`: Registry display name (string)
  - `description`: Brief description (string)
  - `version`: Registry version (semver)
  - `author`: Registry maintainer (string)
  - `url`: Repository or homepage URL (URI)
  - `templates`: Array of template objects (min 1)

### Template object fields

- Required:
  - `id`: Unique slug (lowercase, hyphens only)
  - `name`: Display name (string)
  - `description`: Detailed description (string)
  - `version`: Template version (semver)
  - `author`: Template author (string)
  - `compose_url`: Direct URL to docker-compose.yml (URI)
  - `env_url`: Direct URL to .env.example (URI)
  - `documentation_url`: URL to template docs/README (URI)
  - `tags`: Array of slugs (lowercase, hyphens; min 1; unique)
- Additional properties are not allowed

## Example Repository Structure

```
docker-templates/
├── registry.json
├── wordpress/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
├── nextcloud/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
└── nginx-proxy/
    ├── docker-compose.yml
    └── README.md
```

<span id="troubleshooting"></span>

## Testing Your Registry

1. Check JSON syntax and validate the registry against the Draft 07 schema at `https://github.com/getarcaneapp/arcane-templates/schema.json`. Remove fields not allowed by the schema.
2. Open each file URL to check that it downloads the expected file.
3. Add the registry in **Customization → Templates → Add Registry**.
4. Check that templates appear and download correctly.

## Best Practices

- Pin image versions, include health checks and restart policies, and test before publishing.
- Document required environment variables using working examples without secrets.
- Use semantic versioning and review image security updates when maintaining templates.

## GitHub Example

For a repository named `my-docker-templates`, add the registry to Arcane using its raw URL:

`https://raw.githubusercontent.com/username/my-docker-templates/main/registry.json`

## Community registry

Submit templates through a pull request to [getarcaneapp/templates](https://github.com/getarcaneapp/templates).
