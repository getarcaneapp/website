---
title: 'Template Registries'
description: 'Want to share templates with your team or the community? Create your own template registry!'
---

<script lang="ts">
import TemplateStructure from '$lib/components/template-structure.svelte';
import RegistryJson from '$lib/components/registry-json.svelte';
</script>

A template registry is simply a JSON file hosted online that describes available templates and where to find them.

## Quick Setup

### 1. Create Registry Structure

Create a JSON manifest file that lists your templates (include the `$schema` field pointing to the Arcane schema for editor validation):

<RegistryJson />

### 2. Host Your Files

- **Option A: GitHub (Recommended)**
  1. Create a GitHub repository
  2. Add your `registry.json` file
  3. Add template directories with `docker-compose.yml` files
  4. Use raw GitHub URLs for file access

- **Option B: Web Server**
  - Host `registry.json` on any web server
  - Ensure HTTPS access
  - Enable CORS if needed

### 3. Template File Structure

For each template, create a directory with:

<TemplateStructure />

## Registry JSON Reference

The registry must conform to the Arcane Templates Registry Schema:
- Schema ID: `https://github.com/getarcaneapp/arcane-templates/schema.json`
- JSON Schema Draft: 07
- No additional properties are allowed beyond those listed below

### Top-level Fields

- Optional:
  - `$schema`: URL to the registry schema (recommended for tooling)
- Required:
  - `name`: Registry display name (string)
  - `description`: Brief description (string)
  - `version`: Registry version (semver)
  - `author`: Registry maintainer (string)
  - `url`: Repository or homepage URL (URI)
  - `templates`: Array of template objects (min 1)

### Template Object Fields

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

## Testing Your Registry

1. Validate JSON syntax and schema (Draft 07) against `https://github.com/getarcaneapp/arcane-templates/schema.json`
2. Test URLs: ensure all file URLs are accessible (HTTPS)
3. Add to Arcane: Settings → Templates → Add Registry
4. Verify: templates appear and download correctly
5. Ensure no extra properties exist beyond the schema

## Best Practices

### Template Quality

- Use specific image tags (not `latest`)
- Include health checks
- Add restart policies
- Document required environment variables
- Test templates before publishing

### Registry Management

- Version your templates and registry (semantic versioning)
- Keep documentation current
- Regular updates and maintenance
- Monitor for security updates

### Security

- Use HTTPS for all URLs
- Validate environment variable examples
- Don't include sensitive data in examples
- Consider image security scanning

## GitHub Example

Here's a minimal GitHub setup:

1. **Create repository:** `my-docker-templates`
2. **Add registry.json:**
   ```json
   {
     "$schema": "https://github.com/getarcaneapp/arcane-templates/schema.json",
     "name": "My Templates",
     "description": "Custom Docker templates",
     "version": "1.0.0",
     "author": "Acme Corp",
     "url": "https://github.com/username/my-docker-templates",
     "templates": [
       {
         "id": "wordpress",
         "name": "WordPress",
         "description": "Production-ready WordPress with MariaDB and health checks.",
         "version": "1.2.3",
         "author": "Acme Corp",
         "compose_url": "https://raw.githubusercontent.com/username/my-docker-templates/main/wordpress/docker-compose.yml",
         "env_url": "https://raw.githubusercontent.com/username/my-docker-templates/main/wordpress/.env.example",
         "documentation_url": "https://raw.githubusercontent.com/username/my-docker-templates/main/wordpress/README.md",
         "tags": ["cms", "php", "wordpress"]
       }
     ]
   }
   ```
3. **Registry URL:** `https://raw.githubusercontent.com/username/my-docker-templates/main/registry.json`

## Community Registry

Don't want to maintain your own? Contribute to our community registry:

**GitHub:** [https://github.com/getarcaneapp/arcane-templates](https://github.com/getarcaneapp/arcane-templates)

Submit pull requests to add your templates to the community collection!

## Troubleshooting

**Registry not loading?**

- Check JSON syntax and validate against the schema
- Verify URL accessibility and HTTPS
- Ensure CORS headers if using a custom domain
- Confirm no additional/unknown fields are present

**Templates not downloading?**

- Verify direct download links for all files
- Check that files exist at specified URLs
- Ensure proper file permissions are set
- Look for errors in the browser
